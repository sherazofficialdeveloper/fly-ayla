import { GlobalCmsStore } from '../types/cms';

export const INITIAL_CMS_CONTENT: GlobalCmsStore = {
  hero: {
    eyebrow: 'PRIVATE AVIATION',
    headlineLine1: 'PRIVATE AVIATION,',
    headlineLine2: 'BUILT AROUND YOUR JOURNEY.',
    headlineHighlight: 'IN SECONDS.',
    description: 'Fly Ayla makes private flight requests, aircraft selection, transparent pricing, instant quotations, and seamless booking effortless through one modern aviation platform.',
    primaryCtaText: 'Request a Flight',
    primaryCtaAction: 'flight-request',
    secondaryCtaText: 'Explore Our Fleet',
    secondaryCtaAction: 'section-fleet',
    stat1Value: 'Instant',
    stat1Label: 'Flight Quoting Engine',
    stat2Value: '4,500+',
    stat2Label: 'Airports Worldwide',
    stat3Value: '100%',
    stat3Label: 'Direct Cost Transparency',
    trustBarText: 'GLOBAL PRIVATE AVIATION STANDARDS',
    trustBarPills: [
      'Private Aviation',
      'Transparent Pricing',
      'Personalized Service',
      'Professional Flight Operations'
    ]
  },

  trustIntro: {
    tag: 'PRIVATE AVIATION, SIMPLIFIED',
    title: 'A modern, transparent way to fly private',
    description: 'Traditional private jet charter has always been burdened by manual phone calls, hidden brokerage markups, and delayed quotes. Fly Ayla simplifies every step from your initial flight request to confirmed tarmac departure.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    points: [
      {
        title: 'Instant Flight Requests',
        description: 'Submit your departure, destination, schedule, and passenger requirements in seconds.'
      },
      {
        title: 'Intelligent Route & Fleet Matching',
        description: 'Our aviation engine calculates real flight paths, block times, and pairs the ideal aircraft for your mission.'
      },
      {
        title: 'Transparent Pricing & Digital Invoicing',
        description: 'Receive an itemized quote reflecting actual fuel, handling, and navigation fees with zero hidden surprises.'
      },
      {
        title: 'Guaranteed 24/7 Operations Support',
        description: 'Dedicated flight coordinators manage diplomatic clearances, FBO handling, and tarmac concierge around the clock.'
      }
    ]
  },

  platform: {
    tag: 'INTELLIGENT AVIATION ENGINE',
    title: 'Precision technology behind every flight',
    description: 'Engineered for discerning private travelers, corporate flight departments, and family offices requiring unmatched accuracy and reliability.',
    features: [
      {
        id: 'feat-1',
        iconName: 'Compass',
        title: 'Airport-to-Airport Routing',
        description: 'Enter any two global airports and receive the real flight path, block time, and nautical distance instantly.',
        badge: '4,500+ Airfields',
        detail: 'Computes great-circle geodesics with dynamic airway vectoring, elevation adjustments, and taxi allowance worldwide.',
        active: true
      },
      {
        id: 'feat-2',
        iconName: 'Fuel',
        title: 'Live Fuel & Handling Data',
        description: 'Connected directly to global Jet-A fuel indices, ramp handling matrices, and airport tariff schedules.',
        badge: 'Real-Time Telemetry',
        detail: 'Live ramp fee indexing, de-icing risk assessment, overnight parking surcharges, and into-plane fuel pricing.',
        active: true
      },
      {
        id: 'feat-3',
        iconName: 'Layers',
        title: 'Fleet Cost Intelligence',
        description: 'Aircraft lease, crew logistics, insurance, and maintenance reserves allocated transparently to every trip.',
        badge: 'True Economics',
        detail: 'Amortizes dry/wet lease debt service, engine overhaul reserves (MSP/JSSI), crew per diems, and recurrent training.',
        active: true
      },
      {
        id: 'feat-4',
        iconName: 'FileCheck',
        title: 'Instant Luxury Quotations',
        description: 'Receive itemized, crystal-clear digital proposals with aircraft interior layouts and baggage capacities.',
        badge: 'Under 5 Seconds',
        detail: 'Generate luxury PDF proposals with customizable margin percentage sliders, aircraft interior specs, and digital sign-offs.',
        active: true
      },
      {
        id: 'feat-5',
        iconName: 'Receipt',
        title: 'Automated Invoicing & Escrow',
        description: 'Approved quotes convert directly to multi-currency invoices with automated Wire/SWIFT and payment receipts.',
        badge: 'Multi-Currency',
        detail: 'Integrated with automated Wire/SWIFT MT103 reconciliation, credit card processing, and escrow payment tracking.',
        active: true
      },
      {
        id: 'feat-6',
        iconName: 'ShieldCheck',
        title: 'Flight Operations Oversight',
        description: 'Full visibility over flight dispatch statuses, pilot duty cycles, customer itineraries, and trip tracking.',
        badge: '24/7 Dispatch',
        detail: 'Unified dispatch command with real-time flight tracking, meteorological updates, and PAYLA FORENSIC verification.',
        active: true
      }
    ]
  },

  services: {
    tag: 'PRIVATE AVIATION SERVICES',
    title: 'FLY YOUR WAY.',
    description: 'Whether you require an urgent executive hop, transcontinental family travel, or dedicated corporate aviation, Fly Ayla executes every journey with flawless precision.',
    services: [
      {
        id: 'serv-1',
        title: 'Private Jet Charter',
        shortDescription: 'Bespoke on-demand flights worldwide with guaranteed aircraft availability in under 3 hours.',
        longDescription: 'Direct ramp-side tarmac access, bespoke Michelin-standard catering, and dedicated flight support dispatchers available 24/7/365 across 4,500+ private jet airports.',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
        badge: 'On-Demand VIP',
        highlights: ['Access to 4,500+ private FBOs', 'Zero TSA queues or terminal delays', 'Dedicated VIP Ground Concierge'],
        ctaText: 'Request Charter',
        active: true
      },
      {
        id: 'serv-2',
        title: 'Executive Travel',
        shortDescription: 'Time-critical air travel engineered for senior leadership, executives, and sovereign delegations.',
        longDescription: 'High-speed satellite connectivity, soundproof private staterooms, and direct VIP terminal transfers to optimize executive productivity in flight.',
        image: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=1200&q=80',
        badge: 'Executive Suite',
        highlights: ['High-speed Ka-band inflight Wi-Fi', 'Private conference configurations', 'Confidential passenger manifests'],
        ctaText: 'Explore Executive',
        active: true
      },
      {
        id: 'serv-3',
        title: 'Corporate Aviation',
        shortDescription: 'Turnkey scheduled and on-demand flight solutions for multinational enterprises and board rotations.',
        longDescription: 'Cost-optimized corporate shuttle routes with guaranteed fixed hourly rates, centralized billing, and detailed carbon-offset telemetry.',
        image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
        badge: 'Enterprise Fleet',
        highlights: ['Priority dispatch SLAs', 'Consolidated monthly billing', 'Comprehensive tax & duty reconciliation'],
        ctaText: 'Corporate Solutions',
        active: true
      },
      {
        id: 'serv-4',
        title: 'Group Travel & Delegation',
        shortDescription: 'Charter solutions for large delegations, sports teams, orchestral tours, and event transport.',
        longDescription: 'Customized VIP airliners and regional jets configured for 20 to 180 passengers with coordinated group baggage handling and custom livery options.',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
        badge: '20 - 180 Guests',
        highlights: ['Custom branded aircraft livery & headrests', 'Dedicated group check-in counters', 'Heavy baggage capacity'],
        ctaText: 'Group Inquiries',
        active: true
      },
      {
        id: 'serv-5',
        title: 'Air Ambulance & Medevac',
        shortDescription: 'ICU-equipped aircraft with specialized aero-medical personnel ready for immediate global deployment.',
        longDescription: 'Bed-to-bed international patient transport with state-of-the-art life support equipment, specialized flight physicians, and expedited airspace clearances.',
        image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80',
        badge: '24/7 Medevac',
        highlights: ['ICU-configured cabin suites', 'Doctor & paramedic flight crews', 'Priority diplomatic airspace clearance'],
        ctaText: 'Request Medevac',
        active: true
      },
      {
        id: 'serv-6',
        title: 'Special Flight Requests',
        shortDescription: 'Bespoke helicopter transfers, pet-friendly charters, diplomatic escorts, and sensitive cargo transport.',
        longDescription: 'From cabin pet accommodations to heavy diplomatic security details and last-mile helicopter transfers to private yachts or mountain resorts.',
        image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
        badge: 'Bespoke Logistics',
        highlights: ['100% In-cabin pet travel', 'Helicopter yacht & alpine transfers', 'High-security diplomatic escorts'],
        ctaText: 'Custom Request',
        active: true
      }
    ]
  },

  smartPricing: {
    tag: 'SMART AVIATION PRICING',
    title: 'PRECISION BEHIND EVERY QUOTE.',
    description: 'Private flight pricing should never be based on arbitrary rules of thumb. Fly Ayla calculates every variable from actual flight telemetry, current fuel indices, airport handling tariffs, and fixed operational reserves.',
    breakdownItems: [
      {
        name: 'Aircraft Base Flight Cost',
        description: 'Aircraft flight time multiplied by calibrated hourly consumption profile and airframe utilization.',
        typicalCost: 'Base Route Calculation',
        iconName: 'Plane'
      },
      {
        name: 'Jet-A Fuel Burn & Uplift',
        description: 'Specific nautical distance fuel burn adjusted for cruise altitude, headwind components, and local airport Jet-A prices.',
        typicalCost: 'Live FBO Fuel Matrix',
        iconName: 'Fuel'
      },
      {
        name: 'Airport Handling & Ramp Fees',
        description: 'Landing fees, FBO ramp handling, passenger terminal taxes, and overnight apron parking fees.',
        typicalCost: 'Official Airport Tariffs',
        iconName: 'Building'
      },
      {
        name: 'Navigation & FIR Overflight Fees',
        description: 'Eurocontrol and national Flight Information Region (FIR) overflight charges computed along the active airway track.',
        typicalCost: 'Airspace Authority Rates',
        iconName: 'Compass'
      },
      {
        name: 'Operational & Crew Logistics',
        description: 'Captain and First Officer duty per diems, hotel accommodations, crew transport, and catering allowances.',
        typicalCost: 'Mission-Specific Logistics',
        iconName: 'Users'
      },
      {
        name: 'Fixed Cost & Maintenance Reserves',
        description: 'Dry lease debt service, engine overhaul reserves (MSP/JSSI), and avionics insurance amortized per block hour.',
        typicalCost: 'Fleet Economic Amortization',
        iconName: 'ShieldCheck'
      }
    ]
  },

  howItWorks: {
    tag: 'HOW IT WORKS',
    title: 'FROM FLIGHT REQUEST TO CONFIRMED BOOKING.',
    description: 'Experience a seamless, five-step private aviation journey engineered for absolute transparency, speed, and discretion.',
    steps: [
      {
        stepNumber: '01',
        title: 'Request Your Flight',
        description: 'Specify your departure airport, arrival destination, date, passengers, and preferred aircraft class.',
        iconName: 'Plane',
        active: true
      },
      {
        stepNumber: '02',
        title: 'Flight Processing',
        description: 'Our engine routes the airway track, computes fuel burn, confirms airfield slots, and matches optimal aircraft.',
        iconName: 'Calculator',
        active: true
      },
      {
        stepNumber: '03',
        title: 'Receive Your Quote',
        description: 'Get a clear, transparent digital quote detailing aircraft interior specs, amenities, and itemized trip costs.',
        iconName: 'FileText',
        active: true
      },
      {
        stepNumber: '04',
        title: 'Approve & Pay',
        description: 'Approve your itinerary with one click and complete payment securely via bank wire, card, or escrow.',
        iconName: 'CreditCard',
        active: true
      },
      {
        stepNumber: '05',
        title: 'Booking Confirmed',
        description: 'Receive your flight briefing, crew details, FBO terminal directions, and 24/7 tarmac VIP concierge escort.',
        iconName: 'CheckCircle2',
        active: true
      }
    ]
  },

  premiumExperience: {
    tag: 'THE ELEVATED STANDARD',
    title: 'MORE THAN A FLIGHT.',
    description: 'Private aviation is the ultimate return on time. Every Fly Ayla journey is tailored around your privacy, comfort, and schedule flexibility.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    features: [
      {
        title: 'Total Privacy & Discretion',
        description: 'Private FBO terminals ensure you board your aircraft without crowds, paparazzi, or intrusive security lines.',
        iconName: 'Shield'
      },
      {
        title: 'Bespoke Luxury Comfort',
        description: 'Handcrafted leather seating, lie-flat bedding, fine dining tailored to dietary preferences, and vintage cellar selections.',
        iconName: 'Sparkles'
      },
      {
        title: 'Uncompromised Flexibility',
        description: 'Fly on your schedule. Need to adjust your departure by two hours? Your aircraft and crew wait for you.',
        iconName: 'Clock'
      },
      {
        title: '24/7 Dedicated Flight Coordination',
        description: 'Your personal flight director oversees ground transportation, baggage handling, and diplomatic overflight clearances.',
        iconName: 'Headphones'
      }
    ]
  },

  commercialWorkflow: {
    tag: 'COMMERCIAL WORKFLOW',
    title: 'FROM QUOTE TO TAKEOFF.',
    description: 'How Fly Ayla handles the end-to-end commercial lifecycle with automated digital documentation, transparent invoicing, and payment verification.',
    stages: [
      {
        step: '01',
        title: 'Flight Request',
        desc: 'Client submits trip parameters, passenger counts, and catering preferences.',
        statusBadge: 'Request Submitted'
      },
      {
        step: '02',
        title: 'Quotation Engine',
        desc: 'Dynamic flight route calculation generates an accurate cost profile and margin schedule.',
        statusBadge: 'Quote Generated'
      },
      {
        step: '03',
        title: 'Customer Approval',
        desc: 'Client reviews luxury PDF presentation and approves itinerary digitally.',
        statusBadge: 'Itinerary Approved'
      },
      {
        step: '04',
        title: 'Automated Invoice',
        desc: 'System generates branded multi-currency invoice with SWIFT/IBAN instructions.',
        statusBadge: 'Invoice Dispatched'
      },
      {
        step: '05',
        title: 'Payment & Verification',
        desc: 'Bank wire / card settlement verified instantly via automated matching & AML audit.',
        statusBadge: 'Payment Verified'
      },
      {
        step: '06',
        title: 'Confirmed Takeoff',
        desc: 'Flight crew rostered, diplomatic permits secured, and VIP FBO tarmac pass issued.',
        statusBadge: 'Flight Cleared'
      }
    ]
  },

  fleetCostSimulator: {
    tag: 'FOR OPERATORS',
    title: 'Built around how your fleet actually costs money',
    description: 'Dry lease or wet lease. Financed or fully owned. Every operator\'s cost structure is different — Fly Ayla is built to model yours, not a generic template.',
    defaultDryLease: 8200,
    defaultCrewSalaries: 22000,
    defaultEngineReserve: 348,
    defaultAirframeReserve: 210,
    defaultCrewTraining: 1800,
    defaultWifiSub: 420,
    defaultMonthlyHours: 35,
    bulletPoints: [
      'Dry lease, wet lease, bank financing, or depreciation — your choice',
      'Ferry and positioning legs included automatically',
      'Engine & airframe maintenance reserves built into every quote',
      'Multiple aircraft profiles under one subscription'
    ]
  },

  fleetFinancing: {
    tag: 'OWNERSHIP, YOUR WAY',
    title: 'Every aircraft is financed differently. So is every quote.',
    description: 'Model distinct cashflow structures for each aircraft in your fleet with transparent, predictable amortization.',
    models: [
      {
        id: 'finance-1',
        title: 'Dry Lease',
        iconName: 'FileText',
        description: 'Monthly lease rate entered once, automatically amortized into every trip you fly on that aircraft.',
        active: true
      },
      {
        id: 'finance-2',
        title: 'Wet Lease',
        iconName: 'Layers',
        description: 'All-in rate covering aircraft and crew — modeled as a single simplified fixed cost line.',
        active: true
      },
      {
        id: 'finance-3',
        title: 'Financed',
        iconName: 'Building2',
        description: 'Bank loan payment plus insurance, allocated per flight hour across your fleet\'s utilization.',
        active: true
      },
      {
        id: 'finance-4',
        title: 'Fully Owned',
        iconName: 'CheckCircle2',
        description: 'Depreciation schedule built in, so owned aircraft carry their true cost in every quote.',
        active: true
      }
    ]
  },

  recurringCosts: {
    tag: 'FIXED COSTS, FULLY MODELED',
    title: 'Every recurring cost your fleet carries, accounted for',
    description: 'Most quoting tools only think about fuel and handling. Fly Ayla goes further — every fixed cost that keeps your aircraft flying is entered once, then allocated into trip pricing automatically.',
    items: [
      { id: 'rc-1', name: 'Aircraft Lease / Loan', iconName: 'CreditCard', category: 'Fixed', active: true },
      { id: 'rc-2', name: 'Crew Salaries', iconName: 'Users', category: 'Fixed', active: true },
      { id: 'rc-3', name: 'Crew Training', iconName: 'GraduationCap', category: 'Fixed', active: true },
      { id: 'rc-4', name: 'Licensing & Compliance', iconName: 'FileCheck', category: 'Fixed', active: true },
      { id: 'rc-5', name: 'WiFi & Subscriptions', iconName: 'Wifi', category: 'Fixed', active: true },
      { id: 'rc-6', name: 'Crew Travel & Per Diem', iconName: 'PlaneTakeoff', category: 'Variable', active: true },
      { id: 'rc-7', name: 'Uniforms & Badging', iconName: 'Shirt', category: 'Fixed', active: true },
      { id: 'rc-8', name: 'Engine Maintenance Reserve', iconName: 'Wrench', category: 'Reserve', active: true },
      { id: 'rc-9', name: 'Airframe Maintenance Reserve', iconName: 'Gauge', category: 'Reserve', active: true },
      { id: 'rc-10', name: 'Non-Scheduled Maintenance', iconName: 'AlertTriangle', category: 'Reserve', active: true }
    ]
  },

  ferryPositioning: {
    tag: 'FERRY & POSITIONING',
    title: 'No more forgetting the empty legs',
    description: 'If your aircraft has to reposition before or after a client trip, that cost belongs in the quote — not absorbed quietly by your margin. Fly Ayla detects positioning legs and folds the real fuel, crew, and time cost straight into the trip total.',
    bulletPoints: [
      'Ferry flights priced the same way as revenue legs',
      'Automatically detected from aircraft base vs. trip origin',
      'Shown internally — client still sees one clean number'
    ]
  },

  fleetCategories: {
    tag: 'THE RIGHT AIRCRAFT FOR EVERY JOURNEY',
    title: 'THE RIGHT AIRCRAFT FOR EVERY JOURNEY.',
    description: 'Explore our curated collection of high-performance light jets, versatile midsize cabins, and ultra-long-range global flagships.',
    categories: [
      {
        id: 'cat-1',
        categoryName: 'Light Jet',
        ownershipType: 'Regional Precision',
        description: 'Ideal for short continental hops and regional executive meetings with outstanding airfield agility.',
        featuredAircraftName: 'Phenom 300E / Citation CJ4',
        hourlyRateEst: '$3,400 - $4,600/hr',
        rangeNm: 2010,
        passengers: 8,
        active: true
      },
      {
        id: 'cat-2',
        categoryName: 'Midsize Jet',
        ownershipType: 'Transcontinental Comfort',
        description: 'Stand-up cabin comfort, generous luggage capacity, and coast-to-coast non-stop range.',
        featuredAircraftName: 'Challenger 350 / Citation Latitude',
        hourlyRateEst: '$5,900 - $7,800/hr',
        rangeNm: 3200,
        passengers: 9,
        active: true
      },
      {
        id: 'cat-3',
        categoryName: 'Heavy Jet',
        ownershipType: 'Intercontinental Luxury',
        description: 'Multiple living zones, dedicated stateroom, full galley, and intercontinental non-stop capability.',
        featuredAircraftName: 'Gulfstream G650ER / Global 7500',
        hourlyRateEst: '$11,800 - $16,500/hr',
        rangeNm: 7700,
        passengers: 16,
        active: true
      }
    ]
  },

  stopGuesswork: {
    tag: 'WHY FLY AYLA',
    title: 'BUILT FOR A BETTER WAY TO FLY.',
    description: 'Experience the distinction of a modern private aviation platform built around precision, speed, and client empowerment.',
    comparisons: [
      {
        id: 'comp-1',
        topic: 'Transparent Direct Pricing',
        traditionalWay: 'Opaque charter markups with unpredictable handling and fuel surcharges added post-flight.',
        flyAylaWay: 'Upfront itemized quotes calculated from real fuel, handling, and navigation data.'
      },
      {
        id: 'comp-2',
        topic: 'Instant Quote Generation',
        traditionalWay: 'Hours spent waiting for brokers to manually email back-and-forth for operator pricing.',
        flyAylaWay: 'Complete digital flight itineraries generated in seconds with real-time aircraft availability.'
      },
      {
        id: 'comp-3',
        topic: '24/7 Dedicated Flight Desk',
        traditionalWay: 'Voicemails, disconnected ground handlers, and fragmented flight communications.',
        flyAylaWay: 'Continuous operational monitoring, VIP FBO coordination, and 24/7 direct flight director contact.'
      },
      {
        id: 'comp-4',
        topic: 'Secure Digital Payments',
        traditionalWay: 'Manual wire confirmation delays that hold up aircraft dispatch and clearance permits.',
        flyAylaWay: 'Automated invoice generation with instant multi-currency wire and card verification.'
      }
    ]
  },

  testimonials: {
    tag: 'CLIENT EXPERIENCES',
    title: 'TRUSTED BY DISCERNING TRAVELERS.',
    description: 'Read how leading family offices, sovereign delegations, corporate flight departments, and global executives rely on Fly Ayla for precision private aviation.',
    testimonials: [
      {
        id: 'test-1',
        quote: 'Fly Ayla delivered a Challenger 350 to Paris Le Bourget in under three hours when our scheduled flight was grounded. The transparency of the quote and direct cost breakdown was extraordinary.',
        authorName: 'T. Vandermeer',
        authorTitle: 'Family Office Principal',
        companyOrFleet: 'Geneva / London',
        initials: 'TV',
        rating: 5,
        active: true
      },
      {
        id: 'test-2',
        quote: 'Pricing multi-stop international flights used to take an entire day of back-and-forth broker negotiations. Fly Ayla calculates real Jet-A fuel burn, handling, and overflight costs instantly.',
        authorName: 'M. Al-Sabah',
        authorTitle: 'Executive Director',
        companyOrFleet: 'Gulf Executive Delegation',
        initials: 'MA',
        rating: 5,
        active: true
      },
      {
        id: 'test-3',
        quote: 'The level of service from tarmac greeting to onboard dining was flawless. No hidden broker markups or post-trip surprise invoices.',
        authorName: 'C. Kensington',
        authorTitle: 'Managing Partner',
        companyOrFleet: 'Private Equity Group',
        initials: 'CK',
        rating: 5,
        active: true
      },
      {
        id: 'test-4',
        quote: 'Managing emergency medical transports requires immediate response. Fly Ayla coordinated diplomatic overflight permits and ambulance apron access without a minute wasted.',
        authorName: 'Dr. H. Sterling',
        authorTitle: 'Chief Medical Coordinator',
        companyOrFleet: 'International Aeromedical Services',
        initials: 'HS',
        rating: 5,
        active: true
      },
      {
        id: 'test-5',
        quote: 'Our executive committee flew across Zurich, Dubai, and Singapore over five consecutive days. Every FBO transfer and catering requirement was executed to absolute perfection.',
        authorName: 'A. De la Tour',
        authorTitle: 'Head of Global Travel Operations',
        companyOrFleet: 'European Industrial Conglomerate',
        initials: 'AT',
        rating: 5,
        active: true
      },
      {
        id: 'test-6',
        quote: 'The JetFuelX dynamic pricing integration provides genuine cost clarity. We can review fuel burn metrics and landing fees before authorizing the flight dispatch.',
        authorName: 'R. Sterling-Hale',
        authorTitle: 'Director of Flight Assets',
        companyOrFleet: 'Sovereign Wealth Advisory',
        initials: 'RS',
        rating: 5,
        active: true
      },
      {
        id: 'test-7',
        quote: 'Fly Ayla has redefined how our sports agency books intercontinental charter for talent tours. Zero friction, instant dispatch confirmation, and impeccable aircraft standards.',
        authorName: 'E. Nakamura',
        authorTitle: 'Vice President of Operations',
        companyOrFleet: 'Global Athletic Management',
        initials: 'EN',
        rating: 5,
        active: true
      }
    ]
  },

  contact: {
    tag: 'GLOBAL FLIGHT DESK',
    title: 'CONTACT FLY AYLA FLIGHT OPERATIONS.',
    description: 'Our flight coordination and dispatch desk operates 24/7/365 to handle private flight requests, diplomatic clearances, and bespoke charter itineraries.',
    hqCity: 'Kuwait City (Headquarters)',
    hqAddress: 'Executive Aviation Terminal, Kuwait International Airport (OKKK / KWI)',
    hqPhone: '+965 2200 9000',
    opsCity: 'London Operations Desk',
    opsAddress: 'Signature Flight Support FBO, London Luton (EGGW / LTN)',
    opsPhone: '+44 20 7946 0999',
    generalEmail: 'ops@flyayla.aero',
    charterEmail: 'charter@flyayla.aero',
    whatsappSupport: '+965 9988 7766',
    officeHours: '24 Hours / 7 Days / 365 Days per Year'
  },

  ctaBanner: {
    tag: 'YOUR JOURNEY AWAITS',
    title: 'YOUR NEXT JOURNEY STARTS HERE.',
    description: 'Request a private flight and let Fly Ayla handle every detail from aircraft selection to tarmac departure.',
    buttonText: 'Request a Flight',
    buttonAction: 'flight-request',
    subtext: 'Instant flight calculation • 4,500+ global airports • 24/7 flight coordination'
  }
};

