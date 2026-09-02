export type TripType = 'one-way' | 'round-trip' | 'multi-leg';

export type AircraftCategory = 
  | 'Ultra Long Range'
  | 'Heavy Jet'
  | 'Super Midsize'
  | 'Midsize'
  | 'Light Jet'
  | 'Turboprop';

export interface Airport {
  icao: string;
  iata: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
  handlingFeeBase: number;
  landingFeeRate: number;
  fuelPricePerGal: number;
  popularFbo: string;
}

export interface Aircraft {
  id: string;
  name: string;
  manufacturer: string;
  category: AircraftCategory;
  maxPassengers: number;
  maxRangeNm: number;
  cruiseSpeedKts: number;
  hourlyFuelBurnGal: number;
  dryLeaseMonthly: number;
  maintenanceReservePerHour: number;
  crewCostPerHour: number;
  cabinHeightFt: number;
  cabinWidthFt: number;
  baggageCuFt: number;
  description: string;
  image: string;
  features: string[];
  tailNumber?: string;
  status?: 'Available' | 'In Flight' | 'Maintenance' | 'Reserved';
}

export interface FlightLeg {
  id: string;
  departure: Airport;
  destination: Airport;
  departureDate: string;
  departureTime: string;
  passengers: number;
  distanceNm: number;
  blockHours: number;
  estimatedFlightTime: string;
}

export interface CostBreakdown {
  fuelCost: number | null;
  fuelGallons?: number;
  effectiveFuelPricePerGal?: number | null;
  fuelPriceSource?: string;
  isLiveFuelPrice?: boolean;
  fuelStatus?: 'CONNECTED' | 'NOT_CONFIGURED' | 'API_ERROR';
  fuelPricingStatus?: 'COMPLETE' | 'FUEL_PRICE_UNAVAILABLE';
  fuelPriceMessage?: string;
  handlingCost: number;
  navFees: number;
  operationalCrewCost: number;
  fixedCostAllocation: number;
  taxesAndAirportFees: number;
  subtotal: number;
  markupPercent: number;
  markupAmount: number;
  quotedTotal: number;
}

export type RequestStatus = 
  | 'Submitted' 
  | 'Processing' 
  | 'Quote Ready' 
  | 'Approved' 
  | 'Rejected' 
  | 'Booked' 
  | 'Cancelled';

export interface FlightRequest {
  id: string;
  requestNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  tripType: TripType;
  legs: FlightLeg[];
  aircraftCategory: AircraftCategory | 'Any';
  preferredAircraftId?: string;
  specialRequests?: string;
  cateringPreference?: string;
  groundTransport?: boolean;
  status: RequestStatus;
  createdAt: string;
  quoteId?: string;
}

export type QuoteStatus = 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Expired';

export interface Quote {
  id: string;
  quoteNumber: string;
  requestId: string;
  request: FlightRequest;
  aircraft: Aircraft;
  costBreakdown: CostBreakdown;
  terms: string[];
  validUntil: string;
  status: QuoteStatus;
  invoiceId?: string;
  createdAt: string;
}

export type InvoiceStatus = 'Pending' | 'Paid' | 'Processing' | 'Overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  quoteId: string;
  requestId: string;
  customerName: string;
  customerEmail: string;
  aircraftName: string;
  routeSummary: string;
  subtotal: number;
  taxes: number;
  total: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string;
}

export type BookingStatus = 'Confirmed' | 'Dispatched' | 'In-Flight' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  bookingReference: string;
  quoteId: string;
  invoiceId: string;
  customerName: string;
  customerEmail: string;
  routeSummary: string;
  departureDate: string;
  departureTime: string;
  aircraft: Aircraft;
  passengersCount: number;
  captainName: string;
  firstOfficerName: string;
  fboTerminal: string;
  cateringDetails: string;
  groundTransportNotes?: string;
  status: BookingStatus;
  pnr: string;
  createdAt: string;
}

export interface ForensicCase {
  id: string;
  caseNumber: string;
  transactionId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  paymentMethod: 'Wire Transfer' | 'Credit Card' | 'Crypto/USDC' | 'Escrow' | 'Swift MT103' | string;
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sanctionsCheck: 'PASSED' | 'FLAGGED' | 'REVIEW REQUIRED' | 'BLOCKED';
  amlStatus: 'CLEARED' | 'MONITORED' | 'ESCALATED' | 'BLOCKED';
  flags: string[];
  geoIpLocation: string;
  timestamp: string;
  notes: string;
  assignedAnalyst?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: 'Customer' | 'Ops Admin' | 'Forensic Officer' | 'System Engine';
  action: string;
  category: 'AUTH' | 'QUOTE' | 'INVOICE' | 'PAYMENT' | 'PRICING' | 'DISPATCH' | 'FORENSIC';
  recordRef: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
  ipAddress: string;
}

export interface NotificationItem {
  id: string;
  type: 'quote' | 'payment' | 'booking' | 'system' | 'risk';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTo?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: 'customer' | 'admin';
  avatar?: string;
  avatarUrl?: string;
  passportNumber?: string;
  nationality?: string;
  preferredAircraftCategory?: string;
  dietaryRestrictions?: string;
}

