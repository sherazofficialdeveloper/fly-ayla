import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';

interface AirportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (airportData: any) => Promise<void>;
  initialData?: any;
}

export const AirportModal: React.FC<AirportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [icao, setIcao] = useState('');
  const [iata, setIata] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);
  const [timezone, setTimezone] = useState('UTC+1');
  const [runwayLengthFt, setRunwayLengthFt] = useState<number>(9000);
  const [handlingFeeBase, setHandlingFeeBase] = useState<number>(2500);
  const [landingFeeRate, setLandingFeeRate] = useState<number>(7.5);
  const [parkingFeeDaily, setParkingFeeDaily] = useState<number>(450);
  const [fuelPricePerGal, setFuelPricePerGal] = useState<number>(0);
  const [popularFbo, setPopularFbo] = useState('Signature Flight Support');
  const [customsAvailable, setCustomsAvailable] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setIcao(initialData.icao || '');
      setIata(initialData.iata || '');
      setName(initialData.name || '');
      setCity(initialData.city || '');
      setCountry(initialData.country || '');
      setLat(initialData.lat || 0);
      setLon(initialData.lon || initialData.lng || 0);
      setTimezone(initialData.timezone || 'UTC+1');
      setRunwayLengthFt(initialData.runwayLengthFt || 9000);
      setHandlingFeeBase(initialData.handlingFeeBase || 2500);
      setLandingFeeRate(initialData.landingFeeRate || 7.5);
      setParkingFeeDaily(initialData.parkingFeeDaily || 450);
      setFuelPricePerGal(initialData.fuelPricePerGal || 0);
      setPopularFbo(initialData.popularFbo || 'VIP FBO Terminal');
      setCustomsAvailable(initialData.customsAvailable !== false);
    } else {
      setIcao('');
      setIata('');
      setName('');
      setCity('');
      setCountry('');
      setFuelPricePerGal(0);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        icao: icao.toUpperCase(),
        iata: iata.toUpperCase(),
        name,
        city,
        country,
        lat,
        lon,
        timezone,
        runwayLengthFt,
        handlingFeeBase,
        landingFeeRate,
        parkingFeeDaily,
        fuelPricePerGal,
        popularFbo,
        customsAvailable,
        status: 'active',
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0F0F16] border border-white/20 shadow-2xl z-10 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-black/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {initialData ? 'Update Airport Specifications & Tariffs' : 'Register New Executive Airport'}
              </h3>
              <p className="text-xs text-zinc-400">Global Airport Matrix, FBO Services & Tariffs</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar text-xs">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">ICAO Code *</label>
              <input
                type="text"
                required
                maxLength={4}
                value={icao}
                onChange={(e) => setIcao(e.target.value.toUpperCase())}
                placeholder="LSGG"
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">IATA Code</label>
              <input
                type="text"
                maxLength={3}
                value={iata}
                onChange={(e) => setIata(e.target.value.toUpperCase())}
                placeholder="GVA"
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 uppercase"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-zinc-300 font-medium mb-1">Airport Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Geneva Cointrin Airport"
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-zinc-300 font-medium mb-1">City / Region *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Geneva"
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-zinc-300 font-medium mb-1">Country *</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Switzerland"
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={lon}
                onChange={(e) => setLon(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="UTC+1"
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Runway Length (ft)</label>
              <input
                type="number"
                value={runwayLengthFt}
                onChange={(e) => setRunwayLengthFt(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Tariffs & Fixed FBO Charges
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Base Handling ($)</label>
                <input
                  type="number"
                  value={handlingFeeBase}
                  onChange={(e) => setHandlingFeeBase(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Landing Rate ($/t)</label>
                <input
                  type="number"
                  step="0.1"
                  value={landingFeeRate}
                  onChange={(e) => setLandingFeeRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Daily Parking ($)</label>
                <input
                  type="number"
                  value={parkingFeeDaily}
                  onChange={(e) => setParkingFeeDaily(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Manual Fuel Dispatch Rate ($/gal)
                  <span className="text-zinc-500 text-xs block font-normal">Set 0 for JetFuelX Live API query</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={fuelPricePerGal}
                  onChange={(e) => setFuelPricePerGal(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Executive FBO Handler Name</label>
            <input
              type="text"
              value={popularFbo}
              onChange={(e) => setPopularFbo(e.target.value)}
              placeholder="e.g. TAG Aviation Geneva / Signature FBO"
              className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-950/80 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Airport' : 'Add Airport'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
