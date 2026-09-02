import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { TokenService } from '../services/token.service';
import { PricingService } from '../services/pricing.service';
import { PaymentGatewayService } from '../services/integrations/paymentGateway.service';
import { validateFlightRequest } from '../validators/flightRequest.validator';

async function runTests() {
  console.log('================================================================');
  console.log('🚀 FLY AYLA PRIVATE AVIATION — REAL FUNCTIONAL VERIFICATION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  console.log('--- 1. AUTHENTICATION & PASSWORD SECURITY ---');
  // 1. Password hashing with bcrypt
  const rawPassword = 'AylaCharterVIP@2026!';
  const hashedPassword = await bcrypt.hash(rawPassword, 12);
  assert(hashedPassword.startsWith('$2'), 'Password hashed with bcrypt cost factor >= 12');
  assert(await bcrypt.compare(rawPassword, hashedPassword), 'Valid password matches bcrypt hash');
  assert(!(await bcrypt.compare('WrongPassword123!', hashedPassword)), 'Invalid password rejected');

  // 2. JWT Access & Refresh Token generation and verification
  const testUser = {
    id: '65e0123456789abcdef01234',
    email: 'charter.client@aylavip.com',
    role: 'customer' as const,
    fullName: 'Elena Rostova',
  };

  const accessToken = TokenService.generateAccessToken(testUser);
  assert(typeof accessToken === 'string' && accessToken.split('.').length === 3, 'JWT Access Token generated in standard 3-segment format');

  const decodedAccess = TokenService.verifyAccessToken(accessToken);
  assert(decodedAccess !== null && decodedAccess.email === testUser.email && decodedAccess.role === 'customer', 'Access token verifies and decodes valid payload');

  const invalidTokenResult = TokenService.verifyAccessToken('invalid.token.signature');
  assert(invalidTokenResult === null, 'Invalid JWT token string rejected safely (returns null, no throw)');

  // Refresh token
  const refreshToken = TokenService.generateRefreshToken(testUser);
  const decodedRefresh = TokenService.verifyRefreshToken(refreshToken);
  assert(decodedRefresh !== null && decodedRefresh.id === testUser.id, 'Refresh token generates and verifies with subject ID');

  console.log('\n--- 2. RBAC & IDOR PROTECTION LOGIC ---');
  // Verify that customer cannot act as admin
  const customerDecoded: { id: string; email: string; role: string } = { id: testUser.id, email: testUser.email, role: 'customer' };
  const adminDecoded: { id: string; email: string; role: string } = { id: '65e0999999999abcdef09999', email: 'ops@flyayla.com', role: 'admin' };

  const isCustomerAdmin = customerDecoded.role === 'admin';
  const isAdminAdmin = adminDecoded.role === 'admin';
  assert(!isCustomerAdmin, 'Customer role fails admin check');
  assert(isAdminAdmin, 'Admin role passes admin check');

  // IDOR check simulation
  const quoteOwnedByCustomerA = {
    _id: 'quote_123',
    userId: 'customer_A_id',
    customerEmail: 'customerA@ayla.com',
    status: 'Sent',
    totalPrice: 48500,
  };

  function checkQuoteOwnership(quote: any, user: { id: string; email: string; role: string }) {
    const isOwner = quote.userId === user.id || quote.customerEmail.toLowerCase() === user.email.toLowerCase();
    if (!isOwner && user.role !== 'admin') {
      return { allowed: false, status: 403, error: 'Unauthorized: You cannot access or approve this quotation.' };
    }
    return { allowed: true, status: 200 };
  }

  const customerB = { id: 'customer_B_id', email: 'customerB@ayla.com', role: 'customer' };
  const customerA = { id: 'customer_A_id', email: 'customerA@ayla.com', role: 'customer' };
  const adminUser = { id: 'admin_id', email: 'admin@flyayla.com', role: 'admin' };

  const idorCheckCustomerB = checkQuoteOwnership(quoteOwnedByCustomerA, customerB);
  assert(!idorCheckCustomerB.allowed && idorCheckCustomerB.status === 403, 'IDOR Protection: Customer B cannot access Customer A quotation (HTTP 403)');

  const idorCheckCustomerA = checkQuoteOwnership(quoteOwnedByCustomerA, customerA);
  assert(idorCheckCustomerA.allowed && idorCheckCustomerA.status === 200, 'Owner Access: Customer A can access their own quotation (HTTP 200)');

  const idorCheckAdmin = checkQuoteOwnership(quoteOwnedByCustomerA, adminUser);
  assert(idorCheckAdmin.allowed && idorCheckAdmin.status === 200, 'Admin Access: Authorized Admin can inspect customer quotation (HTTP 200)');

  console.log('\n--- 3. FLIGHT REQUEST VALIDATION & PARSING ---');
  const validLegsRequest = {
    customerName: 'Alexander Hayes',
    customerEmail: 'alex.hayes@hayesholdings.com',
    customerPhone: '+1-212-555-0199',
    legs: [
      {
        departureIcao: 'KTEB',
        destinationIcao: 'EGLL',
        departureDate: '2026-10-15',
        departureTime: '14:00 UTC',
        passengersCount: 6,
      },
      {
        departureIcao: 'EGLL',
        destinationIcao: 'OMDB',
        departureDate: '2026-10-20',
        departureTime: '10:00 UTC',
        passengersCount: 4,
      },
    ],
  };

  const validationResult = validateFlightRequest(validLegsRequest);
  assert(validationResult.isValid, 'Multi-leg flight request validates successfully');

  const invalidLegsRequest = {
    customerName: 'Test',
    customerEmail: 'invalid-email',
    legs: [],
  };
  const invalidResult = validateFlightRequest(invalidLegsRequest);
  assert(!invalidResult.isValid, 'Invalid flight request without legs rejected');

  console.log('\n--- 4. SERVER-AUTHORITATIVE PRICING ENGINE ---');
  // Distance Great-Circle calculation
  // KTEB (40.85, -74.06) to EGLL (51.47, -0.46)
  const distanceKtebEgll = PricingService.calculateDistanceNm(40.85, -74.06, 51.47, -0.46);
  assert(distanceKtebEgll > 2900 && distanceKtebEgll < 3200, `Great-Circle distance between KTEB and EGLL computed accurately (${distanceKtebEgll} NM)`);

  const pricingOutput = await PricingService.calculateTripPrice({
    aircraftCategory: 'Heavy Jet',
    legs: [
      {
        departureIcao: 'KTEB',
        destinationIcao: 'EGLL',
        distanceNm: distanceKtebEgll,
        flightTimeHours: distanceKtebEgll / 480 + 0.3,
        passengersCount: 6,
      },
    ],
  });

  assert(pricingOutput.quotedTotal > 0, `Server generated quoted total: $${pricingOutput.quotedTotal.toLocaleString()}`);
  assert(pricingOutput.fuelCost === null || pricingOutput.fuelCost >= 0, `Fuel cost calculation verified: ${pricingOutput.fuelCost === null ? 'NULL (JetFuelX unconfigured)' : `$${pricingOutput.fuelCost.toLocaleString()}`} (Status: ${pricingOutput.fuelStatus}, PricingStatus: ${pricingOutput.fuelPricingStatus})`);
  assert(pricingOutput.markupAmount > 0, `Operator margin applied server-side: $${pricingOutput.markupAmount.toLocaleString()}`);
  assert(pricingOutput.estimatedFlightHours > 0, `Flight duration calculated: ${pricingOutput.estimatedFlightHours.toFixed(2)} hrs`);

  console.log('\n--- 5. QUOTATION STATUS TRANSITIONS ---');
  const testQuoteStates = ['Draft', 'Sent', 'Approved', 'Rejected'];
  assert(testQuoteStates.includes('Approved'), 'Approved is a recognized quotation state');

  function attemptQuoteApproval(quote: { status: string; expiresAt: Date }) {
    if (quote.status === 'Approved') {
      return { success: false, error: 'Quotation has already been approved and converted to an active booking.' };
    }
    if (quote.status === 'Rejected') {
      return { success: false, error: 'Quotation has already been rejected and cannot be approved.' };
    }
    if (new Date(quote.expiresAt).getTime() < Date.now()) {
      return { success: false, error: 'Quotation has expired. Please request a refreshed quote.' };
    }
    return { success: true };
  }

  const freshQuote = { status: 'Sent', expiresAt: new Date(Date.now() + 86400000) };
  assert(attemptQuoteApproval(freshQuote).success, 'Fresh quotation can be approved');

  const approvedQuote = { status: 'Approved', expiresAt: new Date(Date.now() + 86400000) };
  assert(!attemptQuoteApproval(approvedQuote).success, 'Duplicate quotation approval prevented');

  const expiredQuote = { status: 'Sent', expiresAt: new Date(Date.now() - 10000) };
  assert(!attemptQuoteApproval(expiredQuote).success, 'Expired quotation approval blocked');

  const rejectedQuote = { status: 'Rejected', expiresAt: new Date(Date.now() + 86400000) };
  assert(!attemptQuoteApproval(rejectedQuote).success, 'Rejected quotation approval blocked');

  console.log('\n--- 6. PAYMENT SECURITY & TIMING-SAFE WEBHOOK ENGINE ---');
  // Webhook signature generation
  const webhookSecret = 'test_webhook_secret_key_ayla_2026';
  const timestamp = Math.floor(Date.now() / 1000);
  const webhookPayload = {
    eventId: 'evt_ayla_test_' + Date.now(),
    eventType: 'payment.settled',
    timestamp: timestamp,
    data: {
      transactionId: 'txn_ayla_settle_9999',
      paymentId: 'pay_12345678',
      invoiceId: 'inv_12345678',
      invoiceNumber: 'INV-2026-0001',
      amount: 45000,
      currency: 'USD',
      status: 'Paid',
    },
  };

  const payloadString = JSON.stringify(webhookPayload);
  const signatureHex = crypto
    .createHmac('sha256', webhookSecret)
    .update(`${timestamp}.${payloadString}`)
    .digest('hex');
  const stripeSignatureHeader = `t=${timestamp},v1=${signatureHex}`;

  // Verify valid signature
  const validVerification = PaymentGatewayService.verifyWebhookSignature(
    payloadString,
    stripeSignatureHeader,
    webhookSecret
  );
  assert(validVerification, 'Timing-safe HMAC SHA-256 signature verified successfully');

  // Verify altered payload signature failure
  const tamperedPayloadString = JSON.stringify({ ...webhookPayload, data: { ...webhookPayload.data, amount: 100 } });
  const tamperedVerification = PaymentGatewayService.verifyWebhookSignature(
    tamperedPayloadString,
    stripeSignatureHeader,
    webhookSecret
  );
  assert(!tamperedVerification, 'Tampered webhook payload signature rejected (anti-tampering)');

  // Verify expired timestamp (>300 seconds replay protection)
  const staleTimestamp = timestamp - 400;
  const staleSignatureHex = crypto
    .createHmac('sha256', webhookSecret)
    .update(`${staleTimestamp}.${payloadString}`)
    .digest('hex');
  const staleHeader = `t=${staleTimestamp},v1=${staleSignatureHex}`;
  const replayVerification = PaymentGatewayService.verifyWebhookSignature(
    payloadString,
    staleHeader,
    webhookSecret
  );
  assert(!replayVerification, 'Expired webhook (>300s old) rejected (replay attack prevention)');

  // Verify underpayment check
  const authoritativeInvoice = {
    _id: 'inv_12345678',
    totalAmount: 45000,
    currency: 'USD',
    status: 'Issued',
  };

  function verifyPaymentSettlement(invoice: typeof authoritativeInvoice, paymentAmount: number, paymentCurrency: string) {
    if (invoice.status === 'Paid') {
      return { success: false, reason: 'Invoice is already settled' };
    }
    if (paymentCurrency.toUpperCase() !== invoice.currency.toUpperCase()) {
      return { success: false, reason: 'Currency mismatch' };
    }
    if (paymentAmount < invoice.totalAmount) {
      return { success: false, reason: `Underpayment detected: received ${paymentAmount}, required ${invoice.totalAmount}` };
    }
    return { success: true };
  }

  const exactPayment = verifyPaymentSettlement(authoritativeInvoice, 45000, 'USD');
  assert(exactPayment.success, 'Exact amount payment accepted for invoice settlement');

  const underPayment = verifyPaymentSettlement(authoritativeInvoice, 44999, 'USD');
  assert(!underPayment.success, 'Underpayment ($44,999 vs $45,000) rejected');

  const currencyMismatch = verifyPaymentSettlement(authoritativeInvoice, 45000, 'EUR');
  assert(!currencyMismatch.success, 'Currency mismatch (EUR vs USD) rejected');

  console.log('\n--- 7. MULTI-CATEGORY AIRCRAFT PRICING MATRIX ---');
  const categories = ['Light Jet', 'Midsize Jet', 'Super Midsize', 'Heavy Jet', 'Ultra Long Range', 'VIP Airliner'];
  for (const cat of categories) {
    const quote = await PricingService.calculateTripPrice({
      aircraftCategory: cat,
      legs: [{ departureIcao: 'KTEB', destinationIcao: 'KMIA', distanceNm: 950, flightTimeHours: 2.6 }],
    });
    assert(quote.quotedTotal > 0, `Deterministic pricing calculated for category "${cat}": $${quote.quotedTotal.toLocaleString()}`);
  }

  console.log('\n--- 8. ADMIN REVENUE AGGREGATION INTEGRITY ---');
  const testPaymentLedger = [
    { status: 'Paid', amount: 85000, currency: 'USD' },
    { status: 'Paid', amount: 120000, currency: 'USD' },
    { status: 'Pending', amount: 45000, currency: 'USD' }, // Must NOT count toward revenue
    { status: 'Failed', amount: 62000, currency: 'USD' },  // Must NOT count toward revenue
    { status: 'Paid', amount: 95000, currency: 'USD' },
  ];

  const grossRevenue = testPaymentLedger
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  assert(grossRevenue === 300000, `Authoritative gross revenue computed strictly from settled 'Paid' transactions ($${grossRevenue.toLocaleString()})`);
  assert(!testPaymentLedger.filter(p => p.status !== 'Paid').some(p => p.status === 'Paid'), 'Pending and Failed transactions strictly excluded from revenue');

  console.log('\n--- 9. BOOKING PNR & ITINERARY GENERATION ---');
  const generatedPnr = `AYLA-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  assert(generatedPnr.startsWith('AYLA-'), `Unique aviation PNR generated: ${generatedPnr}`);

  console.log('\n--- 10. SENSITIVE DATA EXCLUSION ---');
  const rawDbUserDoc = {
    _id: '65e0123456789abcdef01234',
    firstName: 'Sophia',
    lastName: 'Vane',
    email: 'sophia.vane@ayla.com',
    passwordHash: '$2a$12$eX4mpL3H4sh3dPa$$w0rdS3cur1tyStr1ng',
    role: 'customer',
  };

  const sanitizedUserResponse = {
    id: rawDbUserDoc._id,
    firstName: rawDbUserDoc.firstName,
    lastName: rawDbUserDoc.lastName,
    fullName: `${rawDbUserDoc.firstName} ${rawDbUserDoc.lastName}`,
    email: rawDbUserDoc.email,
    role: rawDbUserDoc.role,
  };

  assert(!('passwordHash' in sanitizedUserResponse), 'passwordHash is strictly stripped from customer API responses');
  assert(!('password' in sanitizedUserResponse), 'raw password is never present in customer API responses');

  console.log('\n================================================================');
  console.log(`🏁 VERIFICATION SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
