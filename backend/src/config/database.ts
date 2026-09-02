import mongoose from 'mongoose';
import './env';

// Strictly disable command buffering to ensure operations only execute against an active connection
mongoose.set('bufferCommands', false);

let isConnected = false;

mongoose.connection.on('connected', () => {
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('❌ [Database Error] MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️ [Database] MongoDB disconnected');
});

export async function connectDatabase(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.error('❌ [Database] MONGODB_URI is not configured in environment. MongoDB is required.');
    isConnected = false;
    return false;
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  console.log('[Database] Connecting to MongoDB...');
  try {
    const dbName = process.env.MONGODB_DB_NAME || 'flyayla';
    const conn = await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
    isConnected = conn.connection.readyState === 1;
    if (isConnected) {
      console.log('[Database] MongoDB connected');
      console.log(`[Database] Database name: ${conn.connection.name}`);
      return true;
    }
    return false;
  } catch (error: any) {
    console.error(`❌ [Database Error] MongoDB connection failed: ${error.message}`);
    isConnected = false;
    return false;
  }
}

export function isMongoConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export function getDatabaseName(): string {
  return mongoose.connection.name || process.env.MONGODB_DB_NAME || 'flyayla';
}


