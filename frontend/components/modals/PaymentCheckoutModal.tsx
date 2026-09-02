import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  Lock, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Button } from '../common/Button';
import { PaymentService } from '../../services/customer/payment.service';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any | null;
  onPaymentInitiated?: () => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onPaymentInitiated,
}) => {
  const [paymentChannel, setPaymentChannel] = useState<'WIRE' | 'CARD'>('WIRE');
  const [loading, setLoading] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [settlementConfirmed, setSettlementConfirmed] = useState<boolean>(false);

  // Poll or check status if checkout result is active
  useEffect(() => {
    let interval: any;
    if (isOpen && invoice && checkoutResult && !settlementConfirmed) {
      interval = setInterval(async () => {
        try {
          const invId = invoice.id || invoice._id;
          const statusRes = await PaymentService.getInvoicePaymentStatus(invId);
          if (statusRes?.success && statusRes.data?.isSettled) {
            setSettlementConfirmed(true);
            if (onPaymentInitiated) onPaymentInitiated();
          }
        } catch (e) {
          // silent polling fail
        }
      }, 8000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, invoice, checkoutResult, settlementConfirmed]);

  if (!isOpen || !invoice) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleManualCheckStatus = async () => {
    setCheckingStatus(true);
    try {
      const invId = invoice.id || invoice._id;
      const statusRes = await PaymentService.getInvoicePaymentStatus(invId);
      if (statusRes?.success && statusRes.data?.isSettled) {
        setSettlementConfirmed(true);
        if (onPaymentInitiated) onPaymentInitiated();
      } else {
        setError('Settlement pending: Funds have not yet been cleared by banking network.');
        setTimeout(() => setError(null), 4000);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to check status.');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleInitiatePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const channelLabel =
        paymentChannel === 'WIRE' ? 'Swift MT103 Bank Wire Escrow' : 'Credit Card / Gateway Checkout';
      const invId = invoice.id || invoice._id;
      const res = await PaymentService.createCheckoutSession(invId, channelLabel);

      if (res.success && res.data) {
        setCheckoutResult(res.data);
        if (onPaymentInitiated) {
          onPaymentInitiated();
        }
      } else {
        setError(res.message || 'Unable to initiate checkout session.');
      }
    } catch (err: any) {
      setError(err.message || 'Payment initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0F0F16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Charter Escrow Settlement</h3>
              <p className="text-xs text-zinc-400 font-normal">Invoice Ref: {invoice.invoiceNumber || 'INV-CHARTER'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Invoice Summary Banner */}
          <div className="p-4 rounded-xl bg-[#14141E] border border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs text-zinc-400 uppercase font-semibold tracking-wide">Charter Route &amp; Aircraft</div>
              <div className="text-sm font-bold text-white">{invoice.routeSummary || 'Private Jet Charter'}</div>
              <div className="text-xs text-zinc-400 font-normal">{invoice.aircraftName || 'Gulfstream G650ER'}</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-zinc-400 uppercase font-semibold tracking-wide">Amount Due</div>
              <div className="text-xl font-bold text-emerald-400">
                ${invoice.total?.toLocaleString()} {invoice.currency || 'USD'}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!checkoutResult ? (
            /* STEP 1: Select Channel & Initiate */
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wide">
                Select Settlement Channel
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Bank Wire Escrow */}
                <button
                  type="button"
                  onClick={() => setPaymentChannel('WIRE')}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                    paymentChannel === 'WIRE'
                      ? 'bg-red-950/20 border-red-500/50 shadow-lg shadow-red-500/5'
                      : 'bg-[#14141E] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-white">
                      <Building2 className="w-5 h-5 text-red-400" />
                    </div>
                    {paymentChannel === 'WIRE' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">Swift MT103 Wire</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5 font-normal">
                      Dedicated Fedwire &amp; Escrow account for large-value private charters.
                    </div>
                  </div>
                </button>

                {/* Gateway / Credit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentChannel('CARD')}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                    paymentChannel === 'CARD'
                      ? 'bg-red-950/20 border-red-500/50 shadow-lg shadow-red-500/5'
                      : 'bg-[#14141E] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-white">
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                    </div>
                    {paymentChannel === 'CARD' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">Credit Card / Gateway</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5 font-normal">
                      Instant card tokenization with 3D Secure verification.
                    </div>
                  </div>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2.5 text-xs text-zinc-400 font-normal">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  All settlements are held in escrow under Fly Ayla Aviation charter governance and AML Level-1 clearance.
                </span>
              </div>
            </div>
          ) : (
            /* STEP 2: Checkout Response & Instructions */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold tracking-wide">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PAYMENT SESSION GENERATED ({checkoutResult.transactionId})</span>
                </div>
                <p className="text-xs text-zinc-300 font-normal">
                  {checkoutResult.instructions ||
                    'Payment session initialized. Please complete payment using the details below.'}
                </p>
              </div>

              {/* Wire Instructions Box */}
              {paymentChannel === 'WIRE' && (
                <div className="p-4 rounded-xl bg-[#14141E] border border-white/10 space-y-3 text-xs">
                  <div className="text-zinc-400 font-semibold uppercase tracking-wide text-xs">
                    Official Wire Transfer Coordinates
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                      <span className="text-zinc-400">Beneficiary:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">Fly Ayla Charter Holdings Ltd</span>
                        <button
                          onClick={() => handleCopy('beneficiary', 'Fly Ayla Charter Holdings Ltd')}
                          className="text-zinc-400 hover:text-white"
                        >
                          {copiedKey === 'beneficiary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                      <span className="text-zinc-400">IBAN / Account:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">KW82CBKU0000000012345678901234</span>
                        <button
                          onClick={() => handleCopy('iban', 'KW82CBKU0000000012345678901234')}
                          className="text-zinc-400 hover:text-white"
                        >
                          {copiedKey === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                      <span className="text-zinc-400">BIC / SWIFT:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">CBKUKWKW</span>
                        <button
                          onClick={() => handleCopy('swift', 'CBKUKWKW')}
                          className="text-zinc-400 hover:text-white"
                        >
                          {copiedKey === 'swift' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                      <span className="text-zinc-400">Payment Reference:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-semibold">{invoice.invoiceNumber}</span>
                        <button
                          onClick={() => handleCopy('ref', invoice.invoiceNumber)}
                          className="text-zinc-400 hover:text-white"
                        >
                          {copiedKey === 'ref' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Gateway Link */}
              {paymentChannel === 'CARD' && checkoutResult.paymentUrl && (
                <div className="p-4 rounded-xl bg-[#14141E] border border-white/10 space-y-3">
                  <div className="text-xs text-zinc-300 font-normal">
                    A secure checkout session has been initialized with the payment gateway.
                  </div>
                  <a
                    href={checkoutResult.paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors"
                  >
                    <span>Proceed to Gateway Checkout</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {settlementConfirmed ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-xs text-emerald-300 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm">Settlement Verified &amp; Confirmed!</div>
                    <div className="font-normal">Your commercial charter flight is officially confirmed with flight ops.</div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between gap-2 text-xs text-zinc-400 font-normal">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Status: <strong>Pending Bank / Gateway Verification</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={handleManualCheckStatus}
                    disabled={checkingStatus}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${checkingStatus ? 'animate-spin' : ''}`} />
                    <span>{checkingStatus ? 'Checking...' : 'Check Status'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-black/40 flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            {settlementConfirmed ? 'Done' : checkoutResult ? 'Close' : 'Cancel'}
          </Button>

          {!checkoutResult && (
            <Button
              variant="primary"
              size="sm"
              loading={loading}
              onClick={handleInitiatePayment}
              icon={ArrowRight}
            >
              Initiate Settlement
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
