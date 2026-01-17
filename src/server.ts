import { createApp } from './app';
import { connectMongoDB } from './config/database';
import { QueueConsumer } from './jobs/QueueConsumer';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3003;

const startServer = async () => {
  try {
    // 1️⃣ MongoDB
    await connectMongoDB();
    console.log('✅ Connected to MongoDB');

    // 2️⃣ Consumidor de cola / Redis
    const queueConsumer = new QueueConsumer();
    await queueConsumer.start();
    console.log('✅ Queue Consumer started');

    // 3️⃣ Express
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`🚀 Audit Service running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error starting Audit Service:', error);
    process.exit(1);
  }
};

startServer();
