import { createApp } from './app';
import { connectMongoDB } from './config/database';
import { QueueConsumer } from './jobs/QueueConsumer'; // COMENTADO
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3003;

const startServer = async () => {
  await connectMongoDB();

  const queueConsumer = new QueueConsumer();
  await queueConsumer.start();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`🚀 Audit Service running on port ${PORT}`);
  });
};

startServer();