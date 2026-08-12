import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { ExperienceItem, EducationItem } from '../types/portfolio';

const FormEditor: React.FC = () => {
  const { data, updateData, theme } = usePortfolio();
  const isDark = theme === 'dark';

  const [expandedExp, setExpandedExp] = useState<string | null>(null);
  const [expandedEdu, setExpandedEdu] = useState<string | null>(null);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateData({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [name]: value
      }
    });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        socialLinks: {
          ...data.personalInfo.socialLinks,
          [name]: value
        }
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData({
          ...data,
          personalInfo: {
            ...data.personalInfo,
            avatar: reader.result as string
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Experience Handlers ---
  const handleExpChange = (id: string, field: keyof ExperienceItem, value: any) => {
    const newExp = data.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateData({ ...data, experience: newExp });
  };

  const addExperience = () => {
    const newId = Date.now().toString();
    const newExp: ExperienceItem = {
      id: newId,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      achievements: []
    };
    updateData({ ...data, experience: [...data.experience, newExp] });
    setExpandedExp(newId);
  };

  const removeExperience = (id: string) => {
    updateData({ ...data, experience: data.experience.filter(exp => exp.id !== id) });
  };

  // --- Education Handlers ---
  const handleEduChange = (id: string, field: keyof EducationItem, value: any) => {
    const newEdu = data.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateData({ ...data, education: newEdu });
  };

  const addEducation = () => {
    const newId = Date.now().toString();
    const newEdu: EducationItem = {
      id: newId,
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: ''
    };
    updateData({ ...data, education: [...data.education, newEdu] });
    setExpandedEdu(newId);
  };

  const removeEducation = (id: string) => {
    updateData({ ...data, education: data.education.filter(edu => edu.id !== id) });
  };

  const inputClass = `w-full px-4 py-2.5 rounded-xl border focus:ring-4 focus:outline-none transition-all duration-200 shadow-sm ${
    isDark
      ? 'bg-slate-800/50 border-slate-700 text-white focus:ring-indigo-500/30 focus:border-indigo-500 placeholder-slate-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder-slate-400'
  }`;
  
  const labelClass = `block text-sm font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`;
  const sectionTitleClass = `text-lg font-bold border-b pb-2 mb-4 ${isDark ? 'text-white border-slate-700' : 'text-slate-900 border-slate-200'}`;
  const cardClass = `border rounded-2xl mb-4 overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md ${isDark ? 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-indigo-200'}`;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-8">
      
      {/* PERSONAL INFO */}
      <section>
        <h3 className={sectionTitleClass}>Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" name="name" value={data.personalInfo.name} onChange={handlePersonalChange} className={inputClass} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Professional Title</label>
              <input type="text" name="title" value={data.personalInfo.title} onChange={handlePersonalChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Profile Pic</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="avatar" 
                  value={data.personalInfo.avatar || ''} 
                  onChange={handlePersonalChange} 
                  className={`${inputClass} pr-24`} 
                  placeholder="https://... or upload" 
                />
                <label className={`absolute right-1.5 top-1.5 bottom-1.5 cursor-pointer flex items-center justify-center px-3 rounded-lg transition-colors text-xs font-semibold ${isDark ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900'}`}>
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={data.personalInfo.email} onChange={handlePersonalChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="text" name="phone" value={data.personalInfo.phone} onChange={handlePersonalChange} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input type="text" name="location" value={data.personalInfo.location} onChange={handlePersonalChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Bio</label>
            <textarea name="bio" value={data.personalInfo.bio} onChange={handlePersonalChange} rows={4} className={inputClass} />
          </div>
          
          <div className="pt-2">
            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Social Links</h4>
            <div className="space-y-3 pl-4 border-l-2 border-indigo-500">
              <div>
                <label className={labelClass}>LinkedIn</label>
                <input type="text" name="linkedin" value={data.personalInfo.socialLinks.linkedin || ''} onChange={handleSocialChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>GitHub</label>
                <input type="text" name="github" value={data.personalInfo.socialLinks.github || ''} onChange={handleSocialChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Twitter</label>
                <input type="text" name="twitter" value={data.personalInfo.socialLinks.twitter || ''} onChange={handleSocialChange} className={inputClass} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section>
        <div className="flex items-center justify-between border-b pb-2 mb-4 border-slate-200 dark:border-slate-700">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Experience</h3>
          <button onClick={addExperience} className="cursor-pointer flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            <Plus size={16} /> Add
          </button>
        </div>
        
        {data.experience.map(exp => {
          const isExpanded = expandedExp === exp.id;
          return (
            <div key={exp.id} className={cardClass}>
              <div 
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${isExpanded ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}
                onClick={() => setExpandedExp(isExpanded ? null : exp.id)}
              >
                <div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{exp.company || 'New Experience'}</div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{exp.role}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }} className="cursor-pointer text-red-500 hover:text-red-700 p-1">
                    <Trash2 size={16} />
                  </button>
                  {isExpanded ? <ChevronUp size={20} className={isDark ? 'text-slate-400' : 'text-slate-500'} /> : <ChevronDown size={20} className={isDark ? 'text-slate-400' : 'text-slate-500'} />}
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className={labelClass}>Company</label>
                    <input type="text" value={exp.company} onChange={(e) => handleExpChange(exp.id, 'company', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Role</label>
                    <input type="text" value={exp.role} onChange={(e) => handleExpChange(exp.id, 'role', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <input type="text" value={exp.location} onChange={(e) => handleExpChange(exp.id, 'location', e.target.value)} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Start Date</label>
                      <input type="text" placeholder="e.g. Jan 2020" value={exp.startDate} onChange={(e) => handleExpChange(exp.id, 'startDate', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>End Date</label>
                      <input type="text" placeholder="e.g. Present" value={exp.endDate} onChange={(e) => handleExpChange(exp.id, 'endDate', e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Achievements (one per line)</label>
                    <textarea 
                      value={exp.achievements?.join('\n') || ''} 
                      onChange={(e) => handleExpChange(exp.id, 'achievements', e.target.value.split('\n').filter(Boolean))} 
                      rows={4} 
                      className={inputClass} 
                      placeholder="- Developed feature X..."
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* EDUCATION */}
      <section>
        <div className="flex items-center justify-between border-b pb-2 mb-4 border-slate-200 dark:border-slate-700">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Education</h3>
          <button onClick={addEducation} className="cursor-pointer flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            <Plus size={16} /> Add
          </button>
        </div>
        
        {data.education.map(edu => {
          const isExpanded = expandedEdu === edu.id;
          return (
            <div key={edu.id} className={cardClass}>
              <div 
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${isExpanded ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}
                onClick={() => setExpandedEdu(isExpanded ? null : edu.id)}
              >
                <div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{edu.institution || 'New Education'}</div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{edu.degree}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }} className="cursor-pointer text-red-500 hover:text-red-700 p-1">
                    <Trash2 size={16} />
                  </button>
                  {isExpanded ? <ChevronUp size={20} className={isDark ? 'text-slate-400' : 'text-slate-500'} /> : <ChevronDown size={20} className={isDark ? 'text-slate-400' : 'text-slate-500'} />}
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className={labelClass}>Institution</label>
                    <input type="text" value={edu.institution} onChange={(e) => handleEduChange(edu.id, 'institution', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Degree</label>
                    <input type="text" value={edu.degree} onChange={(e) => handleEduChange(edu.id, 'degree', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Field of Study</label>
                    <input type="text" value={edu.field} onChange={(e) => handleEduChange(edu.id, 'field', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <input type="text" value={edu.location} onChange={(e) => handleEduChange(edu.id, 'location', e.target.value)} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Start Date</label>
                      <input type="text" placeholder="e.g. 2018" value={edu.startDate} onChange={(e) => handleEduChange(edu.id, 'startDate', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>End Date</label>
                      <input type="text" placeholder="e.g. 2022" value={edu.endDate} onChange={(e) => handleEduChange(edu.id, 'endDate', e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>GPA</label>
                    <input type="text" value={edu.gpa || ''} onChange={(e) => handleEduChange(edu.id, 'gpa', e.target.value)} className={inputClass} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>
      
    </div>
  );
};

export default FormEditor;
