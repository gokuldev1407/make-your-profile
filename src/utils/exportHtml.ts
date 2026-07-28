import { saveAs } from 'file-saver';
import type { PortfolioData } from '../types/portfolio';

// Generates a standalone HTML file by snapshotting the actual React DOM
export const exportHtml = (data: PortfolioData, isDark: boolean = false): void => {
  const element = document.getElementById('portfolio-view');
  
  if (!element) {
    alert('Portfolio view not found. Please switch to Preview mode first.');
    return;
  }

  // Clone the element so we don't modify the actual live DOM
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Remove any dynamic heights or overflows that might constrain the static page
  clone.style.height = 'auto';
  clone.style.overflow = 'visible';
  clone.style.maxHeight = 'none';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en" class="${isDark ? 'dark' : ''}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Resume</title>
    <!-- Inject Tailwind CSS immediately for exact design replication -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    // We don't need exact config extensions if standard classes are used,
                    // but we ensure darkMode is set to class so the background colors stick.
                }
            }
        }
    </script>
    <style>
        body { 
            background-color: ${isDark ? '#0f172a' : '#f8fafc'};
            color: ${isDark ? '#f8fafc' : '#0f172a'};
            /* Remove scrollbars from the exported body if they overlap */
            margin: 0;
            padding: 0;
            min-height: 100vh;
        }
        /* Make sure the portfolio view expands fully */
        #portfolio-view {
            height: auto !important;
            overflow: visible !important;
            max-height: none !important;
        }
    </style>
</head>
<body class="${isDark ? 'dark bg-slate-900 text-slate-50' : 'bg-slate-50 text-slate-900'}">
    <!-- Snapshot of the exact styling and SVG icons from the React App -->
    ${clone.outerHTML}
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const safeName = data.personalInfo.name.replace(/\s+/g, '_');
  saveAs(blob, `${safeName}_Resume.html`);
};

