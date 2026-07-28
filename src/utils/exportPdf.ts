import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportPdf = async (name = 'Portfolio'): Promise<void> => {
  const element = document.getElementById('portfolio-view');
  if (!element) {
    alert('Portfolio view not found. Please switch to Preview mode first.');
    return;
  }

  // Temporarily expand the portfolio for full capture
  const originalStyle = element.style.cssText;
  element.style.height = 'auto';
  element.style.overflow = 'visible';

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scrollY: -window.scrollY,
      windowWidth: 1200,
      windowHeight: element.scrollHeight,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Additional pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const safeName = name.replace(/\s+/g, '_');
    pdf.save(`${safeName}_Resume.pdf`);
  } finally {
    element.style.cssText = originalStyle;
  }
};
