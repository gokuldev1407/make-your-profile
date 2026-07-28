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
} from 'docx';
import { saveAs } from 'file-saver';
import type { PortfolioData } from '../types/portfolio';

const COLORS = {
  primary: '6366F1',
  dark: '1E1B4B',
  gray: '6B7280',
  lightGray: 'F3F4F6',
  white: 'FFFFFF',
  black: '111827',
};

const FONTS = {
  heading: 'Calibri',
  body: 'Calibri',
};

function sectionDivider(): Paragraph {
  return new Paragraph({
    border: {
      bottom: {
        color: COLORS.primary,
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    spacing: { before: 200, after: 200 },
  });
}

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 26,
        color: COLORS.primary,
        font: FONTS.heading,
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 100 },
  });
}

function bulletPoint(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 20,
        font: FONTS.body,
        color: COLORS.black,
      }),
    ],
    bullet: { level: 0 },
    spacing: { after: 60 },
  });
}

function makeHyperlink(text: string, url: string): ExternalHyperlink {
  return new ExternalHyperlink({
    link: url,
    children: [
      new TextRun({
        text,
        style: 'Hyperlink',
        color: COLORS.primary,
        underline: { type: UnderlineType.SINGLE, color: COLORS.primary },
        font: FONTS.body,
        size: 20,
      }),
    ],
  });
}

export const exportDocx = async (data: PortfolioData): Promise<void> => {
  const { personalInfo, skills, experience, education, projects, certifications } = data;

  const children = [];

  // ── HEADER: Name ──────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personalInfo.name,
          bold: true,
          size: 52,
          color: COLORS.dark,
          font: FONTS.heading,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
    })
  );

  // Title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personalInfo.title,
          size: 28,
          color: COLORS.primary,
          bold: true,
          font: FONTS.heading,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
    })
  );

  // Contact Line
  const contactParts: (TextRun | ExternalHyperlink)[] = [];

  contactParts.push(
    new TextRun({ text: `${personalInfo.location}  |  `, size: 20, color: COLORS.gray, font: FONTS.body })
  );
  contactParts.push(
    makeHyperlink(personalInfo.email, `mailto:${personalInfo.email}`)
  );
  contactParts.push(new TextRun({ text: `  |  ${personalInfo.phone}`, size: 20, color: COLORS.gray, font: FONTS.body }));

  if (personalInfo.socialLinks.linkedin) {
    contactParts.push(new TextRun({ text: '  |  ', size: 20, color: COLORS.gray, font: FONTS.body }));
    contactParts.push(makeHyperlink('LinkedIn', personalInfo.socialLinks.linkedin));
  }
  if (personalInfo.socialLinks.github) {
    contactParts.push(new TextRun({ text: '  |  ', size: 20, color: COLORS.gray, font: FONTS.body }));
    contactParts.push(makeHyperlink('GitHub', personalInfo.socialLinks.github));
  }
  if (personalInfo.socialLinks.portfolio) {
    contactParts.push(new TextRun({ text: '  |  ', size: 20, color: COLORS.gray, font: FONTS.body }));
    contactParts.push(makeHyperlink('Portfolio', personalInfo.socialLinks.portfolio));
  }

  children.push(
    new Paragraph({
      children: contactParts,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  children.push(sectionDivider());

  // ── PROFESSIONAL SUMMARY ──────────────────────────────────────────────────
  children.push(sectionHeading('Professional Summary'));
  children.push(sectionDivider());
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personalInfo.bio,
          size: 20,
          color: COLORS.black,
          font: FONTS.body,
          italics: true,
        }),
      ],
      spacing: { after: 200 },
    })
  );

  // ── SKILLS ────────────────────────────────────────────────────────────────
  children.push(sectionHeading('Technical Skills'));
  children.push(sectionDivider());

  for (const skillCategory of skills) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${skillCategory.category}: `,
            bold: true,
            size: 20,
            font: FONTS.body,
            color: COLORS.dark,
          }),
          new TextRun({
            text: skillCategory.items.join(' • '),
            size: 20,
            font: FONTS.body,
            color: COLORS.black,
          }),
        ],
        spacing: { after: 80 },
      })
    );
  }

  // ── EXPERIENCE ────────────────────────────────────────────────────────────
  children.push(sectionHeading('Professional Experience'));
  children.push(sectionDivider());

  for (const exp of experience) {
    // Role + Company on one line
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: exp.role,
            bold: true,
            size: 24,
            font: FONTS.heading,
            color: COLORS.dark,
          }),
          new TextRun({
            text: `  —  ${exp.company}`,
            size: 22,
            font: FONTS.heading,
            color: COLORS.primary,
            bold: true,
          }),
        ],
        spacing: { before: 200, after: 40 },
      })
    );

    // Date + Location
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${exp.startDate} – ${exp.endDate}  |  ${exp.location}`,
            size: 18,
            color: COLORS.gray,
            font: FONTS.body,
            italics: true,
          }),
        ],
        spacing: { after: 100 },
      })
    );

    // Achievements as bullet points
    for (const achievement of exp.achievements) {
      children.push(bulletPoint(achievement));
    }
  }

  // ── PROJECTS ──────────────────────────────────────────────────────────────
  children.push(sectionHeading('Notable Projects'));
  children.push(sectionDivider());

  for (const project of projects) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: project.title,
            bold: true,
            size: 22,
            font: FONTS.heading,
            color: COLORS.dark,
          }),
        ],
        spacing: { before: 200, after: 40 },
      })
    );

    const techLine: (TextRun)[] = [
      new TextRun({
        text: 'Tech Stack: ',
        bold: true,
        size: 18,
        font: FONTS.body,
        color: COLORS.gray,
      }),
      new TextRun({
        text: project.techStack.join(', '),
        size: 18,
        font: FONTS.body,
        color: COLORS.primary,
        italics: true,
      }),
    ];

    if (project.liveUrl || project.githubUrl) {
      const links: (TextRun | ExternalHyperlink)[] = [...techLine];
      if (project.liveUrl) {
        links.push(new TextRun({ text: '   ', size: 18 }));
        links.push(makeHyperlink('[Live Demo]', project.liveUrl));
      }
      if (project.githubUrl) {
        links.push(new TextRun({ text: '  ', size: 18 }));
        links.push(makeHyperlink('[GitHub]', project.githubUrl));
      }
      children.push(new Paragraph({ children: links, spacing: { after: 60 } }));
    } else {
      children.push(new Paragraph({ children: techLine, spacing: { after: 60 } }));
    }

    children.push(bulletPoint(project.description));
  }

  // ── EDUCATION ─────────────────────────────────────────────────────────────
  children.push(sectionHeading('Education'));
  children.push(sectionDivider());

  for (const edu of education) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${edu.degree} in ${edu.field}`,
            bold: true,
            size: 22,
            font: FONTS.heading,
            color: COLORS.dark,
          }),
        ],
        spacing: { before: 160, after: 40 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${edu.institution}  |  ${edu.startDate} – ${edu.endDate}`,
            size: 20,
            color: COLORS.primary,
            font: FONTS.body,
            bold: true,
          }),
          ...(edu.gpa
            ? [
                new TextRun({
                  text: `  |  GPA: ${edu.gpa}`,
                  size: 20,
                  color: COLORS.gray,
                  font: FONTS.body,
                }),
              ]
            : []),
        ],
        spacing: { after: 100 },
      })
    );

    if (edu.details) {
      for (const detail of edu.details) {
        children.push(bulletPoint(detail));
      }
    }
  }

  // ── CERTIFICATIONS ────────────────────────────────────────────────────────
  if (certifications.length > 0) {
    children.push(sectionHeading('Certifications'));
    children.push(sectionDivider());

    for (const cert of certifications) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${cert.title}`,
              bold: true,
              size: 20,
              color: COLORS.dark,
              font: FONTS.body,
            }),
            new TextRun({
              text: `  —  ${cert.issuer}  |  ${cert.date}`,
              size: 20,
              color: COLORS.gray,
              font: FONTS.body,
            }),
          ],
          spacing: { before: 80, after: 60 },
        })
      );
    }
  }

  // ── BUILD & SAVE ──────────────────────────────────────────────────────────
  const doc = new Document({
    creator: personalInfo.name,
    title: `${personalInfo.name} — Resume`,
    description: `Resume for ${personalInfo.name}, ${personalInfo.title}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 900,
              bottom: 720,
              left: 900,
            },
          },
        },
        children,
      },
    ],
    styles: {
      default: {
        document: {
          run: {
            font: FONTS.body,
            size: 20,
            color: COLORS.black,
          },
        },
      },
    },
  });

  const blob = await Packer.toBlob(doc);
  const safeName = personalInfo.name.replace(/\s+/g, '_');
  saveAs(blob, `${safeName}_Resume.docx`);
};
