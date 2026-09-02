import './config/env';
import mongoose from 'mongoose';
import { createApp } from './app';
import { connectDatabase, isMongoConnected, getDatabaseName } from './config/database';
import { seedInitialUsers } from './seed/adminSeed';

const PORT = Number(process.env.BACKEND_PORT) || 5000;

async function bootstrap() {
  console.log('====================================================');
  console.log('✈️  FLY AYLA PRIVATE AVIATION — BACKEND SERVER');
  console.log('====================================================');

  // 1. Validate & Log Sanitized Environment
  const hasUri = !!process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<username>');
  console.log(`[Config] NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Config] Backend Port: ${PORT}`);
  console.log(`[Config] MONGODB_URI loaded: ${hasUri ? 'YES' : 'NO'}`);

  if (!hasUri) {
    console.error('❌ [Config Fatal]: MONGODB_URI environment variable is missing or placeholder.');
    console.error('   Please provide valid MONGODB_URI in backend/.env');
    throw new Error('MONGODB_URI is missing or unconfigured');
  }

  // 2. Connect to MongoDB and wait for resolution
  console.log('[Database] Connecting to MongoDB Atlas...');
  const dbConnected = await connectDatabase();

  if (!dbConnected || mongoose.connection.readyState !== 1) {
    console.error('❌ [Database Fatal]: MongoDB connection was not established.');
    console.error('   Ensure your current IP address (34.34.254.51 or 0.0.0.0/0) is on your Atlas Network Access IP Whitelist.');
    throw new Error('MongoDB connection was not established');
  }

  // 3. Verify Database Name and Ping
  const pingResult = await mongoose.connection.db?.command({ ping: 1 });
  console.log(`[Database] MongoDB Host: ${mongoose.connection.host}`);
  console.log(`[Database] Target Database: ${getDatabaseName()}`);
  console.log(`[Database] Mongoose readyState: ${mongoose.connection.readyState}`);
  console.log(`[Database] MongoDB Ping Result:`, pingResult);

  // 4. Seed initial admin accounts if needed
  try {
    await seedInitialUsers();
  } catch (seedErr: any) {
    console.warn('⚠️ [Seed Notice]:', seedErr?.message || seedErr);
  }

  // 5. Create Express app and start listening
  console.log('[Server] Starting Express HTTP server...');
  const app = createApp();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Express server running on port ${PORT}`);
    console.log(`📡 [API Gateway] Endpoints ready at http://0.0.0.0:${PORT}/api`);
  });

  return server;
}

bootstrap().catch((err) => {
  console.error('❌ [Server Boot Failure]:', err.message);
  process.exit(1);
});



