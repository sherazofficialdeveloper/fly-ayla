import React from 'react';
import { 
  FileCheck, 
  Receipt, 
  CreditCard, 
  CalendarCheck, 
  Compass, 
  PlaneTakeoff,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CommercialWorkflowCmsContent } from '../../types/cms';

interface WorkflowCommercialSectionProps {
  content?: CommercialWorkflowCmsContent;
  onRequestFlight?: () => void;
}

export const WorkflowCommercialSection: React.FC<WorkflowCommercialSectionProps> = ({
  content,
  onRequestFlight
}) => {
  const tag = content?.tag ?? 'END-TO-END WORKFLOW';
  const title = content?.title ?? 'FROM QUOTE TO TAKEOFF.';
  const description = content?.description ?? 'Every commercial step is automated and verified through our digital aviation operating system. Complete tracking and documentation at every milestone.';
  const stages = content?.stages ?? [
    {
      step: '01',
      title: 'Flight Request',
      description: 'Define routing, dates, passenger count, and catering preferences via our direct digital portal.',
      statusText: 'Instant Submission'
    },
    {
      step: '02',
      title: 'Itemized Quotation',
      description: 'Receive transparent pricing with verified fuel burn, FBO fees, and flight path telemetry.',
      statusText: 'Under 10 Minutes'
    },
    {
      step: '03',
      title: 'Digital Invoicing',
      description: 'Automated generation of official commercial invoices with multi-currency and payment split capabilities.',
      statusText: 'Automated Invoice'
    },
    {
      step: '04',
      title: 'Seamless Payment',
      description: 'Secure settlement via bank wire (SWIFT MT103), corporate credit cards, or crypto escrow.',
      statusText: 'Immediate Clearance'
    },
    {
      step: '05',
      title: 'Booking Confirmed',
      description: 'Airframe locked, diplomatic overflight clearances filed, and crew roster dispatched.',
      statusText: 'Flight Dispatched'
    },
    {
      step: '06',
      title: 'Tarmac Departure',
      description: 'Arrive at the private FBO terminal 15 minutes before wheels-up with dedicated VIP escort.',
      statusText: 'VIP Wheels-Up'
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-white text-zinc-900 border-t border-zinc-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 text-left">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              {tag}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-950 tracking-tight uppercase leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* 6 Stage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {stages.map((stg) => (
            <div
              key={stg.step}
              className="group relative bg-zinc-50 hover:bg-zinc-100/80 rounded-2xl border border-zinc-200 hover:border-zinc-300 p-7 flex flex-col justify-between transition-all duration-300 red-accent-card shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-zinc-900 text-white group-hover:bg-red-600 transition-colors uppercase tracking-wider">
                    STAGE {stg.step}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-medium bg-white px-2.5 py-1 rounded-md border border-zinc-200">
                    {stg.statusText}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-zinc-950 mb-2">
                  {stg.title}
                </h3>

                <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                  {stg.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-zinc-200/80 flex items-center justify-between text-xs text-zinc-500 font-normal">
                <span>Milestone {stg.step} of 06</span>
                <span className="text-red-600 font-semibold">Verified</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
