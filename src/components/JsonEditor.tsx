import React, { useState } from 'react';
import {
  AlertCircle,
  User, Phone, GraduationCap, Briefcase,
  FileJson, FormInput, ChevronDown, ChevronRight,
  Plus, Trash2, ClipboardCheck, CheckCircle2,
  FileDown, Code2, Download
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { exportDocx } from '../utils/exportDocx';
import { exportHtml } from '../utils/exportHtml';
import type { PortfolioData, PersonalInfo, SocialLinks } from '../types/portfolio';

// ─── JSON slice types ─────────────────────────────────────────────────────────
type PersonalSlice = { name: string; title: string; bio: string; avatar?: string };
type ContactSlice  = { email: string; phone: string; location: string; socialLinks: SocialLinks };
type EducationSlice    = { education: PortfolioData['education']; certifications: PortfolioData['certifications'] };
type ProfessionalSlice = { skills: PortfolioData['skills']; experience: PortfolioData['experience'] };
type ProjectsSlice     = { projects: PortfolioData['projects'] };

// ─── Validators ───────────────────────────────────────────────────────────────
function validatePersonal(v: PersonalSlice) {
  const e: string[] = [];
  if (!v.name?.trim())  e.push('"name" is required');
  if (!v.title?.trim()) e.push('"title" is required');
  if (!v.bio?.trim())   e.push('"bio" is required');
  return e;
}
function validateContact(v: ContactSlice) {
  const e: string[] = [];
  if (!v.email?.trim())    e.push('"email" is required');
  if (!v.phone?.trim())    e.push('"phone" is required');
  if (!v.location?.trim()) e.push('"location" is required');
  return e;
}
function validateEducation(v: EducationSlice) {
  const e: string[] = [];
  if (!Array.isArray(v.education))       e.push('"education" must be an array');
  if (!Array.isArray(v.certifications))  e.push('"certifications" must be an array');
  (v.education ?? []).forEach((ed, i) => {
    if (!ed.institution?.trim()) e.push(`education[${i}] missing "institution"`);
    if (!ed.degree?.trim())      e.push(`education[${i}] missing "degree"`);
    if (!ed.field?.trim())       e.push(`education[${i}] missing "field"`);
  });
  return e;
}
function validateProfessional(v: ProfessionalSlice) {
  const e: string[] = [];
  if (!Array.isArray(v.skills))     e.push('"skills" must be an array');
  if (!Array.isArray(v.experience)) e.push('"experience" must be an array');
  (v.experience ?? []).forEach((ex, i) => {
    if (!ex.company?.trim()) e.push(`experience[${i}] missing "company"`);
    if (!ex.role?.trim())    e.push(`experience[${i}] missing "role"`);
  });
  return e;
}
function validateProjects(v: ProjectsSlice) {
  const e: string[] = [];
  if (!Array.isArray(v.projects)) e.push('"projects" must be an array');
  (v.projects ?? []).forEach((p, i) => {
    if (!p.title?.trim()) e.push(`projects[${i}] missing "title"`);
  });
  return e;
}

// ─── Extractors ───────────────────────────────────────────────────────────────
const extractPersonal = (info: PersonalInfo): PersonalSlice =>
  ({ name: info.name, title: info.title, bio: info.bio, avatar: info.avatar });
const extractContact = (info: PersonalInfo): ContactSlice =>
  ({ email: info.email, phone: info.phone, location: info.location, socialLinks: info.socialLinks ?? {} });
const extractEducation = (d: PortfolioData): EducationSlice =>
  ({ education: d.education, certifications: d.certifications });
const extractProfessional = (d: PortfolioData): ProfessionalSlice =>
  ({ skills: d.skills, experience: d.experience });
const extractProjects = (d: PortfolioData): ProjectsSlice =>
  ({ projects: d.projects });

// ─── JSON Panel ───────────────────────────────────────────────────────────────
interface JsonPanelProps {
  isDark: boolean; initialJson: string;
  validate: (p: unknown) => string[]; onApply: (p: unknown) => void;
}
const JsonPanel: React.FC<JsonPanelProps> = ({ isDark, initialJson, validate, onApply }) => {
  const [text, setText] = useState(initialJson);
  const [parseErr, setParseErr] = useState<string | null>(null);
  const [valErrs, setValErrs] = useState<string[]>([]);
  const [applied, setApplied] = useState(false);

  React.useEffect(() => { setText(initialJson); setParseErr(null); setValErrs([]); setApplied(false); }, [initialJson]);

  const handleApply = () => {
    setParseErr(null); setValErrs([]); setApplied(false);
    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch (e) { setParseErr((e as Error).message); return; }
    const errs = validate(parsed);
    if (errs.length) { setValErrs(errs); return; }
    onApply(parsed); setApplied(true); setTimeout(() => setApplied(false), 3000);
  };

  const hasError = !!parseErr || valErrs.length > 0;
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Edit JSON, then click Apply</span>
        <div className="flex items-center gap-2">
          {applied && <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold"><CheckCircle2 size={13}/>Applied!</span>}
          {hasError && !applied && <span className="flex items-center gap-1 text-xs text-red-400 font-semibold"><AlertCircle size={13}/>Fix errors</span>}
          <button onClick={handleApply} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-200">
            <ClipboardCheck size={14}/>Validate &amp; Apply
          </button>
        </div>
      </div>
      {parseErr && (
        <div className="mb-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
          <p className="font-bold mb-1">⚠ JSON Syntax Error</p><p>{parseErr}</p>
        </div>
      )}
      {valErrs.length > 0 && (
        <div className="mb-3 px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
          <p className="font-bold mb-1.5">⚠ Missing or invalid fields:</p>
          <ul className="space-y-0.5">{valErrs.map((e, i) => <li key={i} className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0"/>{e}</li>)}</ul>
          <p className="mt-2 text-amber-500/70">Fix the above and click <span className="font-semibold">Validate &amp; Apply</span> again.</p>
        </div>
      )}
      <textarea
        className={`flex-1 w-full min-h-[520px] font-mono text-xs p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-colors ${hasError ? 'border-red-500/50 focus:ring-red-500/40' : 'focus:ring-indigo-500'} ${isDark ? 'bg-slate-800 border-slate-700 text-emerald-300' : 'bg-slate-900 border-slate-300 text-emerald-400'}`}
        value={text}
        onChange={e => { setText(e.target.value); setParseErr(null); setValErrs([]); setApplied(false); }}
        spellCheck={false}
      />
    </div>
  );
};

// ─── Shared styles helper ─────────────────────────────────────────────────────
const inputClass = (isDark: boolean) =>
  `w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`;
const labelClass = (isDark: boolean) =>
  `block text-xs font-semibold uppercase tracking-wide mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`;
const cardClass = (isDark: boolean) =>
  `rounded-xl border p-4 mb-3 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`;

// ─── Section toggle wrapper ───────────────────────────────────────────────────
const Section: React.FC<{ title: string; isDark: boolean; children: React.ReactNode }> = ({ title, isDark, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className={cardClass(isDark)}>
      <button className="flex items-center justify-between w-full" onClick={() => setOpen(o => !o)}>
        <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</span>
        {open ? <ChevronDown size={16} className="text-indigo-500"/> : <ChevronRight size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'}/>}
      </button>
      {open && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
};

// ─── Form panels per tab ──────────────────────────────────────────────────────

// Personal Info: name, title, avatar, bio
const PersonalInfoForm: React.FC<{ isDark: boolean; data: PortfolioData; updateData: (d: PortfolioData) => void }> = ({ isDark, data, updateData }) => {
  const info = data.personalInfo;
  const set = (k: keyof typeof info, v: string) => updateData({ ...data, personalInfo: { ...info, [k]: v } });
  return (
    <Section title="Personal Info" isDark={isDark}>
      <div className="space-y-3">
        {(['name','title'] as const).map(f => (
          <div key={f}>
            <label className={labelClass(isDark)}>{f}</label>
            <input id={`form-${f}`} type="text" className={inputClass(isDark)} value={info[f]} onChange={e => set(f, e.target.value)}/>
          </div>
        ))}
        <div>
          <label className={labelClass(isDark)}>Avatar (URL or Local File)</label>
          <div className="flex flex-col gap-2">
            <input id="form-avatar" type="text" placeholder="https://source.unsplash.com/..." className={inputClass(isDark)} value={info.avatar || ''} onChange={e => set('avatar', e.target.value)}/>
            <input 
              type="file" 
              accept="image/*, image/png, image/jpeg, image/jpg, image/gif, image/webp, image/avif, image/svg+xml, .heic, .heif" 
              className={`text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold ${isDark ? 'file:bg-indigo-500/20 file:text-indigo-400 text-slate-400' : 'file:bg-indigo-50 file:text-indigo-700 text-slate-500'} hover:file:bg-indigo-100 dark:hover:file:bg-indigo-500/30 transition-all cursor-pointer`}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    set('avatar', reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </div>
        <div>
          <label className={labelClass(isDark)}>Bio</label>
          <textarea id="form-bio" rows={5} className={`${inputClass(isDark)} resize-none`} value={info.bio} onChange={e => set('bio', e.target.value)}/>
        </div>
      </div>
    </Section>
  );
};

// Contact Info: email, phone, location, socialLinks
const ContactInfoForm: React.FC<{ isDark: boolean; data: PortfolioData; updateData: (d: PortfolioData) => void }> = ({ isDark, data, updateData }) => {
  const info = data.personalInfo;
  const set = (k: keyof typeof info, v: string) => updateData({ ...data, personalInfo: { ...info, [k]: v } });
  const setSocial = (k: keyof SocialLinks, v: string) => updateData({ ...data, personalInfo: { ...info, socialLinks: { ...info.socialLinks, [k]: v } } });
  return (
    <>
      <Section title="Contact" isDark={isDark}>
        {(['email','phone','location'] as const).map(f => (
          <div key={f}>
            <label className={labelClass(isDark)}>{f}</label>
            <input id={`form-${f}`} type="text" className={inputClass(isDark)} value={info[f]} onChange={e => set(f, e.target.value)}/>
          </div>
        ))}
      </Section>
      <Section title="Social Links" isDark={isDark}>
        {(['github','linkedin','portfolio','twitter'] as const).map(s => (
          <div key={s}>
            <label className={labelClass(isDark)}>{s}</label>
            <input id={`form-social-${s}`} type="url" className={inputClass(isDark)} placeholder="https://..." value={info.socialLinks?.[s] ?? ''} onChange={e => setSocial(s, e.target.value)}/>
          </div>
        ))}
      </Section>
    </>
  );
};

// Professional: skills + experience combined (mirrors JSON Professional tab)
const ProfessionalForm: React.FC<{ isDark: boolean; data: PortfolioData; updateData: (d: PortfolioData) => void }> = ({ isDark, data, updateData }) => {
  // Skills
  const updSkills = (s: PortfolioData['skills']) => updateData({ ...data, skills: s });
  const updateSkill = (i: number, field: 'category' | 'items', val: string) =>
    updSkills(data.skills.map((sk, idx) => idx === i ? { ...sk, [field]: field === 'items' ? val.split(',').map(x => x.trim()).filter(Boolean) : val } : sk));
  const removeSkill = (i: number) => updSkills(data.skills.filter((_, idx) => idx !== i));
  const addSkill = () => updSkills([...data.skills, { category: '', items: [] }]);

  // Experience
  const updExp = (e: PortfolioData['experience']) => updateData({ ...data, experience: e });
  const updateExp = (i: number, field: string, val: string | boolean) =>
    updExp(data.experience.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  const updateAch = (i: number, val: string) =>
    updExp(data.experience.map((e, idx) => idx === i ? { ...e, achievements: val.split('\n').filter(Boolean) } : e));

  return (
    <>
      {/* Skills */}
      <Section title="Skills & Categories" isDark={isDark}>
        {data.skills.map((cat, i) => (
          <div key={i} className={`rounded-lg p-3 ${isDark ? 'bg-slate-700/40' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400">Category {i + 1}</span>
              <button onClick={() => removeSkill(i)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 size={13}/></button>
            </div>
            <div className="mb-2">
              <label className={labelClass(isDark)}>Category Name</label>
              <input type="text" className={inputClass(isDark)} value={cat.category} onChange={e => updateSkill(i, 'category', e.target.value)}/>
            </div>
            <label className={labelClass(isDark)}>Items (comma-separated)</label>
            <input type="text" className={inputClass(isDark)} value={cat.items.join(', ')} onChange={e => updateSkill(i, 'items', e.target.value)}/>
          </div>
        ))}
        <button onClick={addSkill} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${isDark ? 'border-slate-600 text-indigo-400 hover:bg-indigo-500/10' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'}`}><Plus size={13}/>Add Category</button>
      </Section>

      {/* Experience */}
      <Section title="Work Experience" isDark={isDark}>
        {data.experience.map((e, i) => (
          <div key={e.id} className={`rounded-lg p-3 ${isDark ? 'bg-slate-700/40' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400">#{i+1} — {e.company || 'New Role'}</span>
              <button onClick={() => updExp(data.experience.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300"><Trash2 size={13}/></button>
            </div>
            {(['company','role','location','startDate','endDate'] as const).map(f => (
              <div key={f} className="mb-2">
                <label className={labelClass(isDark)}>{f}</label>
                <input type="text" className={inputClass(isDark)} value={e[f]} onChange={ev => updateExp(i, f, ev.target.value)}/>
              </div>
            ))}
            <div className="mb-2">
              <label className={labelClass(isDark)}>Achievements (one per line)</label>
              <textarea rows={4} className={`${inputClass(isDark)} resize-none`} value={e.achievements.join('\n')} onChange={ev => updateAch(i, ev.target.value)}/>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input type="checkbox" checked={e.current} onChange={ev => updateExp(i, 'current', ev.target.checked)} className="accent-indigo-500"/>
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Currently working here</span>
            </label>
          </div>
        ))}
        <button onClick={() => updExp([...data.experience, { id: `exp-${Date.now()}`, company: '', role: '', location: '', startDate: '', endDate: '', current: false, achievements: [] }])} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${isDark ? 'border-slate-600 text-indigo-400 hover:bg-indigo-500/10' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'}`}><Plus size={13}/>Add Experience</button>
      </Section>
    </>
  );
};


const ProjectsForm: React.FC<{ isDark: boolean; data: PortfolioData; updateData: (d: PortfolioData) => void }> = ({ isDark, data, updateData }) => {
  const upd = (newProjects: PortfolioData['projects']) => updateData({ ...data, projects: newProjects });
  const update = (i: number, field: string, val: string | boolean | string[]) =>
    upd(data.projects.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  const remove = (i: number) => upd(data.projects.filter((_, idx) => idx !== i));
  const add = () => upd([...data.projects, { id: `proj-${Date.now()}`, title: '', description: '', techStack: [], featured: false }]);
  return (
    <>
      <Section title="Projects" isDark={isDark}>
        {data.projects.map((p, i) => (
          <div key={p.id} className={`rounded-lg p-3 ${isDark ? 'bg-slate-700/40' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400">#{i+1} — {p.title || 'New Project'}</span>
              <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300"><Trash2 size={13}/></button>
            </div>
            <div className="mb-2"><label className={labelClass(isDark)}>Title</label><input type="text" className={inputClass(isDark)} value={p.title} onChange={e => update(i, 'title', e.target.value)}/></div>
            <div className="mb-2"><label className={labelClass(isDark)}>Description</label><textarea rows={3} className={`${inputClass(isDark)} resize-none`} value={p.description} onChange={e => update(i, 'description', e.target.value)}/></div>
            <div className="mb-2"><label className={labelClass(isDark)}>Tech Stack (comma-separated)</label><input type="text" className={inputClass(isDark)} value={p.techStack.join(', ')} onChange={e => update(i, 'techStack', e.target.value.split(',').map(x => x.trim()).filter(Boolean))}/></div>
            <div className="mb-2"><label className={labelClass(isDark)}>Live URL</label><input type="url" className={inputClass(isDark)} value={p.liveUrl ?? ''} onChange={e => update(i, 'liveUrl', e.target.value)}/></div>
            <div className="mb-2"><label className={labelClass(isDark)}>GitHub URL</label><input type="url" className={inputClass(isDark)} value={p.githubUrl ?? ''} onChange={e => update(i, 'githubUrl', e.target.value)}/></div>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input type="checkbox" checked={p.featured} onChange={e => update(i, 'featured', e.target.checked)} className="accent-indigo-500"/>
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Featured project</span>
            </label>
          </div>
        ))}
        <button onClick={add} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${isDark ? 'border-slate-600 text-indigo-400 hover:bg-indigo-500/10' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'}`}><Plus size={13}/>Add Project</button>
      </Section>
    </>
  );
};

const EducationForm: React.FC<{ isDark: boolean; data: PortfolioData; updateData: (d: PortfolioData) => void }> = ({ isDark, data, updateData }) => {
  const upd = (newEdu: PortfolioData['education']) => updateData({ ...data, education: newEdu });
  const update = (i: number, field: string, val: string) => upd(data.education.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  const remove = (i: number) => upd(data.education.filter((_, idx) => idx !== i));
  const add = () => upd([...data.education, { id: `edu-${Date.now()}`, institution: '', degree: '', field: '', location: '', startDate: '', endDate: '' }]);
  return (
    <>
      <Section title="Education" isDark={isDark}>
        {data.education.map((e, i) => (
          <div key={e.id} className={`rounded-lg p-3 ${isDark ? 'bg-slate-700/40' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400">#{i+1} — {e.institution || 'New Entry'}</span>
              <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300"><Trash2 size={13}/></button>
            </div>
            {(['institution','degree','field','location','startDate','endDate','gpa'] as const).map(f => (
              <div key={f} className="mb-2">
                <label className={labelClass(isDark)}>{f}</label>
                <input type="text" className={inputClass(isDark)} value={(e as unknown as Record<string, string>)[f] ?? ''} onChange={ev => update(i, f, ev.target.value)}/>
              </div>
            ))}
          </div>
        ))}
        <button onClick={add} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${isDark ? 'border-slate-600 text-indigo-400 hover:bg-indigo-500/10' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'}`}><Plus size={13}/>Add Education</button>
      </Section>
    </>
  );
};

// ─── Tab config ───────────────────────────────────────────────────────────────
// Form tabs mirror JSON tabs exactly: same 5 sections, same names
type TabId = 'personal' | 'contact' | 'education' | 'professional' | 'projects';
const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'personal',      label: 'Personal Info', icon: User },
  { id: 'contact',       label: 'Contact Info',  icon: Phone },
  { id: 'education',     label: 'Education',     icon: GraduationCap },
  { id: 'professional',  label: 'Professional',  icon: Briefcase },
  { id: 'projects',      label: 'Projects',      icon: FormInput },
];

// JSON tab config (kept separate for JSON mode)
type JsonTabId = 'personal' | 'contact' | 'education' | 'professional';
const JSON_TABS: { id: JsonTabId; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'personal',     label: 'Personal Info', icon: User,          desc: 'name, title, bio' },
  { id: 'contact',      label: 'Contact Info',  icon: Phone,         desc: 'email, phone, location, socialLinks' },
  { id: 'education',    label: 'Education',     icon: GraduationCap, desc: 'education[], certifications[]' },
  { id: 'professional', label: 'Professional',  icon: Briefcase,     desc: 'skills[], experience[], projects[]' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const JsonEditor: React.FC = () => {
  const { data, updateData, theme, setMode } = usePortfolio();
  const isDark = theme === 'dark';

  const [editorMode, setEditorMode] = useState<'form' | 'json'>('form');
  const [formTab, setFormTab] = useState<TabId>('personal');
  const [jsonTab, setJsonTab] = useState<JsonTabId>('personal');

  // JSON slices
  const personalJson     = JSON.stringify(extractPersonal(data.personalInfo), null, 2);
  const contactJson      = JSON.stringify(extractContact(data.personalInfo), null, 2);
  const educationJson    = JSON.stringify(extractEducation(data), null, 2);
  const professionalJson = JSON.stringify(extractProfessional(data), null, 2);
  const projectsJson     = JSON.stringify(extractProjects(data), null, 2);

  const applyPersonal    = (p: unknown) => { const v = p as PersonalSlice; updateData({ ...data, personalInfo: { ...data.personalInfo, name: v.name, title: v.title, bio: v.bio, avatar: v.avatar } }); };
  const applyContact     = (p: unknown) => { const v = p as ContactSlice;  updateData({ ...data, personalInfo: { ...data.personalInfo, email: v.email, phone: v.phone, location: v.location, socialLinks: v.socialLinks ?? {} } }); };
  const applyEducation   = (p: unknown) => { const v = p as EducationSlice;    updateData({ ...data, education: v.education, certifications: v.certifications }); };
  const applyProfessional= (p: unknown) => { const v = p as ProfessionalSlice; updateData({ ...data, skills: v.skills, experience: v.experience }); };
  const applyProjects    = (p: unknown) => { const v = p as ProjectsSlice;     updateData({ ...data, projects: v.projects }); };

  const formPanels: Record<TabId, React.ReactNode> = {
    personal:      <PersonalInfoForm  isDark={isDark} data={data} updateData={updateData}/>,
    contact:       <ContactInfoForm   isDark={isDark} data={data} updateData={updateData}/>,
    education:     <EducationForm     isDark={isDark} data={data} updateData={updateData}/>,
    professional:  <ProfessionalForm  isDark={isDark} data={data} updateData={updateData}/>,
    projects:      <ProjectsForm      isDark={isDark} data={data} updateData={updateData}/>,
  };

  const jsonPanels: Record<JsonTabId, React.ReactNode> = {
    personal:     <JsonPanel key={`p-${personalJson.slice(0,30)}`}      isDark={isDark} initialJson={personalJson}     validate={v => validatePersonal(v as PersonalSlice)}         onApply={applyPersonal}/>,
    contact:      <JsonPanel key={`c-${contactJson.slice(0,30)}`}       isDark={isDark} initialJson={contactJson}      validate={v => validateContact(v as ContactSlice)}           onApply={applyContact}/>,
    education:    <JsonPanel key={`e-${educationJson.slice(0,30)}`}     isDark={isDark} initialJson={educationJson}    validate={v => validateEducation(v as EducationSlice)}       onApply={applyEducation}/>,
    professional: <JsonPanel key={`pr-${professionalJson.slice(0,30)}`} isDark={isDark} initialJson={professionalJson} validate={v => validateProfessional(v as ProfessionalSlice)} onApply={applyProfessional}/>,
    projects:     <JsonPanel key={`pj-${projectsJson.slice(0,30)}`}     isDark={isDark} initialJson={projectsJson}     validate={v => validateProjects(v as ProjectsSlice)}         onApply={applyProjects}/>,
  };

  const tabs    = editorMode === 'form' ? TABS        : JSON_TABS;
  const activeId = editorMode === 'form' ? formTab    : jsonTab;
  const setTab   = editorMode === 'form'
    ? (id: string) => setFormTab(id as TabId)
    : (id: string) => setJsonTab(id as JsonTabId);

  return (
    <div className={`min-h-screen pt-20 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-2xl font-extrabold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Portfolio Editor</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {editorMode === 'form' ? 'Fill in the form fields and click Apply Changes.' : 'Edit JSON and click Validate & Apply.'}
            </p>
          </div>

          {/* Form / JSON toggle */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <button
              onClick={() => setEditorMode('form')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${editorMode === 'form' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <FormInput size={15}/>Form
            </button>
            <button
              onClick={() => setEditorMode('json')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${editorMode === 'json' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <FileJson size={15}/>JSON
            </button>
          </div>
        </div>

        {/* Section tabs */}
        <div className={`flex flex-wrap gap-2 mb-5 p-1.5 rounded-2xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeId === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${editorMode}-${tab.id}`}
                onClick={() => setTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex-1 justify-center sm:flex-none sm:justify-start ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25' : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <Icon size={15}/><span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* JSON mode: field hint */}
        {editorMode === 'json' && (
          <div className={`mb-4 px-3 py-2 rounded-xl text-xs font-mono border ${isDark ? 'bg-slate-800/40 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            Fields: <span className={isDark ? 'text-indigo-400' : 'text-indigo-600'}>
              {(JSON_TABS.find(t => t.id === jsonTab) as { desc: string })?.desc}
            </span>
          </div>
        )}

        {/* Panel */}
        <div className={`rounded-2xl border p-5 mb-6 ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'}`}>
          {editorMode === 'form' ? formPanels[formTab] : jsonPanels[jsonTab]}
        </div>

        {/* Quick Export Actions */}
        <div className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className={`flex items-center gap-2 mb-3 sm:mb-0 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <Download size={16} /> Quick Export
          </div>
          <div className="flex flex-wrap items-center gap-2">

            <button onClick={() => exportDocx(data)} className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              <FileDown size={14} className="text-blue-500"/> Word
            </button>
            <button onClick={() => { setMode('preview'); setTimeout(() => exportHtml(data, isDark), 400); }} className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              <Code2 size={14} className="text-emerald-500"/> HTML
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonEditor;
