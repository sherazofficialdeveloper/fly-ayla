import React from 'react';
import { 
  Plane, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  Gauge, 
  DollarSign, 
  Fuel, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

interface AircraftViewProps {
  aircraft: any[];
  onOpenAddModal: () => void;
  onOpenEditModal: (aircraft: any) => void;
  onDeleteAircraft: (id: string) => void;
}

export const AircraftView: React.FC<AircraftViewProps> = ({
  aircraft,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteAircraft,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Add Button */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0F0F16] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Global Aircraft Fleet Registry ({aircraft.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage airframe specifications, hourly direct operating rates, maintenance status, and base ICAO airports.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/80 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Aircraft</span>
        </button>
      </div>

      {/* Grid of Aircraft Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aircraft.map((ac) => {
          const imgUrl = ac.image || (ac.images && ac.images[0]) || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80';
          const passengers = ac.passengerCapacity || ac.maxPassengers || 14;

          return (
            <div
              key={ac.id || ac._id}
              className="rounded-2xl bg-[#0F0F16] border border-white/10 overflow-hidden shadow-2xl flex flex-col group hover:border-white/20 transition-all"
            >
              {/* Image & Status Badge */}
              <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
                <img
                  src={imgUrl}
                  alt={ac.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F16] via-transparent to-black/40" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-semibold text-zinc-200 border border-white/15">
                    {ac.category || 'Ultra Long Range'}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <StatusBadge status={ac.status || 'Available'} size="sm" />
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">{ac.name}</h3>
                    <div className="text-xs text-red-400 font-semibold">
                      {ac.tailNumber || 'UNASSIGNED'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs & Operational Telemetry */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-xs">
                
                <div className="grid grid-cols-2 gap-3 py-2 border-y border-white/5">
                  <div className="space-y-0.5">
                    <div className="text-xs text-zinc-400 uppercase font-medium">Hourly Rate</div>
                    <div className="font-bold text-emerald-400 text-sm">
                      ${(ac.hourlyRate || 14000).toLocaleString()}/hr
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs text-zinc-400 uppercase font-medium">Max Range</div>
                    <div className="font-bold text-white text-sm">
                      {(ac.maxRangeNm || 7000).toLocaleString()} NM
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs text-zinc-400 uppercase font-medium">Max Passengers</div>
                    <div className="font-bold text-white text-sm">
                      {passengers} Pax
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs text-zinc-400 uppercase font-medium">Base Station</div>
                    <div className="font-bold text-zinc-200 text-sm">
                      {ac.baseAirportIcao || 'LSGG'}
                    </div>
                  </div>
                </div>

                <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed font-normal">
                  {ac.description || 'Premium business jet configured with master suite and high-speed satellite communications.'}
                </p>

                {/* Card Action Controls */}
                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  <span className="text-xs text-zinc-400 font-normal">
                    Reg: {ac.registration || 'EASA / FAA'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenEditModal(ac)}
                      className="p-2 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit aircraft specifications"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteAircraft(ac.id || ac._id)}
                      className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/40 hover:border-rose-700 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                      title="Remove aircraft from active registry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
