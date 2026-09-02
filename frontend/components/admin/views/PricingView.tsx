import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Fuel, 
  Compass, 
  Save, 
  CheckCircle2, 
  TrendingUp, 
  Layers,
  Radio,
  Search,
  RefreshCw,
  Zap,
  Info,
  AlertCircle
} from 'lucide-react';
import { PricingService as CustomerPricingService } from '../../../services/customer/pricing.service';

interface PricingViewProps {
  pricingRules: any;
  onSavePricingRules: (rules: any) => Promise<void>;
}

export const PricingView: React.FC<PricingViewProps> = ({
  pricingRules,
  onSavePricingRules,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'fuel' | 'nav' | 'charges'>('overview');
  const [fuelPrice, setFuelPrice] = useState<number>(0);
  const [fuelSurcharge, setFuelSurcharge] = useState<number>(12);
  const [markupPercent, setMarkupPercent] = useState<number>(18);
  const [crewPerDiem, setCrewPerDiem] = useState<number>(850);
  const [crewOvernight, setCrewOvernight] = useState<number>(1400);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Live JetFuelX telemetry state
  const [jetFuelStatus, setJetFuelStatus] = useState<any>(null);
  const [isLoadingFuelStatus, setIsLoadingFuelStatus] = useState(false);
  const [testIcao, setTestIcao] = useState('KTEB');
  const [testFuelResult, setTestFuelResult] = useState<any>(null);
  const [isTestingIcao, setIsTestingIcao] = useState(false);

  const fetchJetFuelStatus = async () => {
    setIsLoadingFuelStatus(true);
    try {
      const res = await CustomerPricingService.getFuelPrice();
      if (res && res.data) {
        setJetFuelStatus(res.data);
        if (res.data.isLive && res.data.pricePerGallon) {
          setFuelPrice(res.data.pricePerGallon);
        }
      }
    } catch (err) {
      console.warn('Failed to load JetFuelX status:', err);
    } finally {
      setIsLoadingFuelStatus(false);
    }
  };

  const runIcaoLookup = async () => {
    if (!testIcao.trim()) return;
    setIsTestingIcao(true);
    try {
      const res = await CustomerPricingService.getFuelPrice(testIcao.trim().toUpperCase());
      if (res && res.data) {
        setTestFuelResult(res.data);
      }
    } catch (err: any) {
      setTestFuelResult({
        status: 'API_ERROR',
        isLive: false,
        message: err.message || 'Lookup failed',
        pricePerGallon: null,
      });
    } finally {
      setIsTestingIcao(false);
    }
  };

  useEffect(() => {
    if (pricingRules) {
      setFuelPrice(pricingRules.jetFuelPricePerGal || 0);
      setFuelSurcharge(pricingRules.fuelSurchargePercent || 12);
      setMarkupPercent(pricingRules.defaultMarkupPercent || 18);
      setCrewPerDiem(pricingRules.crewPerDiemDaily || 850);
      setCrewOvernight(pricingRules.crewOvernightCost || 1400);
    }
    fetchJetFuelStatus();
  }, [pricingRules]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSavePricingRules({
        jetFuelPricePerGal: fuelPrice,
        fuelSurchargePercent: fuelSurcharge,
        defaultMarkupPercent: markupPercent,
        crewPerDiemDaily: crewPerDiem,
        crewOvernightCost: crewOvernight,
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
      
      {/* Top Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0F0F16] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              jetFuelStatus?.isLive 
                ? 'bg-emerald-400 animate-pulse' 
                : jetFuelStatus?.status === 'API_ERROR' 
                ? 'bg-rose-500' 
                : 'bg-amber-400'
            }`}></span>
            <span className="text-xs uppercase tracking-widest text-zinc-300 font-semibold">
              DOC ALGORITHM v3.4 &bull; {
                jetFuelStatus?.isLive 
                  ? 'JETFUELX LIVE FEED ACTIVE' 
                  : jetFuelStatus?.status === 'API_ERROR'
                  ? 'JETFUELX API ERROR (UNAVAILABLE)'
                  : 'JETFUELX NOT CONFIGURED'
              }
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
            Direct Operating Cost &amp; Global Pricing Engine
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 max-w-xl">
            Real-time contract fuel pricing integration, regional airspace tariffs, crew allowance matrix, and operating margin formulas.
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
              <span>Parameters Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Updating...' : 'Save Pricing Parameters'}</span>
            </>
          )}
        </button>
      </div>

      {/* JetFuelX Real-Time Integration Status Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0B12] border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              jetFuelStatus?.isLive 
                ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400' 
                : jetFuelStatus?.status === 'API_ERROR'
                ? 'bg-rose-950/50 border border-rose-500/30 text-rose-400'
                : 'bg-amber-950/50 border border-amber-500/30 text-amber-400'
            }`}>
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">JetFuelX API Integration Feed</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                  jetFuelStatus?.status === 'CONNECTED' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : jetFuelStatus?.status === 'API_ERROR'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {jetFuelStatus?.status || 'NOT_CONFIGURED'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {jetFuelStatus?.message || 'Connecting to JetFuelX server-side feed...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right">
              <div className="text-xs text-zinc-400 font-normal uppercase">Effective Feed Rate</div>
              <div className="text-base font-bold text-white">
                {jetFuelStatus?.isLive && jetFuelStatus?.pricePerGallon ? (
                  <>
                    ${jetFuelStatus.pricePerGallon.toFixed(2)} <span className="text-xs font-normal text-zinc-400">/ gal</span>
                  </>
                ) : (
                  <span className="text-xs font-normal text-amber-400">Unavailable (API Key Required)</span>
                )}
              </div>
            </div>
            <button
              onClick={fetchJetFuelStatus}
              disabled={isLoadingFuelStatus}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Refresh JetFuelX Feed"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingFuelStatus ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {!jetFuelStatus?.isLive && (
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 text-amber-400/90 text-xs">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Configuration Required: Set <code className="text-amber-300 bg-black/40 px-1.5 py-0.5 rounded font-semibold">JETFUELX_API_KEY</code> in server environment to enable live JetFuelX contract fuel rates.</span>
            </div>
          </div>
        )}
      </div>

      {/* Subtabs Bar */}
      <div className="px-4 border-b border-white/10 flex items-center gap-2 bg-[#09090D] rounded-xl overflow-x-auto">
        {[
          { id: 'overview', label: 'Pricing Formula Overview', icon: DollarSign },
          { id: 'fuel', label: 'JetFuelX Contract Fuel & ICAO Airfield Lookup', icon: Fuel },
          { id: 'nav', label: 'Airspace Navigation Tariffs', icon: Compass },
          { id: 'charges', label: 'Crew & Fixed Tariffs', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'border-red-500 text-white font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtab Content */}
      <div className="p-6 rounded-2xl bg-[#0F0F16] border border-white/10 space-y-6">
        
        {/* OVERVIEW SUBTAB */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-xl bg-zinc-900/80 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  <span>DEFAULT TARGET MARGIN</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">{markupPercent}%</div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(parseInt(e.target.value, 10))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="text-xs text-zinc-400 font-normal">
                  Applied to total direct operating cost for quoted charter pricing.
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/80 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  <span>MANUAL FUEL DISPATCH OVERRIDE</span>
                  <Fuel className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {fuelPrice > 0 ? `$${fuelPrice.toFixed(2)}/gal` : <span className="text-sm text-zinc-500 font-normal">Auto / API</span>}
                </div>
                <input
                  type="range"
                  step="0.05"
                  min="0"
                  max="8.0"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(parseFloat(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="text-xs text-zinc-400 font-normal">
                  {jetFuelStatus?.isLive 
                    ? `Live JetFuelX feed active: ${jetFuelStatus.source}` 
                    : (jetFuelStatus?.message || 'Set JETFUELX_API_KEY or adjust manual dispatch rate above.')}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/80 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  <span>MARKET FUEL SURCHARGE</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">{fuelSurcharge}%</div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={fuelSurcharge}
                  onChange={(e) => setFuelSurcharge(parseInt(e.target.value, 10))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="text-xs text-zinc-400 font-normal">
                  Dynamic surcharge adjusted according to crude volatility.
                </div>
              </div>

            </div>

            {/* Formula visualization */}
            <div className="p-5 rounded-xl bg-black/60 border border-white/15 space-y-3 text-xs">
              <h4 className="font-semibold uppercase tracking-wider text-zinc-300 text-xs">
                Direct Operating Cost (DOC) Formula Architecture
              </h4>
              <div className="text-zinc-300 leading-relaxed bg-[#0A0A10] p-4 rounded-lg border border-white/5 text-xs font-normal">
                <span className="text-red-400 font-semibold">Total Charter Price</span> = (Airframe Block Hours &times; Hourly Rate) + (Fuel Burn &times; {jetFuelStatus?.isLive && jetFuelStatus?.pricePerGallon ? `$${jetFuelStatus.pricePerGallon.toFixed(2)}/gal` : '[JetFuelX Live Rate]'} &times; (1 + {fuelSurcharge}%)) + FBO Handling + Airspace Tariffs + Crew Allowance + Landing Taxes &times; <span className="text-emerald-400 font-semibold">(1 + {markupPercent}%)</span>
              </div>
            </div>
          </div>
        )}

        {/* FUEL SUBTAB */}
        {activeSubTab === 'fuel' && (
          <div className="space-y-6 text-xs">
            
            {/* Live ICAO Fuel Lookup Tester */}
            <div className="p-5 rounded-xl bg-zinc-900/80 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider text-xs">
                    JetFuelX Real-Time Airfield Rate Inspector
                  </h4>
                  <p className="text-zinc-400 text-xs mt-0.5 font-normal">
                    Query live Jet-A contract fuel rates per ICAO airfield directly from the backend JetFuelX service.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${jetFuelStatus?.isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  <span className="text-xs text-zinc-300 font-medium">
                    {jetFuelStatus?.isLive ? 'LIVE PROBE READY' : 'KEY REQUIRED'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={testIcao}
                    onChange={(e) => setTestIcao(e.target.value.toUpperCase())}
                    placeholder="Enter ICAO (e.g. KTEB, EGLL, LFMN, OMDB, VHHH)..."
                    className="w-full bg-[#14141E] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-red-500 uppercase font-medium"
                  />
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                </div>
                <button
                  onClick={runIcaoLookup}
                  disabled={isTestingIcao || !testIcao.trim()}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isTestingIcao ? 'Querying API...' : 'Fetch Fuel Rate'}</span>
                </button>
              </div>

              {testFuelResult && (
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Target Airfield:</span>
                    <span className="text-white font-bold">{testFuelResult.icao || testIcao}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Quoted Jet-A Rate:</span>
                    <span className={`font-bold text-sm ${testFuelResult.isLive ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {testFuelResult.isLive && testFuelResult.pricePerGallon 
                        ? `$${testFuelResult.pricePerGallon.toFixed(2)} / gal (${testFuelResult.currency || 'USD'})` 
                        : 'Unavailable (Real API Key Required)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Data Source:</span>
                    <span className="text-zinc-300 font-medium">{testFuelResult.source}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Status / Response:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      testFuelResult.status === 'CONNECTED' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : testFuelResult.status === 'API_ERROR'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {testFuelResult.status} &bull; {testFuelResult.isLive ? 'REAL-TIME FEED' : 'API KEY REQUIRED'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/5 text-xs text-zinc-400 font-normal">
                    {testFuelResult.message}
                  </div>
                </div>
              )}
            </div>

            {/* JetFuelX Integration Information */}
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>JetFuelX Contract Fuel Pricing Guidelines</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-xs">
                Fly Ayla connects directly to the official ForeFlight / JetFuelX contract fuel pricing network to query localized Jet-A quotes for all participating FBOs (Signature Flight Support, Jet Aviation, Atlantic Aviation, Million Air, and international handlers).
              </p>
              <div className="p-3 bg-black/40 rounded-lg border border-white/5 text-zinc-300 text-xs space-y-1">
                <div>&bull; <strong>Endpoint:</strong> <code className="text-red-400 font-semibold">https://api.jetfuelx.com/v1/prices</code> (or custom <code className="text-red-400 font-semibold">JETFUELX_API_URL</code>)</div>
                <div>&bull; <strong>Auth Header:</strong> <code className="text-zinc-400 font-semibold">Authorization: Bearer &lt;JETFUELX_API_KEY&gt;</code></div>
                <div>&bull; <strong>Server-Authoritative Policy:</strong> Fuel prices are never hardcoded or fabricated. When credentials are unconfigured or unavailable, fuel line items explicitly indicate that a live key is required.</div>
              </div>
            </div>
          </div>
        )}

        {/* NAV SUBTAB */}
        {activeSubTab === 'nav' && (
          <div className="space-y-4 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs">
              Airspace Navigation Overflight Rate Matrix
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { authority: 'Eurocontrol (CRCO)', rate: '$140.00 / 100 NM', notes: 'Automated distance & MTOW calculation' },
                { authority: 'FAA Airspace Navigation', rate: '$61.00 / 100 NM', notes: 'Oceanic & Enroute combined' },
                { authority: 'MID (Middle East Airspaces)', rate: '$95.00 / 100 NM', notes: 'Saudi GACA & UAE GCAA permits' },
                { authority: 'APAC Regional FIRs', rate: '$110.00 / 100 NM', notes: 'Cross-border clearance fee included' },
              ].map((a, i) => (
                <div key={i} className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{a.authority}</span>
                    <span className="text-emerald-400 font-semibold">{a.rate}</span>
                  </div>
                  <div className="text-zinc-400 text-xs font-normal">{a.notes}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHARGES SUBTAB */}
        {activeSubTab === 'charges' && (
          <div className="space-y-4 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs">
              Crew Per Diem & Overnight Operational Tariffs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
                <label className="block text-zinc-300 font-medium">Crew Per Diem Daily ($/day per crew member)</label>
                <input
                  type="number"
                  value={crewPerDiem}
                  onChange={(e) => setCrewPerDiem(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 font-medium"
                />
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
                <label className="block text-zinc-300 font-medium">Crew Overnight Accommodation ($/night)</label>
                <input
                  type="number"
                  value={crewOvernight}
                  onChange={(e) => setCrewOvernight(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 font-medium"
                />
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

