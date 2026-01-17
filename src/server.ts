import { createApp } from './app';
import { connectMongoDB } from './config/database';
import { QueueConsumer } from './jobs/QueueConsumer';
import { RedisSubscriber } from './services/RedisSubscriber';
import { AuditService } from './services/AuditService';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3003;

const startServer = async () => {
  try {
    // 1️⃣ MongoDB
    await connectMongoDB();
    console.log('✅ Connected to MongoDB');

    // 2️⃣ Redis Subscriber
    const auditService = new AuditService();
    const redisSubscriber = new RedisSubscriber(auditService);
    console.log('✅ Redis Subscriber initialized');

    // 3️⃣ RabbitMQ Consumer (backup)
    const queueConsumer = new QueueConsumer();
    await queueConsumer.start();
    console.log('✅ Queue Consumer started');

    // 4️⃣ Express
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
