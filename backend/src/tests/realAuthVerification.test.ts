import http from 'http';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { createApp } from '../app';
import { connectDatabase, isMongoConnected } from '../config/database';
import { seedInitialUsers } from '../seed/adminSeed';
import { UserModel } from '../models/User';

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}${detail ? ` — ${detail}` : ''}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${detail ? ` — ${detail}` : ''}`);
    failedCount++;
  }
}

async function fetchJson(
  baseUrl: string,
  path: string,
  options: { method?: string; headers?: Record<string, string>; body?: any } = {}
) {
  const url = `${baseUrl}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const init: RequestInit = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    init.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const res = await fetch(url, init);
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  return { status: res.status, json, headers: res.headers };
}

async function runRealAuthAudit() {
  console.log('================================================================');
  console.log('🔒 FLY AYLA — REAL AUTHENTICATION & MONGODB PERSISTENCE AUDIT');
  console.log('================================================================\n');

  await connectDatabase();
  await seedInitialUsers();

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const address = server.address() as { address: string; port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;
  console.log(`[Fly Ayla Auth Audit Server]: Running at ${baseUrl}\n`);

  const uniqueSuffix = Date.now();
  const testEmail = `vip.client.${uniqueSuffix}@luxury-travel.com`;
  const testPassword = 'AylaCharterVIP#2026!';
  const testFirstName = 'Alexander';
  const testLastName = 'Rothschild';
  const testPhone = '+1 212 555 0199';
  const testCompany = 'Rothschild Global Holdings';

  // -------------------------------------------------------------
  // TEST 1: Register New Account
  // -------------------------------------------------------------
  console.log('--- TEST 1: CREATE ACCOUNT & MONGODB PERSISTENCE ---');
  const regPayload = {
    firstName: testFirstName,
    lastName: testLastName,
    email: testEmail,
    phone: testPhone,
    companyName: testCompany,
    password: testPassword,
  };

  const regRes = await fetchJson(baseUrl, '/api/auth/register', {
    method: 'POST',
    body: regPayload,
  });

  assert(regRes.status === 201, 'POST /api/auth/register returns HTTP 201 Created', `Status: ${regRes.status}`);
  assert(regRes.json?.success === true, 'Response contains success: true');
  assert(regRes.json?.data?.user?.email === testEmail.toLowerCase(), 'Returned user email matches input');
  assert(regRes.json?.data?.user?.role === 'customer', 'User role is customer');
  assert(regRes.json?.data?.accessToken !== undefined, 'AccessToken returned on registration');

  const customerToken = regRes.json?.data?.accessToken;
  const createdUserId = regRes.json?.data?.user?.id;

  // Direct MongoDB verification
  if (isMongoConnected()) {
    console.log('\n--- DIRECT MONGODB AUDIT ---');
    const dbUser = await (UserModel as any).findOne({ email: testEmail.toLowerCase() }).select('+passwordHash');
    assert(dbUser !== null, 'User document actually exists in MongoDB');
    assert(mongoose.isValidObjectId(dbUser._id), 'User _id is a valid MongoDB ObjectId', `_id: ${dbUser._id}`);
    assert(dbUser.email === testEmail.toLowerCase(), 'MongoDB user email matches normalized email');
    assert(dbUser.firstName === testFirstName, 'MongoDB user firstName persisted');
    assert(dbUser.lastName === testLastName, 'MongoDB user lastName persisted');
    assert(dbUser.fullName === `${testFirstName} ${testLastName}`, 'MongoDB user fullName populated');
    assert(dbUser.phone === testPhone, 'MongoDB user phone persisted');
    assert(dbUser.companyName === testCompany, 'MongoDB user companyName persisted');
    assert(dbUser.role === 'customer', 'MongoDB user role is customer');
    assert(dbUser.status === 'active', 'MongoDB user status is active');
    
    // Password security check
    assert(dbUser.passwordHash !== testPassword, 'Password is NOT stored as plaintext');
    const isBcryptMatch = await bcrypt.compare(testPassword, dbUser.passwordHash);
    assert(isBcryptMatch === true, 'Bcrypt password hash correctly verifies with candidate password');
  }

  // -------------------------------------------------------------
  // TEST 2: Duplicate Email Rejection
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: DUPLICATE EMAIL REJECTION ---');
  const dupRes = await fetchJson(baseUrl, '/api/auth/register', {
    method: 'POST',
    body: {
      ...regPayload,
      email: testEmail.toUpperCase(), // Test case insensitivity
    },
  });

  assert(dupRes.status === 409, 'Duplicate email registration returns HTTP 409 Conflict', `Status: ${dupRes.status}`);
  assert(dupRes.json?.success === false, 'Duplicate response success is false');
  assert(
    dupRes.json?.message?.includes('already exists'),
    'Duplicate response provides descriptive error message',
    dupRes.json?.message
  );

  // -------------------------------------------------------------
  // TEST 3: Login Authentication Flow
  // -------------------------------------------------------------
  console.log('\n--- TEST 3: LOGIN WITH NEW CREDENTIALS ---');
  // Wrong password
  const badLogin = await fetchJson(baseUrl, '/api/auth/login', {
    method: 'POST',
    body: { email: testEmail, password: 'WrongPassword123!' },
  });
  assert(badLogin.status === 401, 'Invalid password returns HTTP 401 Unauthorized', `Status: ${badLogin.status}`);

  // Correct login
  const loginRes = await fetchJson(baseUrl, '/api/auth/login', {
    method: 'POST',
    body: { email: testEmail, password: testPassword },
  });
  assert(loginRes.status === 200, 'Valid login returns HTTP 200 OK', `Status: ${loginRes.status}`);
  assert(loginRes.json?.success === true, 'Login response success is true');
  assert(loginRes.json?.data?.accessToken !== undefined, 'Login response issues access token');
  assert(loginRes.json?.data?.user?.id === createdUserId, 'Login resolves to correct MongoDB user ID');

  const activeToken = loginRes.json?.data?.accessToken;

  // -------------------------------------------------------------
  // TEST 4: /api/auth/me Profile Verification
  // -------------------------------------------------------------
  console.log('\n--- TEST 4: /api/auth/me CURRENT SESSION FETCH ---');
  const meRes = await fetchJson(baseUrl, '/api/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${activeToken}` },
  });
  assert(meRes.status === 200, 'GET /api/auth/me returns HTTP 200', `Status: ${meRes.status}`);
  assert(meRes.json?.data?.user?.email === testEmail.toLowerCase(), '/me returns user email from database');
  assert(meRes.json?.data?.user?.role === 'customer', '/me returns verified database role: customer');
  assert(meRes.json?.data?.user?.phone === testPhone, '/me returns user phone');

  // -------------------------------------------------------------
  // TEST 5: Role-Based Admin Route Protection (RBAC)
  // -------------------------------------------------------------
  console.log('\n--- TEST 5: ADMIN ROUTE ACCESS CONTROL ---');
  // Unauthenticated access
  const unauthAdmin = await fetchJson(baseUrl, '/api/admin/customers');
  assert(unauthAdmin.status === 401, 'Unauthenticated /api/admin/customers returns HTTP 401', `Status: ${unauthAdmin.status}`);

  // Customer attempting admin route
  const customerAdminAttempt = await fetchJson(baseUrl, '/api/admin/customers', {
    method: 'GET',
    headers: { Authorization: `Bearer ${activeToken}` },
  });
  assert(customerAdminAttempt.status === 403, 'Customer accessing /api/admin/customers returns HTTP 403 Forbidden', `Status: ${customerAdminAttempt.status}`);

  // Real Admin Login
  const adminLogin = await fetchJson(baseUrl, '/api/auth/login', {
    method: 'POST',
    body: { email: 'admin@flyayla.com', password: 'AdminPassword123!' },
  });
  assert(adminLogin.status === 200, 'Admin login succeeds with HTTP 200', `Status: ${adminLogin.status}`);
  assert(adminLogin.json?.data?.user?.role === 'admin', 'Admin user has role: admin');

  const adminToken = adminLogin.json?.data?.accessToken;

  // Admin accessing admin route
  const adminAccess = await fetchJson(baseUrl, '/api/admin/customers', {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(adminAccess.status === 200, 'Admin successfully accesses /api/admin/customers with HTTP 200', `Status: ${adminAccess.status}`);
  assert(adminAccess.json?.data?.customers !== undefined, 'Admin customers endpoint returns customer list');

  // -------------------------------------------------------------
  // TEST 6: Audit Results Summary
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`AUDIT RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('================================================================\n');

  server.close();
  if (failedCount > 0) {
    process.exit(1);
  }
}

runRealAuthAudit().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
