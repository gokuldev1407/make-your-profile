import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { RESUME_TEMPLATES } from './resumeTemplates';
import type { PortfolioData } from '../types/portfolio';

function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, (tag) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

function buildColors(templateId?: string) {
  const tmpl = RESUME_TEMPLATES.find(t => t.id === templateId) ?? RESUME_TEMPLATES[0];
  return {
    primary: '#' + tmpl.colors.primary,
    primaryDark: '#' + tmpl.colors.primaryDark,
    accent: '#' + tmpl.colors.accent,
    gray: '#' + tmpl.colors.gray,
    grayLight: '#' + tmpl.colors.grayLight,
    lightBg: '#' + tmpl.colors.lightBg,
    white: '#' + tmpl.colors.white,
    black: '#' + tmpl.colors.black,
    border: '#' + tmpl.colors.border,
    success: '#' + tmpl.colors.success,
    headerText: '#' + tmpl.colors.headerText,
    previewBg: tmpl.previewBg
  };
}

export const exportPdf = async (data: PortfolioData, templateId?: string): Promise<void> => {
  const C = buildColors(templateId);
  
  // Create an off-screen wrapper to hide the container from the user
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '200vw'; // Way off screen
  wrapper.style.top = '0';
  document.body.appendChild(wrapper);

  const container = document.createElement('div');
  container.id = 'pdf-resume-render-container';
  Object.assign(container.style, {
    width: '794px', // A4 pixel width at 96 DPI
    backgroundColor: '#ffffff',
    color: C.black,
    fontFamily: 'Calibri, "Helvetica Neue", Helvetica, Arial, sans-serif',
    padding: '37px 53px',
    boxSizing: 'border-box'
  });

  // Build the contact string
  const contactItems: string[] = [escapeHtml(data.personalInfo.location)];
  if (data.personalInfo.email) contactItems.push(escapeHtml(data.personalInfo.email));
  if (data.personalInfo.phone) contactItems.push(escapeHtml(data.personalInfo.phone));
  if (data.personalInfo.socialLinks.linkedin) contactItems.push('LinkedIn');
  if (data.personalInfo.socialLinks.github) contactItems.push('GitHub');
  if (data.personalInfo.socialLinks.portfolio) contactItems.push('Portfolio');
  const contactHtml = contactItems.join(` &nbsp; <span style="color: ${C.grayLight};">|</span> &nbsp; `);

  let skillsHtml = '<div style="display: flex; flex-wrap: wrap; margin-bottom: 20px;">';
  data.skills.forEach(skill => {
    skillsHtml += `
      <div style="width: 50%; box-sizing: border-box; padding-right: 20px; margin-bottom: 15px; border-bottom: 1px solid ${C.border}; padding-bottom: 10px;">
        <div style="font-weight: bold; color: ${C.primaryDark}; margin-bottom: 4px; font-size: 10pt;">${escapeHtml(skill.category)}</div>
        <div style="color: ${C.gray}; font-size: 9pt;">${escapeHtml(skill.items.join(' • '))}</div>
      </div>
    `;
  });
  skillsHtml += '</div>';

  let experienceHtml = '';
  data.experience.forEach(exp => {
    experienceHtml += `
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 4px;">
          <div style="font-size: 13pt;">
            <strong style="color: ${C.black};">${escapeHtml(exp.role)}</strong> 
            <span style="color: ${C.grayLight}; margin: 0 4px;">@</span> 
            <span style="color: ${C.primary}; font-weight: bold; font-size: 11pt;">${escapeHtml(exp.company)}</span>
          </div>
          <div style="font-size: 9pt; color: ${C.gray}; font-style: italic;">
            ${escapeHtml(exp.startDate)} - ${escapeHtml(exp.endDate)}
          </div>
        </div>
        <div style="font-size: 9pt; color: ${C.grayLight}; margin-bottom: 8px;">
          ${escapeHtml(exp.location)} ${exp.current ? `<span style="color: ${C.success}; font-weight: bold; margin-left: 10px;">• CURRENT</span>` : ''}
        </div>
        <ul style="margin: 0; padding-left: 20px; color: ${C.black}; font-size: 10pt;">
          ${exp.achievements.map(ach => `<li style="margin-bottom: 4px;">${escapeHtml(ach)}</li>`).join('')}
        </ul>
      </div>
    `;
  });

  let projectsHtml = '';
  data.projects.forEach(proj => {
    projectsHtml += `
      <div style="margin-bottom: 20px;">
        <div style="font-size: 12pt; font-weight: bold; color: ${C.black}; margin-bottom: 4px;">
          ${escapeHtml(proj.title)} ${proj.featured ? '★' : ''}
        </div>
        <div style="font-size: 9pt; margin-bottom: 8px;">
          <strong style="color: ${C.gray};">Stack:</strong> 
          <span style="color: ${C.primary};">${escapeHtml(proj.techStack.join(' • '))}</span>
        </div>
        <div style="color: ${C.black}; font-size: 10pt; margin-left: 10px; padding-left: 0;">
          <ul><li style="margin-bottom: 4px;">${escapeHtml(proj.description)}</li></ul>
        </div>
      </div>
    `;
  });

  let educationHtml = '';
  data.education.forEach(edu => {
    educationHtml += `
      <div style="margin-bottom: 15px;">
        <div style="font-size: 12pt; font-weight: bold; color: ${C.black}; margin-bottom: 4px;">
          ${escapeHtml(edu.degree)} in ${escapeHtml(edu.field)}
        </div>
        <div style="font-size: 10pt; color: ${C.gray}; margin-bottom: 4px;">
          <strong style="color: ${C.primary}; font-size: 11pt;">${escapeHtml(edu.institution)}</strong> 
          <span style="color: ${C.grayLight};">|</span> ${escapeHtml(edu.startDate)} ${edu.endDate ? `- ${escapeHtml(edu.endDate)}` : ''} 
          <span style="color: ${C.grayLight};">|</span> ${escapeHtml(edu.location)}
          ${edu.gpa ? `<span style="color: ${C.grayLight};">|</span> <strong>GPA: ${escapeHtml(edu.gpa)}</strong>` : ''}
        </div>
        ${edu.details && edu.details.length > 0 ? `
          <ul style="margin: 4px 0 0 0; padding-left: 20px; color: ${C.black}; font-size: 10pt;">
            ${edu.details.map(d => `<li style="margin-bottom: 2px;">${escapeHtml(d)}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `;
  });

  const sectionLabel = (title: string) => `
    <div style="background-color: ${C.primaryDark}; color: ${C.white}; padding: 4px 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-size: 15px; margin-top: 24px; margin-bottom: 7px; text-align: left;">
      &nbsp;&nbsp;${title}&nbsp;&nbsp;
    </div>
  `;

  container.innerHTML = `
    <!-- Header -->
    <div style="background-color: ${C.accent}; padding: 30px; text-align: center; color: #fff; margin: -37px -53px 0 -53px;">
      <h1 style="margin: 0; font-size: 32pt; font-weight: bold; letter-spacing: 1px;">${escapeHtml(data.personalInfo.name)}</h1>
      <p style="margin: 10px 0 0 0; font-size: 14pt; color: ${C.headerText}; font-weight: bold;">${escapeHtml(data.personalInfo.title)}</p>
    </div>
    
    <!-- Contact -->
    <div style="background-color: ${C.lightBg}; padding: 8px; text-align: center; font-size: 10pt; color: ${C.gray}; margin: 0 -53px;">
      ${contactHtml}
    </div>

    <div style="border-bottom: 1px solid ${C.headerText}; margin: 12px 0;"></div>

    <!-- Summary -->
    ${sectionLabel('Professional Summary')}
    <div style="font-size: 10pt; line-height: 1.5; color: ${C.black}; margin-bottom: 20px;">
      ${escapeHtml(data.personalInfo.bio)}
    </div>

    <!-- Skills -->
    ${sectionLabel('Technical Skills')}
    ${skillsHtml}

    <!-- Experience -->
    ${sectionLabel('Professional Experience')}
    ${experienceHtml}

    <!-- Projects -->
    ${sectionLabel('Notable Projects')}
    ${projectsHtml}

    <!-- Education -->
    ${sectionLabel('Education')}
    ${educationHtml}

    <!-- Certifications -->
    ${data.certifications && data.certifications.length > 0 ? `
      ${sectionLabel('Certifications')}
      ${data.certifications.map(cert => `
        <div style="margin-bottom: 12px;">
          <strong style="color: ${C.black}; font-size: 10pt;">${escapeHtml(cert.title)}</strong>
          <div style="font-size: 9pt; color: ${C.gray};">
            ${escapeHtml(cert.issuer)} | ${escapeHtml(cert.date)}
          </div>
        </div>
      `).join('')}
    ` : ''}

    <div style="margin-top: 40px; text-align: center; font-size: 8pt; color: ${C.grayLight}; border-top: 1px solid #E2E8F0; padding-top: 10px;">
      Generated via MakeYourProfile • ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
  `;

  wrapper.appendChild(container);

  // Delay for fonts/rendering
  await new Promise(r => setTimeout(r, 200));

  try {
    const dataUrl = await toPng(container, {
      backgroundColor: '#ffffff',
      width: 794,
      height: container.scrollHeight,
      pixelRatio: 2,
      skipFonts: false
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();

    const img = new Image();
    img.src = dataUrl;
    await new Promise(r => { img.onload = r; });

    const canvasAspect = img.height / img.width;
    const imgW = pdfW;
    const imgH = pdfW * canvasAspect;

    let remainingHeight = imgH;
    let yOffset = 0;
    let isFirstPage = true;

    while (remainingHeight > 0) {
      if (!isFirstPage) pdf.addPage();

      pdf.addImage(dataUrl, 'PNG', 0, -yOffset, imgW, imgH);

      yOffset += pdfH;
      remainingHeight -= pdfH;
      isFirstPage = false;
    }

    const safeName = data.personalInfo.name.replace(/\s+/g, '_');
    pdf.save(`${safeName}_Resume.pdf`);
  } catch (err: any) {
    console.error('PDF export failed:', err);
    alert(`Failed to export PDF: ${err?.message || 'Unknown error'}`);
  } finally {
    if (document.body.contains(wrapper)) {
      document.body.removeChild(wrapper);
    }
  }
};
