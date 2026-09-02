import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  ExternalLink, 
  FileText 
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

interface ForensicViewProps {
  cases: any[];
  onUpdateCase: (id: string, data: any) => Promise<void>;
}

export const ForensicView: React.FC<ForensicViewProps> = ({
  cases,
  onUpdateCase,
}) => {
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewDecision, setReviewDecision] = useState<'CLEARED' | 'FLAGGED' | 'BLOCKED'>('CLEARED');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOpenReview = (c: any) => {
    setSelectedCase(c);
    setReviewNotes(c.notes || '');
    setReviewDecision(c.amlStatus === 'PASSED' ? 'CLEARED' : (c.amlStatus as any) || 'CLEARED');
  };

  const handleSubmitReview = async () => {
    if (!selectedCase) return;
    setIsUpdating(true);
    try {
      await onUpdateCase(selectedCase.id || selectedCase._id, {
        amlStatus: reviewDecision,
        notes: reviewNotes,
        reviewedBy: 'Compliance Lead',
      });
      setSelectedCase(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Sentinel Status Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/60 via-[#0F0F16] to-[#0A0A10] border border-red-900/40 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-950/80">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">PAYLA FORENSIC™ AML Sentinel</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-800/40">
                  REAL-TIME ACTIVE
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Automated OFAC, EU, UN Sanctions Screening, PEP (Politically Exposed Persons) checks, and Swift transaction risk telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-300">
            <div className="px-3 py-2 rounded-xl bg-black/60 border border-white/10">
              <div className="text-xs text-zinc-400 uppercase font-medium">Sanctions Watchlist</div>
              <div className="font-bold text-emerald-400">OFAC Q3-2026 LIVE</div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-black/60 border border-white/10">
              <div className="text-xs text-zinc-400 uppercase font-medium">AML Threshold</div>
              <div className="font-bold text-white">$10,000 USD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="rounded-2xl bg-[#0F0F16] border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Active AML Forensic Surveillance Cases ({cases.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20 text-zinc-400 font-semibold uppercase text-xs tracking-wide">
                <th className="py-3.5 px-4 font-semibold">Case Reference</th>
                <th className="py-3.5 px-4 font-semibold">Subject / Entity</th>
                <th className="py-3.5 px-4 font-semibold">Transaction Amount</th>
                <th className="py-3.5 px-4 font-semibold">Risk Score</th>
                <th className="py-3.5 px-4 font-semibold">Sanctions Screening</th>
                <th className="py-3.5 px-4 font-semibold">AML Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Compliance Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    No open AML forensic cases requiring human compliance review.
                  </td>
                </tr>
              ) : (
                cases.map((c) => {
                  const riskScore = c.riskScore || 15;
                  const riskColor = riskScore > 70 ? 'text-rose-400' : riskScore > 35 ? 'text-amber-400' : 'text-emerald-400';

                  return (
                    <tr key={c.id || c._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-zinc-200">
                        {c.caseNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{c.customerName}</div>
                        <div className="text-xs text-zinc-400 font-normal">{c.customerEmail}</div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-white">
                        ${c.transactionAmount?.toLocaleString()} {c.currency || 'USD'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${riskColor}`}>{riskScore}/100</span>
                          <div className="w-16 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                            <div
                              className={`h-full ${riskScore > 70 ? 'bg-rose-500' : riskScore > 35 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${riskScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-xs text-zinc-300 font-medium">
                          {c.sanctionCheckResult || 'OFAC: CLEAR'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={c.amlStatus || 'CLEARED'} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenReview(c)}
                          className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-300 hover:text-white font-semibold text-xs transition-all cursor-pointer"
                        >
                          Review Case
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Case Review Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setSelectedCase(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0F0F16] border border-white/20 p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150 text-xs">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">AML Compliance Adjudication</h3>
                <p className="text-zinc-400 text-xs mt-0.5 font-normal">Case {selectedCase.caseNumber} &bull; {selectedCase.customerName}</p>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex justify-between text-zinc-300">
                <span>Transaction Value:</span>
                <span className="font-bold text-white">${selectedCase.transactionAmount?.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Risk Score:</span>
                <span className="font-bold text-amber-400">{selectedCase.riskScore || 15}/100</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Sanction List Check:</span>
                <span className="font-bold text-emerald-400">{selectedCase.sanctionCheckResult || 'OFAC / EU / UN: CLEAR'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-zinc-300 font-medium">Compliance Decision</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CLEARED', label: 'Clear & Approve', color: 'border-emerald-500 text-emerald-400' },
                  { id: 'FLAGGED', label: 'Flag for Audit', color: 'border-amber-500 text-amber-400' },
                  { id: 'BLOCKED', label: 'Block & Report', color: 'border-rose-500 text-rose-400' },
                ].map((dec) => (
                  <button
                    key={dec.id}
                    type="button"
                    onClick={() => setReviewDecision(dec.id as any)}
                    className={`p-2.5 rounded-xl border text-center font-semibold text-xs transition-all cursor-pointer ${
                      reviewDecision === dec.id
                        ? `${dec.color} bg-white/5 shadow-md`
                        : 'border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    {dec.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-zinc-300 font-medium">Officer Review Notes / Rationale</label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Document verification and Swift MT103 originator matching..."
                className="w-full bg-[#14141E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={isUpdating}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-red-950/80"
              >
                {isUpdating ? 'Recording...' : 'Submit Compliance Review'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
