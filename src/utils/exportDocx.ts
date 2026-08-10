import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  ExternalHyperlink,
  UnderlineType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  VerticalAlign,
  TableLayoutType,
} from 'docx';
import { saveAs } from 'file-saver';
import type { PortfolioData } from '../types/portfolio';
import { RESUME_TEMPLATES } from './resumeTemplates';

const FONT = 'Calibri';

function buildColors(templateId?: string) {
  const tmpl = RESUME_TEMPLATES.find(t => t.id === templateId) ?? RESUME_TEMPLATES[0];
  return {
    primary:     tmpl.colors.primary,
    primaryDark: tmpl.colors.primaryDark,
    accent:      tmpl.colors.accent,
    gray:        tmpl.colors.gray,
    grayLight:   tmpl.colors.grayLight,
    lightBg:     tmpl.colors.lightBg,
    white:       tmpl.colors.white,
    black:       tmpl.colors.black,
    border:      tmpl.colors.border,
    success:     tmpl.colors.success,
    headerText:  tmpl.colors.headerText,
  };
}

function hr(colorHex: string, thickness = 8): Paragraph {
  return new Paragraph({
    border: { bottom: { color: colorHex, space: 1, style: BorderStyle.SINGLE, size: thickness } },
    spacing: { before: 0, after: 100 },
  });
}

function spacer(pts = 80): Paragraph {
  return new Paragraph({ spacing: { before: 0, after: pts }, children: [new TextRun('')] });
}

function sectionLabel(text: string, C: ReturnType<typeof buildColors>): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: '  ' + text.toUpperCase() + '  ', bold: true, size: 22, color: C.white, font: FONT, allCaps: true, characterSpacing: 60 })],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 0 },
    shading: { type: ShadingType.SOLID, color: C.primaryDark, fill: C.primaryDark },
    alignment: AlignmentType.LEFT,
  });
}

function bullet(text: string, C: ReturnType<typeof buildColors>): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, font: FONT, color: C.black })],
    bullet: { level: 0 },
    indent: { left: 360 },
    spacing: { after: 60 },
  });
}

function makeLink(label: string, url: string, C: ReturnType<typeof buildColors>): ExternalHyperlink {
  return new ExternalHyperlink({
    link: url,
    children: [new TextRun({ text: label, style: 'Hyperlink', color: C.primary, underline: { type: UnderlineType.SINGLE, color: C.primary }, font: FONT, size: 20 })],
  });
}

function sep(size = 20, C: ReturnType<typeof buildColors> = buildColors()): TextRun {
  return new TextRun({ text: '  |  ', size, color: C.grayLight, font: FONT });
}

function skillsTable(skills: PortfolioData['skills'], C: ReturnType<typeof buildColors>): Table {
  const rows: TableRow[] = [];
  for (let i = 0; i < skills.length; i += 2) {
    const makeCell = (cat: PortfolioData['skills'][0] | undefined): TableCell => {
      if (!cat) return new TableCell({ children: [], width: { size: 50, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } });
      return new TableCell({
        width: { size: 50, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.TOP,
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE, color: C.border, size: 4 }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
        children: [
          new Paragraph({ children: [new TextRun({ text: cat.category, bold: true, size: 20, font: FONT, color: C.primaryDark })], spacing: { after: 40 } }),
          new Paragraph({ children: [new TextRun({ text: cat.items.join(' · '), size: 18, font: FONT, color: C.gray })], spacing: { after: 0 } }),
        ],
      });
    };
    rows.push(new TableRow({ children: [makeCell(skills[i]), makeCell(skills[i + 1])] }));
  }
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
    rows,
  });
}

export const exportDocx = async (data: PortfolioData, templateId?: string): Promise<void> => {
  const C = buildColors(templateId);
  const { personalInfo, skills, experience, education, projects, certifications } = data;
  const children: (Paragraph | Table)[] = [];

  // ── HEADER BANNER (dark navy shaded) ─────────────────────────────────────
  children.push(new Paragraph({
    children: [new TextRun({ text: personalInfo.name, bold: true, size: 64, color: C.white, font: FONT })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60 },
    shading: { type: ShadingType.SOLID, color: C.accent, fill: C.accent },
  }));

  children.push(new Paragraph({
    children: [new TextRun({ text: personalInfo.title, size: 28, color: C.headerText, bold: true, font: FONT })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 140 },
    shading: { type: ShadingType.SOLID, color: C.accent, fill: C.accent },
  }));

  // Contact info bar (light gray background)
  const contactParts: (TextRun | ExternalHyperlink)[] = [
    new TextRun({ text: personalInfo.location, size: 20, color: C.gray, font: FONT }),
    sep(20, C),
    makeLink(personalInfo.email, 'mailto:' + personalInfo.email, C),
  ];
  if (personalInfo.phone) {
    contactParts.push(sep(20, C));
    contactParts.push(new TextRun({ text: personalInfo.phone, size: 20, color: C.gray, font: FONT }));
  }
  if (personalInfo.socialLinks.linkedin) {
    contactParts.push(sep(20, C));
    contactParts.push(makeLink('LinkedIn', personalInfo.socialLinks.linkedin, C));
  }
  if (personalInfo.socialLinks.github) {
    contactParts.push(sep(20, C));
    contactParts.push(makeLink('GitHub', personalInfo.socialLinks.github, C));
  }
  if (personalInfo.socialLinks.portfolio) {
    contactParts.push(sep(20, C));
    contactParts.push(makeLink('Portfolio', personalInfo.socialLinks.portfolio, C));
  }
  children.push(new Paragraph({
    children: contactParts,
    alignment: AlignmentType.CENTER,
    spacing: { after: 0 },
    shading: { type: ShadingType.SOLID, color: C.lightBg, fill: C.lightBg },
  }));

  children.push(spacer(20));
  children.push(hr(C.headerText, 6));

  // ── PROFESSIONAL SUMMARY ──────────────────────────────────────────────────
  children.push(sectionLabel('Professional Summary', C));
  children.push(spacer(100));
  children.push(new Paragraph({
    children: [new TextRun({ text: personalInfo.bio, size: 20, color: C.black, font: FONT })],
    spacing: { after: 120 },
  }));

  // ── SKILLS (2-column table layout) ────────────────────────────────────────
  children.push(sectionLabel('Technical Skills', C));
  children.push(spacer(100));
  children.push(skillsTable(skills, C));
  children.push(spacer(80));

  // ── PROFESSIONAL EXPERIENCE ───────────────────────────────────────────────
  children.push(sectionLabel('Professional Experience', C));

  for (const exp of experience) {
    children.push(spacer(80));

    const companyPart: (TextRun | ExternalHyperlink)[] = exp.companyUrl
      ? [makeLink(exp.company, exp.companyUrl, C)]
      : [new TextRun({ text: exp.company, size: 22, font: FONT, color: C.primary, bold: true })];

    children.push(new Paragraph({
      children: [
        new TextRun({ text: exp.role, bold: true, size: 26, font: FONT, color: C.black }),
        new TextRun({ text: '  @  ', size: 22, font: FONT, color: C.grayLight }),
        ...companyPart,
      ],
      spacing: { before: 60, after: 30 },
    }));

    const metaParts: TextRun[] = [
      new TextRun({ text: exp.startDate + ' - ' + exp.endDate, size: 18, color: C.gray, font: FONT, italics: true }),
      new TextRun({ text: '  •  ' + exp.location, size: 18, color: C.grayLight, font: FONT }),
    ];
    if (exp.current) {
      metaParts.push(new TextRun({ text: '  ● CURRENT', size: 16, color: C.success, font: FONT, bold: true }));
    }
    children.push(new Paragraph({ children: metaParts, spacing: { after: 80 } }));

    for (const ach of exp.achievements) children.push(bullet(ach, C));
  }

  // ── NOTABLE PROJECTS ──────────────────────────────────────────────────────
  children.push(sectionLabel('Notable Projects', C));

  for (const proj of projects) {
    children.push(spacer(80));
    children.push(new Paragraph({
      children: [new TextRun({ text: proj.title + (proj.featured ? '  ★' : ''), bold: true, size: 24, font: FONT, color: C.black })],
      spacing: { before: 60, after: 30 },
    }));

    const techParts: (TextRun | ExternalHyperlink)[] = [
      new TextRun({ text: 'Stack: ', bold: true, size: 18, font: FONT, color: C.gray }),
      new TextRun({ text: proj.techStack.join(' · '), size: 18, font: FONT, color: C.primary }),
    ];
    if (proj.liveUrl) {
      techParts.push(new TextRun({ text: '   ', size: 18 }));
      techParts.push(makeLink('[Live Demo]', proj.liveUrl, C));
    }
    if (proj.githubUrl) {
      techParts.push(new TextRun({ text: '  ', size: 18 }));
      techParts.push(makeLink('[GitHub]', proj.githubUrl, C));
    }
    children.push(new Paragraph({ children: techParts, spacing: { after: 60 } }));
    children.push(bullet(proj.description, C));
  }

  // ── EDUCATION ─────────────────────────────────────────────────────────────
  children.push(sectionLabel('Education', C));

  for (const edu of education) {
    children.push(spacer(80));
    children.push(new Paragraph({
      children: [new TextRun({ text: edu.degree + ' in ' + edu.field, bold: true, size: 24, font: FONT, color: C.black })],
      spacing: { before: 60, after: 30 },
    }));

    const eduMeta: TextRun[] = [
      new TextRun({ text: edu.institution, size: 22, color: C.primary, font: FONT, bold: true }),
      new TextRun({ text: '  |  ' + edu.startDate + (edu.endDate ? ' - ' + edu.endDate : ''), size: 20, color: C.gray, font: FONT }),
      new TextRun({ text: '  |  ' + edu.location, size: 18, color: C.grayLight, font: FONT }),
    ];
    if (edu.gpa) eduMeta.push(new TextRun({ text: '  |  GPA: ' + edu.gpa, size: 18, color: C.gray, font: FONT, bold: true }));
    children.push(new Paragraph({ children: eduMeta, spacing: { after: 80 } }));

    if (edu.details) for (const d of edu.details) children.push(bullet(d, C));
  }

  // ── CERTIFICATIONS ────────────────────────────────────────────────────────
  if (certifications.length > 0) {
    children.push(sectionLabel('Certifications', C));
    children.push(spacer(80));
    for (const cert of certifications) {
      const certParts: (TextRun | ExternalHyperlink)[] = [
        new TextRun({ text: cert.title, bold: true, size: 20, color: C.black, font: FONT }),
        new TextRun({ text: '  —  ' + cert.issuer + '  |  ' + cert.date, size: 18, color: C.gray, font: FONT }),
      ];
      if (cert.credentialUrl) {
        certParts.push(new TextRun({ text: '   ', size: 18 }));
        certParts.push(makeLink('[Verify Credential]', cert.credentialUrl, C));
      }
      children.push(new Paragraph({ children: certParts, spacing: { before: 60, after: 80 } }));
    }
  }

  // ── FOOTER ────────────────────────────────────────────────────────────────
  children.push(spacer(160));
  children.push(hr('E2E8F0', 4));
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  children.push(new Paragraph({
    children: [new TextRun({ text: 'Generated via MakeYourProfile  •  ' + today, size: 16, color: C.grayLight, font: FONT, italics: true })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 80 },
  }));

  // ── BUILD & SAVE ──────────────────────────────────────────────────────────
  const doc = new Document({
    creator: personalInfo.name,
    title: personalInfo.name + ' — Resume',
    description: 'Resume of ' + personalInfo.name + ', ' + personalInfo.title,
    sections: [{
      properties: { page: { margin: { top: 560, right: 800, bottom: 560, left: 800 } } },
      children,
    }],
    styles: {
      default: { document: { run: { font: FONT, size: 20, color: C.black } } },
    },
  });

  const blob = await Packer.toBlob(doc);
  const safeName = personalInfo.name.replace(/\s+/g, '_');
  saveAs(blob, safeName + '_Resume.docx');
};

