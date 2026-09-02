import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Fuel, 
  DollarSign, 
  Building2 
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

interface AirportsViewProps {
  airports: any[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (airport: any) => void;
  onDeleteAirport: (id: string) => void;
}

export const AirportsView: React.FC<AirportsViewProps> = ({
  airports,
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteAirport,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Search */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0F0F16] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Global Executive Airport Database ({airports.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Runway capabilities, FBO handling tariffs, landing fee rates, Jet-A fuel prices, and 24/7 customs status.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search ICAO, IATA, city, country..."
              className="w-full bg-[#14141E] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/80 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Airport</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0F0F16] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-zinc-400 font-semibold uppercase text-xs tracking-wide">
                <th className="py-3.5 px-4 font-semibold">ICAO / IATA</th>
                <th className="py-3.5 px-4 font-semibold">Airport Name & City</th>
                <th className="py-3.5 px-4 font-semibold">Runway (ft)</th>
                <th className="py-3.5 px-4 font-semibold">Base Handling ($)</th>
                <th className="py-3.5 px-4 font-semibold">Jet-A Fuel ($/gal)</th>
                <th className="py-3.5 px-4 font-semibold">Customs</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {airports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    No airports found matching the query.
                  </td>
                </tr>
              ) : (
                airports.map((apt) => (
                  <tr key={apt.id || apt._id || apt.icao} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <span className="text-red-400">{apt.icao}</span>
                      {apt.iata && <span className="text-zinc-400 ml-1.5">({apt.iata})</span>}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{apt.name}</div>
                      <div className="text-xs text-zinc-400 font-normal">
                        {apt.city}, {apt.country} &bull; {apt.timezone || 'UTC'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300 font-medium">
                      {apt.runwayLengthFt ? `${apt.runwayLengthFt.toLocaleString()} ft` : '8,500 ft'}
                    </td>

                    <td className="py-3.5 px-4 text-emerald-400 font-semibold">
                      ${(apt.handlingFeeBase || 2500).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-200 font-medium">
                      {apt.fuelPricePerGal && apt.fuelPricePerGal > 0 ? (
                        `$${apt.fuelPricePerGal.toFixed(2)}/gal`
                      ) : (
                        <span className="text-amber-400/80 text-xs italic">
                          JetFuelX API
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        <ShieldCheck className="w-3 h-3" />
                        <span>24/7 AOE</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenEditModal(apt)}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit airport tariffs & parameters"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteAirport(apt.id || apt._id || apt.icao)}
                          className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-900/40 hover:border-rose-700 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                          title="Remove airport"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
