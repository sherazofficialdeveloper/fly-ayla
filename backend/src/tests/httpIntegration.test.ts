import http from 'http';
import crypto from 'crypto';
import { createApp } from '../app';
import { TokenService } from '../services/token.service';
import { connectDatabase, isMongoConnected } from '../config/database';

interface TestResult {
  endpoint: string;
  method: string;
  expectedStatus: number;
  actualStatus: number;
  passed: boolean;
  notes?: string;
}

async function runHttpIntegrationSuite() {
  console.log('================================================================');
  console.log('🌐 FLY AYLA REAL HTTP INTEGRATION & WORKFLOW VALIDATION PASS');
  console.log('================================================================\n');

  // Attempt database connection
  await connectDatabase();
  const dbStatus = isMongoConnected() ? 'CONNECTED' : 'DISCONNECTED (fallback / memory guard active)';
  console.log(`[Database Status]: ${dbStatus}\n`);

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;
  console.log(`[Test Server]: Running at ${baseUrl}\n`);

  const results: TestResult[] = [];

  async function testHttp(
    endpoint: string,
    method: string,
    expectedStatus: number,
    body?: any,
    headers?: Record<string, string>,
    description?: string
  ): Promise<{ status: number; data: any }> {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(headers || {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }

      const passed = response.status === expectedStatus;
      results.push({
        endpoint,
        method,
        expectedStatus,
        actualStatus: response.status,
        passed,
        notes: description || (passed ? 'OK' : JSON.stringify(data)),
      });

      const icon = passed ? '✅' : '❌';
      console.log(`  ${icon} [${method}] ${endpoint} -> ${response.status} (Expected ${expectedStatus}) | ${description || ''}`);
      return { status: response.status, data };
    } catch (err: any) {
      results.push({
        endpoint,
        method,
        expectedStatus,
        actualStatus: 0,
        passed: false,
        notes: err.message,
      });
      console.log(`  ❌ [${method}] ${endpoint} -> NETWORK/EXECUTION ERROR: ${err.message}`);
      return { status: 0, data: null };
    }
  }

  console.log('--- 1. SYSTEM HEALTH & 404 HANDLER ---');
  await testHttp('/api/health', 'GET', 200, undefined, undefined, 'Health check returns 200 with DB status');
  await testHttp('/api/unknown-endpoint-xyz', 'GET', 404, undefined, undefined, 'Global API 404 handler returns 404');

  console.log('\n--- 2. AUTHENTICATION & TOKENS VIA HTTP ---');
  // Generate authentic tokens for testing IDOR and RBAC flows
  const customerA = {
    id: '65e011111111111111111111',
    email: 'client.alpha@ayla.aero',
    role: 'customer' as const,
    fullName: 'Lady Genevieve Sterling',
  };
  const customerB = {
    id: '65e022222222222222222222',
    email: 'client.beta@ayla.aero',
    role: 'customer' as const,
    fullName: 'Lord Julian Hawthorne',
  };
  const adminUser = {
    id: '65e099999999999999999999',
    email: 'ops.director@flyayla.com',
    role: 'admin' as const,
    fullName: 'Mission Director Vance',
  };

  const tokenCustomerA = TokenService.generateAccessToken(customerA);
  const tokenCustomerB = TokenService.generateAccessToken(customerB);
  const tokenAdmin = TokenService.generateAccessToken(adminUser);

  await testHttp(
    '/api/auth/me',
    'GET',
    200,
    undefined,
    { Authorization: `Bearer ${tokenCustomerA}` },
    'Customer A profile retrieval via valid Bearer token'
  );

  await testHttp(
    '/api/auth/me',
    'GET',
    401,
    undefined,
    { Authorization: 'Bearer invalid.bogus.token' },
    'Unauthenticated / invalid token rejected with 401'
  );

  console.log('\n--- 3. SERVER-SIDE PRICING CALCULATION VIA HTTP ---');
  const pricingReq = {
    aircraftCategory: 'Heavy Jet',
    legs: [
      {
        departureIcao: 'KTEB',
        destinationIcao: 'EGLL',
        distanceNm: 2993,
        flightTimeHours: 6.5,
        passengersCount: 8,
      },
    ],
  };
  await testHttp(
    '/api/pricing/estimate',
    'POST',
    200,
    pricingReq,
    undefined,
    'Live server pricing calculation for KTEB -> EGLL'
  );

  console.log('\n--- 4. RBAC & IDOR INTEGRATION OVER HTTP ---');
  // Customer A attempts to access admin dashboard -> MUST be 403 Forbidden
  await testHttp(
    '/api/admin/dashboard',
    'GET',
    403,
    undefined,
    { Authorization: `Bearer ${tokenCustomerA}` },
    'Customer A blocked from /api/admin/dashboard (HTTP 403 RBAC)'
  );

  // Admin access to admin dashboard -> 200 OK
  await testHttp(
    '/api/admin/dashboard',
    'GET',
    200,
    undefined,
    { Authorization: `Bearer ${tokenAdmin}` },
    'Admin access to /api/admin/dashboard permitted (HTTP 200)'
  );

  // Customer A submits a flight request
  const flightReqBody = {
    customerName: customerA.fullName,
    customerEmail: customerA.email,
    customerPhone: '+1-212-555-0188',
    tripType: 'one-way',
    aircraftCategory: 'Heavy Jet',
    legs: [
      {
        departureIcao: 'KTEB',
        destinationIcao: 'EGLL',
        departureDate: '2026-11-01',
        departureTime: '15:00 UTC',
        passengersCount: 6,
      },
    ],
  };

  const createReqRes = await testHttp(
    '/api/flight-requests',
    'POST',
    201,
    flightReqBody,
    { Authorization: `Bearer ${tokenCustomerA}` },
    'Customer A submits valid flight request (HTTP 201)'
  );

  // Customer A lists their flight requests
  await testHttp(
    '/api/flight-requests',
    'GET',
    200,
    undefined,
    { Authorization: `Bearer ${tokenCustomerA}` },
    'Customer A retrieves own flight requests (HTTP 200)'
  );

  // Quotes, Invoices, Bookings, Notifications endpoints
  await testHttp(
    '/api/quotes',
    'GET',
    200,
    undefined,
    { Authorization: `Bearer ${tokenCustomerA}` },
    'Customer A retrieves own quotes (HTTP 200)'
  );

  await testHttp(
    '/api/invoices',
    'GET',
    200,
    undefined,
    { Authorization: `Bearer ${tokenCustomerA}` },
    'Customer A retrieves own invoices (HTTP 200)'
  );

  await testHttp(
    '/api/bookings',
    'GET',
    200,
    undefined,
    { Authorization: `Bearer ${tokenCustomerA}` },
    'Customer A retrieves own bookings (HTTP 200)'
  );

  await testHttp(
    '/api/notifications',
    'GET',
    200,
    undefined,
    { Authorization: `Bearer ${tokenCustomerA}` },
    'Customer A retrieves own notifications (HTTP 200)'
  );

  console.log('\n--- 5. AIRPORT SEARCH & LIVE FUEL INDEX ---');
  await testHttp('/api/airports/search?q=KTEB', 'GET', 200, undefined, undefined, 'Airport search query for KTEB (HTTP 200)');
  await testHttp('/api/airports/popular', 'GET', 200, undefined, undefined, 'Popular VIP airports retrieval (HTTP 200)');
  await testHttp('/api/airports/KTEB', 'GET', 200, undefined, undefined, 'Airport lookup by ICAO (HTTP 200)');
  await testHttp('/api/pricing/fuel', 'GET', 200, undefined, undefined, 'Retrieve live JetFuelX fuel pricing status (HTTP 200)');
  await testHttp('/api/pricing/fuel-index', 'GET', 200, undefined, undefined, 'Retrieve fuel index alias (HTTP 200)');
  await testHttp('/api/pricing/rules', 'GET', 200, undefined, undefined, 'Retrieve pricing rules matrix (HTTP 200)');

  console.log('\n--- 6. ADMIN OPERATIONS & MISSION CONTROL ENDPOINTS ---');
  await testHttp('/api/admin/dashboard', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin dashboard telemetry (HTTP 200)');
  await testHttp('/api/admin/customers', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves customer directory (HTTP 200)');
  await testHttp('/api/admin/flight-requests', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves all flight requests (HTTP 200)');
  await testHttp('/api/admin/quotes', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves quotations (HTTP 200)');
  await testHttp('/api/admin/bookings', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves bookings (HTTP 200)');
  await testHttp('/api/admin/invoices', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves invoices (HTTP 200)');
  await testHttp('/api/admin/payments', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves payments ledger (HTTP 200)');
  await testHttp('/api/admin/aircraft', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves fleet aircraft list (HTTP 200)');
  await testHttp('/api/admin/airports', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves airports directory (HTTP 200)');
  await testHttp('/api/admin/pricing', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves dynamic pricing rules (HTTP 200)');
  await testHttp('/api/admin/payla-forensic', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves PAYLA forensic cases (HTTP 200)');
  await testHttp('/api/admin/notifications', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves mission notifications (HTTP 200)');
  await testHttp('/api/admin/reports', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves reports & revenue breakdown (HTTP 200)');
  await testHttp('/api/admin/audit-logs', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves immutable audit logs (HTTP 200)');
  await testHttp('/api/admin/settings', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves system settings (HTTP 200)');
  await testHttp('/api/admin/profile', 'GET', 200, undefined, { Authorization: `Bearer ${tokenAdmin}` }, 'Admin retrieves admin profile (HTTP 200)');

  console.log('\n--- 7. TIMING-SAFE PAYMENT WEBHOOK HTTP INTEGRATION ---');
  const webhookSecret = process.env.PAYMENT_GATEWAY_SECRET || 'test_webhook_secret_key_ayla_2026';
  const timestamp = Math.floor(Date.now() / 1000);
  const webhookPayload = {
    eventId: 'evt_test_http_' + Date.now(),
    eventType: 'payment.settled',
    timestamp: timestamp,
    data: {
      transactionId: 'txn_ayla_http_101',
      paymentId: 'pay_http_101',
      invoiceId: 'inv_http_101',
      invoiceNumber: 'INV-2026-HTTP',
      amount: 65000,
      currency: 'USD',
      status: 'Paid',
    },
  };

  const payloadString = JSON.stringify(webhookPayload);
  const validSignatureHex = crypto
    .createHmac('sha256', webhookSecret)
    .update(`${timestamp}.${payloadString}`)
    .digest('hex');
  const validHeader = `t=${timestamp},v1=${validSignatureHex}`;

  // 1. Webhook with tampered body -> 400 Rejected
  const tamperedPayload = JSON.stringify({ ...webhookPayload, data: { ...webhookPayload.data, amount: 1 } });
  await testHttp(
    '/api/webhooks/payment',
    'POST',
    400,
    JSON.parse(tamperedPayload),
    { 'stripe-signature': validHeader },
    'Webhook with tampered payload rejected (HTTP 400 Bad Request)'
  );

  // 2. Webhook with stale timestamp (>300s) -> 400 Rejected
  const staleTimestamp = timestamp - 400;
  const staleSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(`${staleTimestamp}.${payloadString}`)
    .digest('hex');
  const staleHeader = `t=${staleTimestamp},v1=${staleSignature}`;
  await testHttp(
    '/api/webhooks/payment',
    'POST',
    400,
    webhookPayload,
    { 'stripe-signature': staleHeader },
    'Stale/replayed webhook (>300s) rejected (HTTP 400 Bad Request)'
  );

  // Clean up server
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });

  console.log('\n================================================================');
  const totalPassed = results.filter((r) => r.passed).length;
  const totalFailed = results.filter((r) => !r.passed).length;
  console.log(`🏁 HTTP INTEGRATION SUMMARY: ${totalPassed} PASSED, ${totalFailed} FAILED out of ${results.length} tests`);
  console.log('================================================================\n');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

runHttpIntegrationSuite().catch((err) => {
  console.error('Integration test runner error:', err);
  process.exit(1);
});
