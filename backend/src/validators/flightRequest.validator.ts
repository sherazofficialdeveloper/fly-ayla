export interface FlightLegValidationInput {
  departureIcao?: string;
  destinationIcao?: string;
  departureDate?: string;
  passengersCount?: number;
}

export function validateFlightRequest(body: any): { isValid: boolean; message?: string } {
  if (!body) {
    return { isValid: false, message: 'Request payload is required.' };
  }

  if (!body.legs || !Array.isArray(body.legs) || body.legs.length === 0) {
    return { isValid: false, message: 'Flight itinerary must include at least one valid departure and destination leg.' };
  }

  for (let i = 0; i < body.legs.length; i++) {
    const leg = body.legs[i];
    const dep = typeof leg.departure === 'string' ? leg.departure : (leg.departureIcao || leg.departure?.icao || leg.departureAirport);
    const dest = typeof leg.destination === 'string' ? leg.destination : (leg.destinationIcao || leg.destination?.icao || leg.destinationAirport || leg.arrivalAirport || leg.arrivalIcao || (typeof leg.arrival === 'string' ? leg.arrival : undefined));

    if (!dep || typeof dep !== 'string' || dep.trim().length < 3) {
      return { isValid: false, message: `Leg #${i + 1} is missing a valid departure airport ICAO code.` };
    }

    if (!dest || typeof dest !== 'string' || dest.trim().length < 3) {
      return { isValid: false, message: `Leg #${i + 1} is missing a valid destination airport ICAO code.` };
    }

    if (dep.trim().toUpperCase() === dest.trim().toUpperCase()) {
      return { isValid: false, message: `Leg #${i + 1} departure and destination airports cannot be identical.` };
    }
  }

  return { isValid: true };
}
