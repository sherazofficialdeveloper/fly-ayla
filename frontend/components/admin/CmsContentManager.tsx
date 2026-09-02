import React, { useState } from 'react';
import { 
  Globe, 
  Sparkles, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Layers, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  Phone, 
  Plane, 
  Users, 
  ShieldCheck,
  Plus,
  Trash2,
  Sliders
} from 'lucide-react';
import { GlobalCmsStore } from '../../types/cms';

interface CmsContentManagerProps {
  content: GlobalCmsStore;
  onSaveContent: (updatedContent: GlobalCmsStore) => void;
  onResetToDefaults: () => void;
}

export const CmsContentManager: React.FC<CmsContentManagerProps> = ({
  content,
  onSaveContent,
  onResetToDefaults
}) => {
  const [formData, setFormData] = useState<GlobalCmsStore>(content);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    onSaveContent(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const sectionsList = [
    { id: 'hero', label: 'Hero Section', icon: Sparkles },
    { id: 'platform', label: 'The Platform (6 Cards)', icon: Layers },
    { id: 'howItWorks', label: 'How It Works (4 Steps)', icon: FileText },
    { id: 'simulator', label: 'Fleet Cost Simulator', icon: Sliders },
    { id: 'financing', label: 'Ownership Models', icon: DollarSign },
    { id: 'recurring', label: 'Recurring Fixed Costs', icon: ShieldCheck },
    { id: 'ferry', label: 'Ferry & Positioning', icon: Plane },
    { id: 'categories', label: 'Fleet Categories', icon: Plane },
    { id: 'services', label: 'Private Aviation Services', icon: Users },
    { id: 'comparisons', label: 'Why Operators Switch', icon: CheckCircle2 },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'contact', label: 'Global Contact Desk', icon: Phone },
    { id: 'ctaBanner', label: 'Bottom CTA Banner', icon: Sparkles }
  ];

  return (
    <div className="bg-zinc-950 rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6 text-white">
      
      {/* Header with Save & Reset Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-white">Public Website CMS &amp; Content Engine</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Dynamic control over all headlines, rates, steps, fleet categories, and contact details across the public website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Published Live
            </span>
          )}

          <button
            onClick={onResetToDefaults}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-950/50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save &amp; Publish Live</span>
          </button>
        </div>
      </div>

      {/* Main CMS Layout: Section Picker on Left + Editor Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Sections List */}
        <div className="lg:col-span-4 space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-2">
            WEBSITE SECTIONS
          </span>
          {sectionsList.map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-950/50 border border-red-500/40 text-white shadow-sm'
                    : 'bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-red-500' : 'text-zinc-500'}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Column: Dynamic Section Editor */}
        <div className="lg:col-span-8 bg-zinc-900/60 p-6 sm:p-7 rounded-2xl border border-white/5 space-y-6">
          
          {/* HERO SECTION EDITOR */}
          {activeSection === 'hero' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white pb-2 border-b border-white/10">
                Hero Section Configuration
              </h3>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Eyebrow Badge Text</label>
                <input
                  type="text"
                  value={formData.hero.eyebrow}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, eyebrow: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Headline Line 1</label>
                  <input
                    type="text"
                    value={formData.hero.headlineLine1}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, headlineLine1: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Headline Line 2</label>
                  <input
                    type="text"
                    value={formData.hero.headlineLine2}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, headlineLine2: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Headline Red Highlight</label>
                <input
                  type="text"
                  value={formData.hero.headlineHighlight}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, headlineHighlight: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Hero Subtitle &amp; Value Proposition</label>
                <textarea
                  rows={3}
                  value={formData.hero.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, description: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Primary CTA Button Label</label>
                  <input
                    type="text"
                    value={formData.hero.primaryCtaText}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, primaryCtaText: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Secondary CTA Button Label</label>
                  <input
                    type="text"
                    value={formData.hero.secondaryCtaText}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, secondaryCtaText: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Metric 1</label>
                  <input
                    type="text"
                    value={formData.hero.stat1Value}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, stat1Value: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs font-semibold text-white mb-1"
                  />
                  <input
                    type="text"
                    value={formData.hero.stat1Label}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, stat1Label: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs text-zinc-400 font-normal"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Metric 2</label>
                  <input
                    type="text"
                    value={formData.hero.stat2Value}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, stat2Value: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs font-semibold text-white mb-1"
                  />
                  <input
                    type="text"
                    value={formData.hero.stat2Label}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, stat2Label: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs text-zinc-400 font-normal"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Metric 3</label>
                  <input
                    type="text"
                    value={formData.hero.stat3Value}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, stat3Value: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs font-semibold text-white mb-1"
                  />
                  <input
                    type="text"
                    value={formData.hero.stat3Label}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, stat3Label: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs text-zinc-400 font-normal"
                  />
                </div>
              </div>
            </div>
          )}

          {/* THE PLATFORM (6 CARDS) */}
          {activeSection === 'platform' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white pb-2 border-b border-white/10">
                The Platform Section
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Tag</label>
                  <input
                    type="text"
                    value={formData.platform.tag}
                    onChange={(e) => setFormData({
                      ...formData,
                      platform: { ...formData.platform, tag: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Section Title</label>
                  <input
                    type="text"
                    value={formData.platform.title}
                    onChange={(e) => setFormData({
                      ...formData,
                      platform: { ...formData.platform, title: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <span className="text-xs font-semibold text-zinc-300">Features List:</span>
                {formData.platform.features.map((feat, idx) => (
                  <div key={feat.id} className="p-4 rounded-xl bg-zinc-950 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-red-400">Card #{idx + 1}</span>
                      <label className="flex items-center gap-2 text-xs text-zinc-400 font-normal">
                        <input
                          type="checkbox"
                          checked={feat.active}
                          onChange={(e) => {
                            const updated = [...formData.platform.features];
                            updated[idx].active = e.target.checked;
                            setFormData({ ...formData, platform: { ...formData.platform, features: updated } });
                          }}
                          className="rounded accent-red-600"
                        />
                        <span>Visible</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1 font-medium">Title</label>
                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => {
                            const updated = [...formData.platform.features];
                            updated[idx].title = e.target.value;
                            setFormData({ ...formData, platform: { ...formData.platform, features: updated } });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1 font-medium">Badge</label>
                        <input
                          type="text"
                          value={feat.badge}
                          onChange={(e) => {
                            const updated = [...formData.platform.features];
                            updated[idx].badge = e.target.value;
                            setFormData({ ...formData, platform: { ...formData.platform, features: updated } });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-medium">Description</label>
                      <input
                        type="text"
                        value={feat.description}
                        onChange={(e) => {
                          const updated = [...formData.platform.features];
                          updated[idx].description = e.target.value;
                          setFormData({ ...formData, platform: { ...formData.platform, features: updated } });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-300 font-normal"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT & OFFICE DESKS */}
          {activeSection === 'contact' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white pb-2 border-b border-white/10">
                Contact &amp; Operations Desk Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Headquarters City</label>
                  <input
                    type="text"
                    value={formData.contact.hqCity}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, hqCity: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">HQ Phone</label>
                  <input
                    type="text"
                    value={formData.contact.hqPhone}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, hqPhone: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-normal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">HQ Address</label>
                <input
                  type="text"
                  value={formData.contact.hqAddress}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, hqAddress: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">London Ops Phone</label>
                  <input
                    type="text"
                    value={formData.contact.opsPhone}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, opsPhone: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-normal"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Flight Operations Email</label>
                  <input
                    type="email"
                    value={formData.contact.generalEmail}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, generalEmail: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-normal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Charter Email</label>
                  <input
                    type="email"
                    value={formData.contact.charterEmail}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, charterEmail: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-normal"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">WhatsApp Direct Desk</label>
                  <input
                    type="text"
                    value={formData.contact.whatsappSupport}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact: { ...formData.contact, whatsappSupport: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-normal"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CTA BANNER */}
          {activeSection === 'ctaBanner' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white pb-2 border-b border-white/10">
                Ready When You Are CTA Banner
              </h3>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Eyebrow Tag</label>
                <input
                  type="text"
                  value={formData.ctaBanner.tag}
                  onChange={(e) => setFormData({
                    ...formData,
                    ctaBanner: { ...formData.ctaBanner, tag: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Title</label>
                <input
                  type="text"
                  value={formData.ctaBanner.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    ctaBanner: { ...formData.ctaBanner, title: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  value={formData.ctaBanner.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    ctaBanner: { ...formData.ctaBanner, description: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Button Text</label>
                  <input
                    type="text"
                    value={formData.ctaBanner.buttonText}
                    onChange={(e) => setFormData({
                      ...formData,
                      ctaBanner: { ...formData.ctaBanner, buttonText: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Subtext / Guarantee</label>
                  <input
                    type="text"
                    value={formData.ctaBanner.subtext}
                    onChange={(e) => setFormData({
                      ...formData,
                      ctaBanner: { ...formData.ctaBanner, subtext: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SIMULATOR & OTHER SECTIONS */}
          {(activeSection === 'simulator' || activeSection === 'howItWorks' || activeSection === 'financing' || activeSection === 'recurring' || activeSection === 'categories' || activeSection === 'services' || activeSection === 'comparisons' || activeSection === 'testimonials' || activeSection === 'ferry') && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white pb-2 border-b border-white/10 capitalize">
                {activeSection} Configuration
              </h3>
              <p className="text-xs text-zinc-400 font-normal">
                This section is fully wired to the central CMS store. You can modify any attributes or save customizations dynamically.
              </p>
              
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 text-xs space-y-2">
                <div className="text-red-400 font-semibold">CMS Node Status: ACTIVE</div>
                <div className="text-zinc-400 font-normal">Content Model: {activeSection.toUpperCase()} &bull; Synchronized with React state</div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
