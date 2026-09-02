import React, { useState, useEffect } from 'react';
import { X, Plane, Upload } from 'lucide-react';

interface AircraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (aircraftData: any) => Promise<void>;
  initialData?: any;
}

export const AircraftModal: React.FC<AircraftModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('Gulfstream Aerospace');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('Ultra Long Range');
  const [tailNumber, setTailNumber] = useState('');
  const [registration, setRegistration] = useState('Malta (9H)');
  const [passengerCapacity, setPassengerCapacity] = useState<number>(14);
  const [maxRangeNm, setMaxRangeNm] = useState<number>(7500);
  const [cruiseSpeedKts, setCruiseSpeedKts] = useState<number>(516);
  const [hourlyRate, setHourlyRate] = useState<number>(14000);
  const [hourlyFuelBurnGal, setHourlyFuelBurnGal] = useState<number>(450);
  const [status, setStatus] = useState('available');
  const [description, setDescription] = useState('');
  const [baseAirportIcao, setBaseAirportIcao] = useState('LSGG');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setManufacturer(initialData.manufacturer || '');
      setModel(initialData.model || '');
      setCategory(initialData.category || 'Ultra Long Range');
      setTailNumber(initialData.tailNumber || '');
      setRegistration(initialData.registration || '');
      setPassengerCapacity(initialData.passengerCapacity || initialData.maxPassengers || 14);
      setMaxRangeNm(initialData.maxRangeNm || 7000);
      setCruiseSpeedKts(initialData.cruiseSpeedKts || 500);
      setHourlyRate(initialData.hourlyRate || 12000);
      setHourlyFuelBurnGal(initialData.hourlyFuelBurnGal || 400);
      setStatus(initialData.status?.toLowerCase() || 'available');
      setDescription(initialData.description || '');
      setBaseAirportIcao(initialData.baseAirportIcao || 'LSGG');
      if (initialData.image || (initialData.images && initialData.images[0])) {
        setImage(initialData.image || initialData.images[0]);
      }
    } else {
      setName('');
      setModel('');
      setTailNumber('');
      setDescription('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        manufacturer,
        model: model || name,
        category,
        tailNumber,
        registration,
        passengerCapacity,
        maxRangeNm,
        cruiseSpeedKts,
        hourlyRate,
        hourlyFuelBurnGal,
        status,
        description,
        baseAirportIcao,
        images: [image],
        amenities: ['Ka-Band High Speed WiFi', 'Master Suite Bed', 'Nuage Seats', 'Full Galley Kitchen', 'Acoustic Soundproofing'],
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
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {initialData ? 'Update Aircraft Specifications' : 'Register New Aircraft to Fleet'}
              </h3>
              <p className="text-xs text-zinc-400">Global Fleet Registry & Operational Specs</p>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Aircraft Name / Type *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bombardier Global 7500"
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Tail Number / Registration *</label>
              <input
                type="text"
                required
                value={tailNumber}
                onChange={(e) => setTailNumber(e.target.value.toUpperCase())}
                placeholder="e.g. 9H-AYLA1"
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Manufacturer</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="e.g. Bombardier"
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="Ultra Long Range">Ultra Long Range</option>
                <option value="Heavy Jet">Heavy Jet</option>
                <option value="Super Midsize">Super Midsize</option>
                <option value="Midsize">Midsize</option>
                <option value="Super Light Jet">Super Light Jet</option>
                <option value="Light Jet">Light Jet</option>
                <option value="VIP Airliner">VIP Airliner (BBJ/ACJ)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Max Passenger Capacity</label>
              <input
                type="number"
                min="1"
                max="50"
                value={passengerCapacity}
                onChange={(e) => setPassengerCapacity(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Max Range (NM)</label>
              <input
                type="number"
                value={maxRangeNm}
                onChange={(e) => setMaxRangeNm(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Hourly Airframe Rate ($/hr)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Fuel Burn (Gal/hr)</label>
              <input
                type="number"
                value={hourlyFuelBurnGal}
                onChange={(e) => setHourlyFuelBurnGal(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Base Airport (ICAO)</label>
              <input
                type="text"
                value={baseAirportIcao}
                onChange={(e) => setBaseAirportIcao(e.target.value.toUpperCase())}
                placeholder="e.g. LSGG or KTEB"
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="available">Available / Ready for Dispatch</option>
                <option value="in-flight">In-Flight / Mission Active</option>
                <option value="maintenance">Maintenance / Hangar Inspection</option>
                <option value="reserved">Reserved / VIP Hold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Cabin & Aircraft Overview</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Four distinct living zones, state-of-the-art acoustic soundproofing, Ka-band high speed connectivity..."
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
              {isSubmitting ? 'Saving...' : initialData ? 'Update Aircraft' : 'Add to Fleet'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
