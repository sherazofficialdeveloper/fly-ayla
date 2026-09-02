import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  Building, 
  Mail, 
  DollarSign, 
  BellRing, 
  ShieldCheck 
} from 'lucide-react';

interface SettingsViewProps {
  settingsData: any;
  onSaveSettings: (settings: any) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settingsData,
  onSaveSettings,
}) => {
  const [companyName, setCompanyName] = useState('Fly Ayla Aviation SARL');
  const [supportEmail, setSupportEmail] = useState('concierge@flyayla.com');
  const [complianceEmail, setComplianceEmail] = useState('compliance@flyayla.com');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState<number>(0);
  const [autoQuoteEnabled, setAutoQuoteEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settingsData) {
      setCompanyName(settingsData.companyName || 'Fly Ayla Aviation SARL');
      setSupportEmail(settingsData.supportEmail || 'concierge@flyayla.com');
      setComplianceEmail(settingsData.complianceEmail || 'compliance@flyayla.com');
      setBaseCurrency(settingsData.baseCurrency || 'USD');
      setTaxRate(settingsData.taxRate || 0);
      setAutoQuoteEnabled(settingsData.autoQuoteEnabled !== false);
      setEmailAlertsEnabled(settingsData.emailAlertsEnabled !== false);
    }
  }, [settingsData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings({
        companyName,
        supportEmail,
        complianceEmail,
        baseCurrency,
        taxRate,
        autoQuoteEnabled,
        emailAlertsEnabled,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0F0F16] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Aviation System Configuration & Operational Settings
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage charter company legal entity parameters, VAT/Tax calculations, dispatch automation, and notification gateways.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/80 transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          {saveSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Updating...' : 'Save All Settings'}</span>
            </>
          )}
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Company Entity & Concierge */}
        <div className="p-6 rounded-2xl bg-[#0F0F16] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Building className="w-4 h-4 text-red-500" />
            <h3 className="font-semibold text-white uppercase tracking-wider text-xs">
              Legal Operator Identity & Support Concierge
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Company Legal Registered Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Concierge / Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Compliance & AML Escalation Contact</label>
              <input
                type="email"
                value={complianceEmail}
                onChange={(e) => setComplianceEmail(e.target.value)}
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Primary Settlement Currency</label>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="CHF">CHF (CHF) - Swiss Franc</option>
                <option value="AED">AED (AED) - UAE Dirham</option>
              </select>
            </div>
          </div>
        </div>

        {/* Automation & Notification Toggles */}
        <div className="p-6 rounded-2xl bg-[#0F0F16] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <BellRing className="w-4 h-4 text-red-500" />
            <h3 className="font-semibold text-white uppercase tracking-wider text-xs">
              Dispatch Automation & Alert Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Automated DOC Quote Calculation</div>
                <div className="text-zinc-400 text-xs mt-0.5 font-normal">
                  Automatically calculate direct operating costs on incoming charter requests.
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoQuoteEnabled}
                onChange={(e) => setAutoQuoteEnabled(e.target.checked)}
                className="w-5 h-5 rounded accent-red-600 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Instant Email Alerts for New Leads</div>
                <div className="text-zinc-400 text-xs mt-0.5 font-normal">
                  Send real-time alerts to the dispatch team when an executive charter request is submitted.
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlertsEnabled}
                onChange={(e) => setEmailAlertsEnabled(e.target.checked)}
                className="w-5 h-5 rounded accent-red-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
