import { saveAs } from 'file-saver';
import type { PortfolioData } from '../types/portfolio';
// Generates a standalone HTML file identical to the live React portfolio view
export const exportHtml = (data: PortfolioData, isDark: boolean = false): void => {
  const element = document.getElementById('portfolio-view');
  if (!element) {
    alert('Portfolio view not found. Please switch to Preview mode first.');
    return;
  }

  const bodyBg = isDark ? '#020617' : 'linear-gradient(to right, #9df5f9, #c7dcff, #e4d4ff, #ffccf0)';
  const textColor = isDark ? '#ffffff' : '#1e293b';
  const navBg = isDark ? 'rgba(15, 23, 42, 0.85)' : 'linear-gradient(to right, rgba(157,245,249,0.95), rgba(199,220,255,0.95), rgba(228,212,255,0.95), rgba(255,204,240,0.95))';
  const navTextColor = isDark ? '#ffffff' : '#1e293b';
  const navLinkColor = isDark ? '#94a3b8' : '#64748b';
  const navActiveHoverBg = isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)';
  const navBorderColor = isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)';
  const extraCss = '';

  // 1. Force all projects visible
  const showMoreBtn = document.getElementById('show-more-projects-btn') as HTMLButtonElement | null;
  let clickedShowMore = false;
  if (showMoreBtn && showMoreBtn.textContent && showMoreBtn.textContent.includes('Show All')) {
    showMoreBtn.click();
    clickedShowMore = true;
  }

  // 2. Clone live DOM
  const clone = element.cloneNode(true) as HTMLElement;

  // Restore show-more state
  if (clickedShowMore && showMoreBtn) showMoreBtn.click();

  // 3. Clean clone
  clone.style.height = 'auto';
  clone.style.overflow = 'visible';
  clone.style.maxHeight = 'none';

  // Remove dev attributes
  clone.querySelectorAll('*').forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('data-vite') || attr.name.startsWith('data-react'))
        el.removeAttribute(attr.name);
    });
  });

  // Remove scroll bounce indicator and show-more button
  const scrollInd = clone.querySelector('.animate-bounce');
  if (scrollInd) scrollInd.remove();
  const showMoreClone = clone.querySelector('#show-more-projects-btn');
  if (showMoreClone) showMoreClone.remove();

  // 5. Collect custom style tags
  const rawStyleTags = Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .filter(css => !css.includes('@import "tailwindcss"') && !css.includes("@import 'tailwindcss'") && css.trim().length > 0)
    .join('\n');

  const hasCerts = data.certifications && data.certifications.length > 0;

  const htmlContent = `<!DOCTYPE html>
<html lang="en" class="${isDark ? 'dark' : ''}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${data.personalInfo.title} portfolio">
  <title>${data.personalInfo.name} | ${data.personalInfo.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script>
    (function() {
      const avatar = "${data.personalInfo.avatar || ''}";
      if (!avatar) return;
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(32, 32, 32, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 0, 0, 64, 64);
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.type = "image/png";
        link.href = canvas.toDataURL("image/png");
      };
      img.src = avatar;
    })();
  <\/script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: { extend: { colors: { slate: { 950: '#020617' } }, fontFamily: { sans: ['Inter','-apple-system','BlinkMacSystemFont','Segoe UI','sans-serif'], mono: ['JetBrains Mono','monospace'] } } }
    }
  <\/script>
  <style>
    *,*::before,*::after{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:0;min-height:100vh;background:${bodyBg};color:${textColor};-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
    #portfolio-view{min-height:100vh;background:${bodyBg}!important;height:auto!important;overflow:visible!important;max-height:none!important}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:linear-gradient(#6366f1,#a855f7);border-radius:4px}
    *{scrollbar-width:thin;scrollbar-color:#6366f1 transparent}
    ::selection{background-color:#6366f1;color:#fff}
    @keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    .animate-fade-in-up{animation:fadeInUp .6s ease-out both}
    .animate-fade-in{animation:fadeIn .4s ease-out both}
    .animate-float{animation:float 6s ease-in-out infinite}
    .animate-pulse{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite}
    .gradient-text{background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite}
    .backdrop-blur-xl{-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px)}
    .delay-100{animation-delay:100ms}.delay-200{animation-delay:200ms}.delay-300{animation-delay:300ms}.delay-400{animation-delay:400ms}.delay-500{animation-delay:500ms}
    svg{display:inline-block;vertical-align:middle;flex-shrink:0}
    #export-nav{position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;align-items:center;justify-content:space-between;padding:10px 28px;background:${navBg};-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px);border-bottom:1px solid ${navBorderColor};border-radius:0 0 20px 20px;box-shadow:0 4px 32px rgba(99,102,241,.1);transition:box-shadow .3s}
    #export-nav .logo{font-weight:800;font-size:1.1rem;text-decoration:none;color:${navTextColor}}
    #export-nav .logo span{background:linear-gradient(to right,#6366f1,#a855f7);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
    #export-nav .links{display:flex;gap:2px;flex-wrap:wrap}
    #export-nav .links a{font-size:.78rem;font-weight:600;text-decoration:none;padding:5px 11px;border-radius:8px;color:${navLinkColor};transition:background .2s,color .2s}
    #export-nav .links a:hover,#export-nav .links a.active{color:#6366f1;background:${navActiveHoverBg}}
    #portfolio-view>section:first-child{padding-top:90px}
    ${rawStyleTags}
    ${extraCss}
  </style>
</head>
<body class="${isDark ? 'dark' : ''} font-sans antialiased">
  <header id="export-nav">
    <a href="#about" class="logo">${data.personalInfo.name}<span> Portfolio</span></a>
    <nav class="links">
      <a href="#about">About</a>
      <a href="#skills">Skills</a>
      <a href="#experience">Experience</a>
      <a href="#projects">Projects</a>
      <a href="#education">Education</a>
      ${hasCerts ? '<a href="#certifications">Certifications</a>' : ''}
      <a href="#contact">Contact</a>
    </nav>
  </header>
  ${clone.outerHTML}
  <script>
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click',e=>{e.preventDefault();const el=document.querySelector(a.getAttribute('href'));if(el)el.scrollIntoView({behavior:'smooth',block:'start'})});
    });
    const navLinks=document.querySelectorAll('#export-nav .links a');
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(l=>{l.classList.remove('active');if(l.getAttribute('href')==='#'+entry.target.id)l.classList.add('active')});}});
    },{threshold:.35});
    document.querySelectorAll('section[id]').forEach(s=>observer.observe(s));
    const nav=document.getElementById('export-nav');
    window.addEventListener('scroll',()=>{nav.style.boxShadow=window.scrollY>10?'0 8px 40px rgba(99,102,241,.2)':'0 4px 32px rgba(99,102,241,.1)'});
  <\/script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const safeName = data.personalInfo.name.replace(/\s+/g, '_');
  saveAs(blob, `${safeName}_Portfolio.html`);
};
