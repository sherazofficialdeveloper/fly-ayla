/**
 * JetFuelX Aviation Fuel Pricing Integration Service
 * Provides real-time Jet-A fuel pricing via official JetFuelX API.
 * NEVER returns hardcoded, mock, or fabricated fuel prices.
 */

export interface JetFuelPriceResult {
  pricePerGallon: number | null;
  currency: string;
  unit: string;
  source: string;
  effectiveDate: string | null;
  isLive: boolean;
  status: 'CONNECTED' | 'NOT_CONFIGURED' | 'API_ERROR';
  lastUpdated: string;
  message: string;
  icao?: string;
  fboName?: string;
  vendor?: string;
}

export interface JetFuelDiagnosticsResult {
  isConfigured: boolean;
  endpoint: string;
  httpStatus?: number;
  latencyMs?: number;
  success: boolean;
  fuelPrice: number | null;
  source: string;
  message: string;
  timestamp: string;
}

export class JetFuelXService {
  private static cache: Map<string, { result: JetFuelPriceResult; timestamp: number }> = new Map();
  private static readonly CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache
  private static readonly REQUEST_TIMEOUT_MS = 8000; // 8 seconds timeout

  /**
   * Check if JetFuelX API credentials are configured in environment
   */
  static isConfigured(): boolean {
    const key = process.env.JETFUELX_API_KEY;
    return Boolean(key && key.trim().length > 0);
  }

  /**
   * Get configured API endpoint URL
   */
  static getApiEndpoint(): string {
    return (process.env.JETFUELX_API_URL || 'https://api.jetfuelx.com/v1/prices').trim();
  }

  /**
   * Clear in-memory pricing cache (used for testing or admin forced refresh)
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Fetch live Jet-A fuel pricing for an airport (or global index) via real HTTPS request.
   * If credentials are not configured or request fails, returns explicit status without inventing a price.
   */
  static async getFuelPrice(icao?: string): Promise<JetFuelPriceResult> {
    const cacheKey = (icao || 'GLOBAL').toUpperCase().trim();
    const now = Date.now();

    const cachedEntry = this.cache.get(cacheKey);
    if (cachedEntry && now - cachedEntry.timestamp < this.CACHE_TTL_MS) {
      return cachedEntry.result;
    }

    const apiKey = process.env.JETFUELX_API_KEY?.trim();

    // 1. Explicit unconfigured handling: strictly no fake or default fuel price
    if (!apiKey) {
      const unconfiguredResult: JetFuelPriceResult = {
        pricePerGallon: null,
        currency: 'USD',
        unit: 'US Gallon',
        source: 'JetFuelX API (Unconfigured)',
        effectiveDate: null,
        isLive: false,
        status: 'NOT_CONFIGURED',
        lastUpdated: new Date().toISOString(),
        message: 'JetFuelX API key required — live fuel price unavailable.',
        icao: cacheKey,
      };
      return unconfiguredResult;
    }

    // 2. Real HTTP Request to JetFuelX API
    const baseEndpoint = this.getApiEndpoint();
    const url = new URL(baseEndpoint);
    if (icao && icao !== 'GLOBAL') {
      url.searchParams.set('icao', icao.toUpperCase().trim());
    }
    url.searchParams.set('fuel_type', 'JET_A');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'x-api-key': apiKey,
          'Accept': 'application/json',
          'User-Agent': 'FlyAyla-AviationOps/1.0',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`[JetFuelX API Error] HTTP ${response.status} from ${baseEndpoint}: ${errorText.slice(0, 200)}`);
        
        const apiErrorResult: JetFuelPriceResult = {
          pricePerGallon: null,
          currency: 'USD',
          unit: 'US Gallon',
          source: 'JetFuelX API (Error)',
          effectiveDate: null,
          isLive: false,
          status: 'API_ERROR',
          lastUpdated: new Date().toISOString(),
          message: `JetFuelX API returned HTTP ${response.status}: ${response.statusText || 'Request failed'}. Live fuel price unavailable.`,
          icao: cacheKey,
        };
        return apiErrorResult;
      }

      const data: any = await response.json();
      const parsedPrice = this.extractPriceFromPayload(data);

      if (parsedPrice === null || isNaN(parsedPrice) || parsedPrice <= 0) {
        console.error('[JetFuelX API Warning] Could not parse a valid pricePerGallon from response payload:', JSON.stringify(data).slice(0, 200));
        return {
          pricePerGallon: null,
          currency: 'USD',
          unit: 'US Gallon',
          source: 'JetFuelX API (Invalid Payload)',
          effectiveDate: null,
          isLive: false,
          status: 'API_ERROR',
          lastUpdated: new Date().toISOString(),
          message: 'JetFuelX API returned a response, but no valid price field was found. Live fuel price unavailable.',
          icao: cacheKey,
        };
      }

      const fboName = data.fboName || data.fbo || data.prices?.[0]?.fbo || undefined;
      const vendor = data.vendor || data.prices?.[0]?.vendor || undefined;
      const effectiveDate = data.effectiveDate || data.effective_date || data.date || new Date().toISOString().split('T')[0];

      const liveResult: JetFuelPriceResult = {
        pricePerGallon: Number(parsedPrice.toFixed(2)),
        currency: data.currency || 'USD',
        unit: data.unit || 'US Gallon',
        source: fboName ? `JetFuelX Live Feed (${fboName})` : 'JetFuelX Live Feed',
        effectiveDate,
        isLive: true,
        status: 'CONNECTED',
        lastUpdated: new Date().toISOString(),
        message: `Live JetFuelX index feed operational for ${cacheKey}.`,
        icao: cacheKey,
        fboName,
        vendor,
      };

      this.cache.set(cacheKey, { result: liveResult, timestamp: now });
      return liveResult;
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isTimeout = err.name === 'AbortError' || err.message?.includes('aborted');
      const errorMessage = isTimeout
        ? `JetFuelX API request timed out after ${this.REQUEST_TIMEOUT_MS}ms`
        : `JetFuelX API connection failed: ${err.message || 'Network error'}`;

      console.error('[JetFuelX Service Error]:', errorMessage);

      return {
        pricePerGallon: null,
        currency: 'USD',
        unit: 'US Gallon',
        source: 'JetFuelX API (Connection Failed)',
        effectiveDate: null,
        isLive: false,
        status: 'API_ERROR',
        lastUpdated: new Date().toISOString(),
        message: errorMessage,
        icao: cacheKey,
      };
    }
  }

  /**
   * Helper to parse price from various standard JetFuelX and partner aviation API response schemas
   */
  private static extractPriceFromPayload(data: any): number | null {
    if (!data || typeof data !== 'object') return null;

    // Direct numerical fields
    if (typeof data.pricePerGallon === 'number') return data.pricePerGallon;
    if (typeof data.price_per_gallon === 'number') return data.price_per_gallon;
    if (typeof data.fuelPrice === 'number') return data.fuelPrice;
    if (typeof data.price === 'number') return data.price;
    if (typeof data.jetAPrice === 'number') return data.jetAPrice;
    if (typeof data.ratePerGallon === 'number') return data.ratePerGallon;

    // String numbers
    if (typeof data.pricePerGallon === 'string' && !isNaN(parseFloat(data.pricePerGallon))) return parseFloat(data.pricePerGallon);
    if (typeof data.price === 'string' && !isNaN(parseFloat(data.price))) return parseFloat(data.price);

    // Wrapped data object { data: { pricePerGallon: ... } }
    if (data.data && typeof data.data === 'object') {
      const nested = this.extractPriceFromPayload(data.data);
      if (nested !== null) return nested;
    }

    // Wrapped result object { result: { ... } }
    if (data.result && typeof data.result === 'object') {
      const nested = this.extractPriceFromPayload(data.result);
      if (nested !== null) return nested;
    }

    // Array of FBO prices: [ { pricePerGallon: ... } ]
    if (Array.isArray(data.prices) && data.prices.length > 0) {
      const first = data.prices[0];
      const nested = this.extractPriceFromPayload(first);
      if (nested !== null) return nested;
    }

    if (Array.isArray(data) && data.length > 0) {
      const first = data[0];
      const nested = this.extractPriceFromPayload(first);
      if (nested !== null) return nested;
    }

    return null;
  }

  /**
   * Live diagnostics probe: tests the real JetFuelX API endpoint and measures latency
   */
  static async testLiveConnection(icao?: string): Promise<JetFuelDiagnosticsResult> {
    const isConfig = this.isConfigured();
    const endpoint = this.getApiEndpoint();
    const startTime = Date.now();

    if (!isConfig) {
      return {
        isConfigured: false,
        endpoint,
        success: false,
        fuelPrice: null,
        source: 'JetFuelX API (Unconfigured)',
        message: 'JETFUELX_API_KEY environment variable is not configured in server secrets. Live API request cannot be executed.',
        timestamp: new Date().toISOString(),
      };
    }

    const fuelResult = await this.getFuelPrice(icao);
    const latencyMs = Date.now() - startTime;

    return {
      isConfigured: true,
      endpoint,
      latencyMs,
      success: fuelResult.isLive,
      fuelPrice: fuelResult.pricePerGallon,
      source: fuelResult.source,
      message: fuelResult.message,
      timestamp: new Date().toISOString(),
    };
  }
}

