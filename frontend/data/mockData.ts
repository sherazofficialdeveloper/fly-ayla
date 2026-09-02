import { 
  Airport, 
  Aircraft, 
  FlightRequest, 
  Quote, 
  Invoice, 
  Booking, 
  ForensicCase, 
  AuditLog, 
  NotificationItem, 
  UserProfile,
  CostBreakdown,
  FlightLeg
} from '../types/aviation';

export const GLOBAL_AIRPORTS: Airport[] = [
  {
    icao: 'OKKK',
    iata: 'KWI',
    name: 'Kuwait International Airport',
    city: 'Kuwait City',
    country: 'Kuwait',
    lat: 29.2268,
    lng: 47.9789,
    timezone: 'UTC+3',
    handlingFeeBase: 1850,
    landingFeeRate: 6.2,
    fuelPricePerGal: 0,
    popularFbo: 'Kuwait Aviation FBO Terminal'
  },
  {
    icao: 'UAAA',
    iata: 'ALA',
    name: 'Almaty International Airport',
    city: 'Almaty',
    country: 'Kazakhstan',
    lat: 43.3521,
    lng: 77.0405,
    timezone: 'UTC+5',
    handlingFeeBase: 2100,
    landingFeeRate: 5.8,
    fuelPricePerGal: 0,
    popularFbo: 'East Wing Executive Aviation'
  },
  {
    icao: 'LFBP',
    iata: 'PUF',
    name: 'Pau Pyrénées Airport',
    city: 'Pau / Pyrenees',
    country: 'France',
    lat: 43.3800,
    lng: -0.4186,
    timezone: 'UTC+1',
    handlingFeeBase: 2450,
    landingFeeRate: 7.4,
    fuelPricePerGal: 0,
    popularFbo: 'Pyrenees VIP Handling'
  },
  {
    icao: 'KTEB',
    iata: 'TEB',
    name: 'Teterboro Executive Airport',
    city: 'New York / NJ',
    country: 'United States',
    lat: 40.8501,
    lng: -74.0608,
    timezone: 'UTC-5',
    handlingFeeBase: 3200,
    landingFeeRate: 8.5,
    fuelPricePerGal: 0,
    popularFbo: 'Signature Flight Support South'
  },
  {
    icao: 'EGGW',
    iata: 'LTN',
    name: 'London Luton Airport',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.8747,
    lng: -0.3683,
    timezone: 'UTC+0',
    handlingFeeBase: 3100,
    landingFeeRate: 8.2,
    fuelPricePerGal: 0,
    popularFbo: 'Harrods Aviation Signature FBO'
  },
  {
    icao: 'OMDB',
    iata: 'DXB',
    name: 'Dubai International Airport / Al Maktoum',
    city: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.2532,
    lng: 55.3657,
    timezone: 'UTC+4',
    handlingFeeBase: 2800,
    landingFeeRate: 7.9,
    fuelPricePerGal: 0,
    popularFbo: 'ExecuJet Middle East VIP Lounge'
  },
  {
    icao: 'LSGG',
    iata: 'GVA',
    name: 'Geneva Cointrin Airport',
    city: 'Geneva',
    country: 'Switzerland',
    lat: 46.2381,
    lng: 6.1089,
    timezone: 'UTC+1',
    handlingFeeBase: 3400,
    landingFeeRate: 9.1,
    fuelPricePerGal: 0,
    popularFbo: 'TAG Aviation Geneva'
  },
  {
    icao: 'LFMN',
    iata: 'NCE',
    name: 'Nice Côte d’Azur Airport',
    city: 'Nice',
    country: 'France',
    lat: 43.6584,
    lng: 7.2159,
    timezone: 'UTC+1',
    handlingFeeBase: 3600,
    landingFeeRate: 9.4,
    fuelPricePerGal: 0,
    popularFbo: 'Swissport Executive Aviation Nice'
  },
  {
    icao: 'LFPB',
    iata: 'LBG',
    name: 'Paris Le Bourget Airport',
    city: 'Paris',
    country: 'France',
    lat: 48.9694,
    lng: 2.4414,
    timezone: 'UTC+1',
    handlingFeeBase: 3300,
    landingFeeRate: 8.8,
    fuelPricePerGal: 0,
    popularFbo: 'Dassault Falcon Service FBO'
  },
  {
    icao: 'KLAX',
    iata: 'LAX',
    name: 'Los Angeles International / Van Nuys (KVNY)',
    city: 'Los Angeles',
    country: 'United States',
    lat: 34.2098,
    lng: -118.4899,
    timezone: 'UTC-8',
    handlingFeeBase: 2900,
    landingFeeRate: 7.8,
    fuelPricePerGal: 0,
    popularFbo: 'Castle & Cooke Aviation Van Nuys'
  },
  {
    icao: 'VHHH',
    iata: 'HKG',
    name: 'Hong Kong International Airport',
    city: 'Hong Kong',
    country: 'Hong Kong SAR',
    lat: 22.3080,
    lng: 113.9185,
    timezone: 'UTC+8',
    handlingFeeBase: 3800,
    landingFeeRate: 9.5,
    fuelPricePerGal: 0,
    popularFbo: 'Hong Kong Business Aviation Centre (HKBAC)'
  },
  {
    icao: 'WSSS',
    iata: 'SIN',
    name: 'Singapore Changi / Seletar (WSSL)',
    city: 'Singapore',
    country: 'Singapore',
    lat: 1.4169,
    lng: 103.8679,
    timezone: 'UTC+8',
    handlingFeeBase: 3200,
    landingFeeRate: 8.0,
    fuelPricePerGal: 0,
    popularFbo: 'Universal Aviation Singapore'
  },
  {
    icao: 'RJTT',
    iata: 'HND',
    name: 'Tokyo Haneda International Airport',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.5494,
    lng: 139.7798,
    timezone: 'UTC+9',
    handlingFeeBase: 4100,
    landingFeeRate: 9.8,
    fuelPricePerGal: 0,
    popularFbo: 'Haneda Universal Business Lounge'
  },
  {
    icao: 'OERK',
    iata: 'RUH',
    name: 'King Khalid International Airport',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    lat: 24.9576,
    lng: 46.6988,
    timezone: 'UTC+3',
    handlingFeeBase: 2600,
    landingFeeRate: 6.9,
    fuelPricePerGal: 0,
    popularFbo: 'Saudia Private Aviation (SPA)'
  },
  {
    icao: 'LEMD',
    iata: 'MAD',
    name: 'Adolfo Suárez Madrid–Barajas Airport',
    city: 'Madrid',
    country: 'Spain',
    lat: 40.4839,
    lng: -3.5680,
    timezone: 'UTC+1',
    handlingFeeBase: 2500,
    landingFeeRate: 7.2,
    fuelPricePerGal: 0,
    popularFbo: 'Sky Valet Madrid'
  },
  {
    icao: 'EDDM',
    iata: 'MUC',
    name: 'Munich Airport',
    city: 'Munich',
    country: 'Germany',
    lat: 48.3537,
    lng: 11.7750,
    timezone: 'UTC+1',
    handlingFeeBase: 2900,
    landingFeeRate: 8.6,
    fuelPricePerGal: 0,
    popularFbo: 'Munich General Aviation Terminal'
  }
];

export const FLEET_AIRCRAFT: Aircraft[] = [
  {
    id: 'ac-global-7500',
    name: 'Bombardier Global 7500',
    manufacturer: 'Bombardier',
    category: 'Ultra Long Range',
    maxPassengers: 14,
    maxRangeNm: 7700,
    cruiseSpeedKts: 516,
    hourlyFuelBurnGal: 480,
    dryLeaseMonthly: 28500,
    maintenanceReservePerHour: 420,
    crewCostPerHour: 650,
    cabinHeightFt: 6.2,
    cabinWidthFt: 8.0,
    baggageCuFt: 195,
    description: 'The industry flagship. Featuring four true living spaces, a dedicated master suite with permanent bed, and ultra-high-speed Ka-band connectivity.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    features: ['Master Suite Bed', 'Nuage Ergonomic Seats', 'Four Living Zones', 'Full Galley Kitchen', 'Ka-Band WiFi', 'Stand-up Shower'],
    tailNumber: '9H-AYLA1',
    status: 'Available'
  },
  {
    id: 'ac-g650er',
    name: 'Gulfstream G650ER',
    manufacturer: 'Gulfstream Aerospace',
    category: 'Ultra Long Range',
    maxPassengers: 16,
    maxRangeNm: 7500,
    cruiseSpeedKts: 516,
    hourlyFuelBurnGal: 470,
    dryLeaseMonthly: 27000,
    maintenanceReservePerHour: 390,
    crewCostPerHour: 620,
    cabinHeightFt: 6.4,
    cabinWidthFt: 8.5,
    baggageCuFt: 195,
    description: 'World-renowned performance and speed. Iconic panoramic oval windows, whisper-quiet cabin altitude of 3,290 feet, and intercontinental range.',
    image: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=1200&q=80',
    features: ['16 Panoramic Oval Windows', 'Ultra-Low Cabin Altitude', 'Convertible Divan Beds', 'HD Entertainment Suite', 'High-Speed Satellite Data'],
    tailNumber: 'N650AY',
    status: 'Available'
  },
  {
    id: 'ac-falcon-8x',
    name: 'Dassault Falcon 8X',
    manufacturer: 'Dassault Aviation',
    category: 'Heavy Jet',
    maxPassengers: 12,
    maxRangeNm: 6450,
    cruiseSpeedKts: 470,
    hourlyFuelBurnGal: 380,
    dryLeaseMonthly: 21500,
    maintenanceReservePerHour: 340,
    crewCostPerHour: 550,
    cabinHeightFt: 6.2,
    cabinWidthFt: 7.7,
    baggageCuFt: 140,
    description: 'Trijet reliability and unrivaled short-field performance. Access challenging airports like London City or Aspen effortlessly with supreme cabin comfort.',
    image: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?auto=format&fit=crop&w=1200&q=80',
    features: ['Trijet Safety Margin', 'Short-Runway Access', 'Acoustic Soundproofing', 'Custom Dining Table', 'Direct Airfield Approvals'],
    tailNumber: 'F-HAYL',
    status: 'Available'
  },
  {
    id: 'ac-citation-lat',
    name: 'Cessna Citation Latitude',
    manufacturer: 'Textron Aviation',
    category: 'Super Midsize',
    maxPassengers: 9,
    maxRangeNm: 2700,
    cruiseSpeedKts: 446,
    hourlyFuelBurnGal: 240,
    dryLeaseMonthly: 14200,
    maintenanceReservePerHour: 240,
    crewCostPerHour: 420,
    cabinHeightFt: 6.0,
    cabinWidthFt: 6.4,
    baggageCuFt: 127,
    description: 'The best-selling midsize category business jet. Flat-floor stand-up cabin with spacious legroom, low operating burn, and class-leading baggage space.',
    image: 'https://images.unsplash.com/photo-1519074069444-1ba4fff16def?auto=format&fit=crop&w=1200&q=80',
    features: ['Flat Floor Standup Cabin', 'Wireless Cabin Management', 'Class-Leading Luggage Space', 'Executive Club Seating', 'Clarity Audio'],
    tailNumber: 'LX-AYL9',
    status: 'Available'
  },
  {
    id: 'ac-phenom-300e',
    name: 'Embraer Phenom 300E',
    manufacturer: 'Embraer',
    category: 'Light Jet',
    maxPassengers: 7,
    maxRangeNm: 2010,
    cruiseSpeedKts: 464,
    hourlyFuelBurnGal: 175,
    dryLeaseMonthly: 9800,
    maintenanceReservePerHour: 180,
    crewCostPerHour: 340,
    cabinHeightFt: 4.9,
    cabinWidthFt: 5.1,
    baggageCuFt: 84,
    description: 'The world’s best-selling light jet for 12 consecutive years. Unmatched speed, best-in-class cabin altitude, and sleek Bossa Nova interior styling.',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    features: ['Single-Pilot Capable', 'Bossa Nova Interior', 'Enclosed Belted Lavatory', 'Prodigy Touch Flight Deck', 'Generous Wardrobe Space'],
    tailNumber: 'D-CAYL',
    status: 'Available'
  }
];

// Calculation utility: Great-Circle Distance (Haversine in Nautical Miles)
export function calculateDistanceNm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3440.065; // Earth radius in nautical miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Format duration helper
export function formatBlockHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h} h ${m.toString().padStart(2, '0')} min`;
}

// Real cost calculation engine
export function calculateFlightCost(
  legs: { departure: Airport; destination: Airport; passengers: number }[],
  aircraft: Aircraft,
  markupPercentage = 15
): {
  legsCalculated: FlightLeg[];
  totalDistanceNm: number;
  totalBlockHours: number;
  breakdown: CostBreakdown;
} {
  let totalDistanceNm = 0;
  let totalBlockHours = 0;
  let totalFuelCost = 0;
  let totalHandling = 0;
  let totalNavFees = 0;
  let totalOperationalCrew = 0;
  let totalAirportTaxes = 0;

  const legsCalculated: FlightLeg[] = legs.map((leg, index) => {
    const dist = calculateDistanceNm(
      leg.departure.lat,
      leg.departure.lng,
      leg.destination.lat,
      leg.destination.lng
    );
    // Block hours = flight time (distance / cruise speed) + 0.5h for taxi/climb/airway vectoring
    const flightHours = dist / aircraft.cruiseSpeedKts;
    const blockHours = Math.max(1.0, Number((flightHours + 0.45).toFixed(2)));
    
    totalDistanceNm += dist;
    totalBlockHours += blockHours;

    // Fuel cost: only calculated if an authoritative fuel price > 0 is provided (never use fake defaults)
    const avgFuelPrice = ((leg.departure.fuelPricePerGal || 0) + (leg.destination.fuelPricePerGal || 0)) / 2;
    const legFuelCost = avgFuelPrice > 0 ? blockHours * aircraft.hourlyFuelBurnGal * avgFuelPrice : null;
    if (legFuelCost !== null) {
      totalFuelCost += legFuelCost;
    }

    // Handling cost for both endpoints
    const handling = leg.departure.handlingFeeBase + leg.destination.handlingFeeBase;
    totalHandling += handling;

    // Navigation & FIR overflight fees (~$1.85 per nautical mile)
    const navFee = dist * 1.95;
    totalNavFees += navFee;

    // Crew hourly per-diem + flight pay
    const crewCost = blockHours * aircraft.crewCostPerHour + 1200; // base overnight allowance
    totalOperationalCrew += crewCost;

    // Landing & airport security taxes
    const airportTaxes = (leg.departure.landingFeeRate + leg.destination.landingFeeRate) * 120;
    totalAirportTaxes += airportTaxes;

    return {
      id: `leg-${index + 1}`,
      departure: leg.departure,
      destination: leg.destination,
      departureDate: new Date(Date.now() + (index + 1) * 86400000).toISOString().split('T')[0],
      departureTime: index === 0 ? '10:53' : index === 1 ? '19:04' : '14:00',
      passengers: leg.passengers,
      distanceNm: dist,
      blockHours: blockHours,
      estimatedFlightTime: formatBlockHours(blockHours)
    };
  });

  // Fixed Cost Allocation (Lease, Hull Insurance, Maintenance Reserves amortized per trip)
  const maintenanceReserve = totalBlockHours * aircraft.maintenanceReservePerHour;
  const leaseShare = (aircraft.dryLeaseMonthly / 45) * totalBlockHours; // based on 45 monthly charter hours
  const fixedCostAllocation = Math.round(maintenanceReserve + leaseShare + 4500);

  const directSubtotal = Math.round(
    totalFuelCost + totalHandling + totalNavFees + totalOperationalCrew + totalAirportTaxes
  );

  const combinedOperationalSubtotal = directSubtotal + fixedCostAllocation;
  const markupAmount = Math.round(combinedOperationalSubtotal * (markupPercentage / 100));
  const quotedTotal = combinedOperationalSubtotal + markupAmount;
  const hasFuelPrice = totalFuelCost > 0;

  const breakdown: CostBreakdown = {
    fuelCost: hasFuelPrice ? Math.round(totalFuelCost) : null,
    fuelGallons: Math.round(totalBlockHours * aircraft.hourlyFuelBurnGal),
    effectiveFuelPricePerGal: null,
    fuelPriceSource: 'JetFuelX API (Unconfigured)',
    isLiveFuelPrice: false,
    fuelStatus: 'NOT_CONFIGURED',
    fuelPricingStatus: hasFuelPrice ? 'COMPLETE' : 'FUEL_PRICE_UNAVAILABLE',
    fuelPriceMessage: 'JetFuelX API key required — live fuel price unavailable.',
    handlingCost: Math.round(totalHandling),
    navFees: Math.round(totalNavFees),
    operationalCrewCost: Math.round(totalOperationalCrew),
    fixedCostAllocation: fixedCostAllocation,
    taxesAndAirportFees: Math.round(totalAirportTaxes),
    subtotal: combinedOperationalSubtotal,
    markupPercent: markupPercentage,
    markupAmount: markupAmount,
    quotedTotal: quotedTotal
  };

  return {
    legsCalculated,
    totalDistanceNm,
    totalBlockHours: Number(totalBlockHours.toFixed(1)),
    breakdown
  };
}

// Initial Seed Data matching the screenshot (OKKK -> UAAA -> LFBP)
const kuwait = GLOBAL_AIRPORTS[0]; // OKKK
const almaty = GLOBAL_AIRPORTS[1]; // UAAA
const pau = GLOBAL_AIRPORTS[2];    // LFBP
const defaultGlobal7500 = FLEET_AIRCRAFT[0];

export const SEED_FLIGHT_REQUESTS: FlightRequest[] = [
  {
    id: 'req-ayla-901',
    requestNumber: 'AYLA-RQ-2026-901',
    customerName: 'Prince Khalid Al-Sabah',
    customerEmail: 'khalid.sabah@investment-holdings.kw',
    customerPhone: '+965 9988 7766',
    customerCompany: 'Al-Sabah Global Capital',
    tripType: 'multi-leg',
    legs: [
      {
        id: 'leg-1',
        departure: kuwait,
        destination: almaty,
        departureDate: '2026-09-02',
        departureTime: '10:53',
        passengers: 8,
        distanceNm: 1840,
        blockHours: 5.18,
        estimatedFlightTime: '5 h 11 min'
      },
      {
        id: 'leg-2',
        departure: almaty,
        destination: pau,
        departureDate: '2026-09-03',
        departureTime: '19:04',
        passengers: 6,
        distanceNm: 3620,
        blockHours: 8.61,
        estimatedFlightTime: '8 h 37 min'
      }
    ],
    aircraftCategory: 'Ultra Long Range',
    preferredAircraftId: defaultGlobal7500.id,
    specialRequests: 'Halal fine dining, Beluga caviar on leg 2, Mercedes-Maybach ramp tarmac transfer at LFBP.',
    cateringPreference: 'Michelin Star Gourmet & Arabic Coffee Service',
    groundTransport: true,
    status: 'Quote Ready',
    createdAt: '2026-08-26T14:20:00Z',
    quoteId: 'quote-ayla-901'
  },
  {
    id: 'req-ayla-902',
    requestNumber: 'AYLA-RQ-2026-902',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@geneva-wealth.ch',
    customerPhone: '+41 79 123 4567',
    customerCompany: 'Rostova Family Office',
    tripType: 'one-way',
    legs: [
      {
        id: 'leg-3',
        departure: GLOBAL_AIRPORTS[6], // Geneva LSGG
        destination: GLOBAL_AIRPORTS[7], // Nice LFMN
        departureDate: '2026-09-05',
        departureTime: '11:00',
        passengers: 4,
        distanceNm: 170,
        blockHours: 1.1,
        estimatedFlightTime: '1 h 05 min'
      }
    ],
    aircraftCategory: 'Light Jet',
    preferredAircraftId: 'ac-phenom-300e',
    specialRequests: 'Dom Pérignon 2012, pet dog in cabin with VIP bedding.',
    cateringPreference: 'Organic Alpine Cheese & Vintage Champagne',
    groundTransport: true,
    status: 'Approved',
    createdAt: '2026-08-26T18:45:00Z',
    quoteId: 'quote-ayla-902'
  },
  {
    id: 'req-ayla-903',
    requestNumber: 'AYLA-RQ-2026-903',
    customerName: 'Marcus Sterling',
    customerEmail: 'm.sterling@apex-partners.co.uk',
    customerPhone: '+44 20 7946 0912',
    customerCompany: 'Apex Global Equity',
    tripType: 'round-trip',
    legs: [
      {
        id: 'leg-4',
        departure: GLOBAL_AIRPORTS[4], // London Luton EGGW
        destination: GLOBAL_AIRPORTS[3], // Teterboro KTEB
        departureDate: '2026-09-10',
        departureTime: '08:30',
        passengers: 6,
        distanceNm: 3010,
        blockHours: 7.2,
        estimatedFlightTime: '7 h 12 min'
      }
    ],
    aircraftCategory: 'Ultra Long Range',
    preferredAircraftId: 'ac-g650er',
    specialRequests: 'Boardroom conference setup, high-speed Ka-Band satellite link for live earnings call.',
    cateringPreference: 'Executive Breakfast & High Tea',
    groundTransport: false,
    status: 'Booked',
    createdAt: '2026-08-25T09:15:00Z',
    quoteId: 'quote-ayla-903'
  }
];

export const SEED_QUOTES: Quote[] = [
  {
    id: 'quote-ayla-901',
    quoteNumber: 'AYLA-QT-2026-901',
    requestId: 'req-ayla-901',
    request: SEED_FLIGHT_REQUESTS[0],
    aircraft: defaultGlobal7500,
    costBreakdown: {
      fuelCost: 26480,
      handlingCost: 8950,
      navFees: 5858,
      operationalCrewCost: 5600,
      fixedCostAllocation: 12940,
      taxesAndAirportFees: 3200,
      subtotal: 48920,
      markupPercent: 12,
      markupAmount: 5300,
      quotedTotal: 54220
    },
    terms: [
      'Quote valid for 72 hours from issuance date.',
      'Pricing includes VIP handling, standard luxury catering, overflight permits, and fuel surcharges.',
      'Subject to aircraft availability, crew duty limits, and slot confirmations.',
      'De-icing, war-risk insurance surcharges, and special customs fees will be billed at cost if incurred.'
    ],
    validUntil: '2026-09-01T23:59:59Z',
    status: 'Sent',
    invoiceId: 'inv-ayla-901',
    createdAt: '2026-08-26T15:00:00Z'
  },
  {
    id: 'quote-ayla-902',
    quoteNumber: 'AYLA-QT-2026-902',
    requestId: 'req-ayla-902',
    request: SEED_FLIGHT_REQUESTS[1],
    aircraft: FLEET_AIRCRAFT[4], // Phenom 300E
    costBreakdown: {
      fuelCost: 1650,
      handlingCost: 7000,
      navFees: 620,
      operationalCrewCost: 1400,
      fixedCostAllocation: 2800,
      taxesAndAirportFees: 950,
      subtotal: 14420,
      markupPercent: 15,
      markupAmount: 2160,
      quotedTotal: 16580
    },
    terms: [
      'Instant guaranteed departure within 2 hours of payment.',
      'Includes Swiss and French luxury FBO VIP passenger lounge access.',
      '100% refund up to 24 hours prior to departure.'
    ],
    validUntil: '2026-09-04T12:00:00Z',
    status: 'Approved',
    invoiceId: 'inv-ayla-902',
    createdAt: '2026-08-26T19:00:00Z'
  },
  {
    id: 'quote-ayla-903',
    quoteNumber: 'AYLA-QT-2026-903',
    requestId: 'req-ayla-903',
    request: SEED_FLIGHT_REQUESTS[2],
    aircraft: FLEET_AIRCRAFT[1], // G650ER
    costBreakdown: {
      fuelCost: 48500,
      handlingCost: 6300,
      navFees: 8200,
      operationalCrewCost: 9800,
      fixedCostAllocation: 22400,
      taxesAndAirportFees: 4600,
      subtotal: 99800,
      markupPercent: 14,
      markupAmount: 13980,
      quotedTotal: 113780
    },
    terms: [
      'Transatlantic corporate charter agreement governed by English Law.',
      'High-speed Ka-band satellite streaming and video conference included.'
    ],
    validUntil: '2026-09-08T18:00:00Z',
    status: 'Approved',
    invoiceId: 'inv-ayla-903',
    createdAt: '2026-08-25T11:00:00Z'
  }
];

export const SEED_INVOICES: Invoice[] = [
  {
    id: 'inv-ayla-901',
    invoiceNumber: 'INV-2026-0901',
    quoteId: 'quote-ayla-901',
    requestId: 'req-ayla-901',
    customerName: 'Prince Khalid Al-Sabah',
    customerEmail: 'khalid.sabah@investment-holdings.kw',
    aircraftName: 'Bombardier Global 7500 (9H-AYLA1)',
    routeSummary: 'OKKK (Kuwait) ➔ UAAA (Almaty) ➔ LFBP (Pau)',
    subtotal: 48920,
    taxes: 5300,
    total: 54220,
    issueDate: '2026-08-26',
    dueDate: '2026-08-30',
    status: 'Pending'
  },
  {
    id: 'inv-ayla-902',
    invoiceNumber: 'INV-2026-0902',
    quoteId: 'quote-ayla-902',
    requestId: 'req-ayla-902',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@geneva-wealth.ch',
    aircraftName: 'Embraer Phenom 300E (D-CAYL)',
    routeSummary: 'LSGG (Geneva) ➔ LFMN (Nice)',
    subtotal: 14420,
    taxes: 2160,
    total: 16580,
    issueDate: '2026-08-26',
    dueDate: '2026-09-03',
    status: 'Paid',
    paymentMethod: 'Bank Wire / Swift MT103',
    transactionId: 'TX-SWIFT-8829471',
    paidAt: '2026-08-26T20:12:00Z'
  },
  {
    id: 'inv-ayla-903',
    invoiceNumber: 'INV-2026-0903',
    quoteId: 'quote-ayla-903',
    requestId: 'req-ayla-903',
    customerName: 'Marcus Sterling',
    customerEmail: 'm.sterling@apex-partners.co.uk',
    aircraftName: 'Gulfstream G650ER (N650AY)',
    routeSummary: 'EGGW (London Luton) ➔ KTEB (New York Teterboro)',
    subtotal: 99800,
    taxes: 13980,
    total: 113780,
    issueDate: '2026-08-25',
    dueDate: '2026-09-02',
    status: 'Paid',
    paymentMethod: 'Corporate Escrow USDC',
    transactionId: 'TX-USDC-0x7F9a998...',
    paidAt: '2026-08-25T14:30:00Z'
  }
];

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'book-ayla-902',
    bookingReference: 'AYLA-BK-7702',
    quoteId: 'quote-ayla-902',
    invoiceId: 'inv-ayla-902',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@geneva-wealth.ch',
    routeSummary: 'LSGG (Geneva) ➔ LFMN (Nice Côte d’Azur)',
    departureDate: '2026-09-05',
    departureTime: '11:00 CEST',
    aircraft: FLEET_AIRCRAFT[4],
    passengersCount: 4,
    captainName: 'Capt. Jean-Luc Moreau',
    firstOfficerName: 'FO Claire Bennet',
    fboTerminal: 'TAG Aviation Executive Terminal Geneva (Gate 3)',
    cateringDetails: 'VIP Alpine Platter, Dom Pérignon 2012, Luxury Pet Hamper',
    groundTransportNotes: 'Mercedes S-Class VIP Chauffeur on tarmac at Nice',
    status: 'Confirmed',
    pnr: 'AY7702GVA',
    createdAt: '2026-08-26T20:15:00Z'
  },
  {
    id: 'book-ayla-903',
    bookingReference: 'AYLA-BK-8840',
    quoteId: 'quote-ayla-903',
    invoiceId: 'inv-ayla-903',
    customerName: 'Marcus Sterling',
    customerEmail: 'm.sterling@apex-partners.co.uk',
    routeSummary: 'EGGW (London Luton) ➔ KTEB (New York Teterboro)',
    departureDate: '2026-09-10',
    departureTime: '08:30 BST',
    aircraft: FLEET_AIRCRAFT[1],
    passengersCount: 6,
    captainName: 'Capt. Jonathan Hayes',
    firstOfficerName: 'FO David Vance',
    fboTerminal: 'Harrods Aviation Signature FBO Luton',
    cateringDetails: 'Michelin Executive Breakfast & High Tea, Ka-Band Satellite Link',
    groundTransportNotes: 'Cadillac Escalade ESV tarmac pickup at Teterboro FBO',
    status: 'Dispatched',
    pnr: 'AY8840LTN',
    createdAt: '2026-08-25T14:35:00Z'
  }
];

export const SEED_FORENSIC_CASES: ForensicCase[] = [
  {
    id: 'fcase-101',
    caseNumber: 'PF-2026-8812',
    transactionId: 'TX-SWIFT-8829471',
    invoiceNumber: 'INV-2026-0902',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@geneva-wealth.ch',
    amount: 16580,
    currency: 'USD',
    paymentMethod: 'Wire Transfer',
    riskScore: 8,
    riskLevel: 'LOW',
    sanctionsCheck: 'PASSED',
    amlStatus: 'CLEARED',
    flags: ['Known Corporate Account', 'Verified Swiss IBAN', 'Zero Sanctions Hits'],
    geoIpLocation: 'Geneva, Switzerland (Verified ASN)',
    timestamp: '2026-08-26T20:12:00Z',
    notes: 'Standard private client transaction. Source of funds verified via Swiss private bank clearance.',
    assignedAnalyst: 'A. Chen (Compliance Lead)'
  },
  {
    id: 'fcase-102',
    caseNumber: 'PF-2026-8813',
    transactionId: 'TX-USDC-0x7F9a998...',
    invoiceNumber: 'INV-2026-0903',
    customerName: 'Marcus Sterling',
    customerEmail: 'm.sterling@apex-partners.co.uk',
    amount: 113780,
    currency: 'USD',
    paymentMethod: 'Crypto/USDC',
    riskScore: 14,
    riskLevel: 'LOW',
    sanctionsCheck: 'PASSED',
    amlStatus: 'CLEARED',
    flags: ['Clean Wallet Address Origin', 'KYB Tier 3 Corporate Clear', 'Elliptic Forensics Score 99/100'],
    geoIpLocation: 'London, United Kingdom',
    timestamp: '2026-08-25T14:30:00Z',
    notes: 'Escrow smart contract settled within 2 blocks. Transaction hash recorded on immutable ledger.',
    assignedAnalyst: 'M. Al-Thani (Risk Officer)'
  },
  {
    id: 'fcase-103',
    caseNumber: 'PF-2026-8814',
    transactionId: 'TX-CARD-991823-PENDING',
    invoiceNumber: 'INV-2026-0901',
    customerName: 'Prince Khalid Al-Sabah',
    customerEmail: 'khalid.sabah@investment-holdings.kw',
    amount: 54220,
    currency: 'USD',
    paymentMethod: 'Wire Transfer',
    riskScore: 12,
    riskLevel: 'LOW',
    sanctionsCheck: 'PASSED',
    amlStatus: 'MONITORED',
    flags: ['High Value Charter (> $50,000)', 'PEP Check Passed', 'Awaiting Incoming SWIFT Swift MT103 Ack'],
    geoIpLocation: 'Kuwait City, Kuwait',
    timestamp: '2026-08-26T15:05:00Z',
    notes: 'Multi-leg flight quote generated. Live monitoring armed for incoming Fedwire/SWIFT settlement.',
    assignedAnalyst: 'A. Chen (Compliance Lead)'
  },
  {
    id: 'fcase-104',
    caseNumber: 'PF-2026-8809',
    transactionId: 'TX-CARD-448190-FLAGGED',
    invoiceNumber: 'INV-2026-0888',
    customerName: 'Anonymous Charter LLC (Proxy)',
    customerEmail: 'flightbooker99@tempmail.io',
    amount: 42000,
    currency: 'USD',
    paymentMethod: 'Credit Card',
    riskScore: 89,
    riskLevel: 'CRITICAL',
    sanctionsCheck: 'REVIEW REQUIRED',
    amlStatus: 'BLOCKED',
    flags: ['Proxy IP / Tor Node Detected', 'Disposable Email Domain', 'Velocity Anomaly (>3 Attempts in 10 min)', 'Billing ZIP Mismatch'],
    geoIpLocation: 'Anonymous VPN Gateway (Seychelles)',
    timestamp: '2026-08-24T19:40:00Z',
    notes: 'Blocked automatically by PAYLA FORENSIC AI Shield. Charter request frozen and flagged for AML escalation.',
    assignedAnalyst: 'PAYLA AI Sentinel'
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-08-26 20:15:22',
    user: 'Capt. Moreau / Dispatch',
    role: 'Ops Admin',
    action: 'Booking AYLA-BK-7702 confirmed & slot scheduled at LFMN',
    category: 'DISPATCH',
    recordRef: 'AYLA-BK-7702',
    status: 'SUCCESS',
    ipAddress: '194.230.14.88'
  },
  {
    id: 'log-102',
    timestamp: '2026-08-26 20:12:05',
    user: 'PAYLA FORENSIC Sentinel',
    role: 'Forensic Officer',
    action: 'Verified SWIFT MT103 clearance for $16,580. Risk score: 8/100',
    category: 'FORENSIC',
    recordRef: 'INV-2026-0902',
    status: 'SUCCESS',
    ipAddress: '10.240.0.12'
  },
  {
    id: 'log-103',
    timestamp: '2026-08-26 15:00:14',
    user: 'Flight Ops Engine',
    role: 'System Engine',
    action: 'Generated live operational cost breakdown for OKKK ➔ UAAA ➔ LFBP ($54,220)',
    category: 'QUOTE',
    recordRef: 'AYLA-QT-2026-901',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1'
  },
  {
    id: 'log-104',
    timestamp: '2026-08-25 14:31:00',
    user: 'Finance Desk Admin',
    role: 'Ops Admin',
    action: 'Issued receipt for $113,780 transatlantic G650ER booking',
    category: 'INVOICE',
    recordRef: 'INV-2026-0903',
    status: 'SUCCESS',
    ipAddress: '82.165.197.1'
  },
  {
    id: 'log-105',
    timestamp: '2026-08-24 19:40:12',
    user: 'PAYLA FORENSIC Sentinel',
    role: 'Forensic Officer',
    action: 'BLOCKED unauthorized proxy card transaction attempt ($42,000)',
    category: 'FORENSIC',
    recordRef: 'PF-2026-8809',
    status: 'ALERT',
    ipAddress: '185.220.101.5'
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'quote',
    title: 'Quote Ready for Review',
    message: 'Your multi-leg quote AYLA-QT-2026-901 (Kuwait ➔ Almaty ➔ Pau) is ready ($54,220).',
    timestamp: '10 min ago',
    read: false,
    linkTo: 'quote-ayla-901'
  },
  {
    id: 'notif-2',
    type: 'payment',
    title: 'Payment Received',
    message: 'Wire payment of $16,580 for Geneva ➔ Nice was cleared by PAYLA FORENSIC.',
    timestamp: '1 hour ago',
    read: false,
    linkTo: 'inv-ayla-902'
  },
  {
    id: 'notif-3',
    type: 'booking',
    title: 'Flight Briefing Dispatched',
    message: 'Captain Jean-Luc Moreau has been assigned to flight AYLA-BK-7702.',
    timestamp: '3 hours ago',
    read: true,
    linkTo: 'book-ayla-902'
  },
  {
    id: 'notif-4',
    type: 'risk',
    title: 'PAYLA FORENSIC Alert',
    message: 'Critical risk transaction blocked automatically on public terminal.',
    timestamp: '1 day ago',
    read: true
  }
];

export const CURRENT_USER: UserProfile = {
  id: 'usr-vip-001',
  name: 'Prince Khalid Al-Sabah',
  email: 'khalid.sabah@investment-holdings.kw',
  phone: '+965 9988 7766',
  company: 'Al-Sabah Global Capital',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  passportNumber: 'KW8891024X',
  nationality: 'Kuwaiti',
  preferredAircraftCategory: 'Ultra Long Range',
  dietaryRestrictions: 'Halal Gourmet, Fresh Juices, No Shellfish'
};

export const ADMIN_USER: UserProfile = {
  id: 'usr-admin-001',
  name: 'Capt. Tariq Vance',
  email: 'tariq.vance@flyayla.aero',
  phone: '+44 7700 900888',
  company: 'FLY AYLA Flight Operations & Cost Intelligence',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
};
