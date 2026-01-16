import * as amqp from 'amqplib';
import { AuditService } from '../services/AuditService';
import * as dotenv from 'dotenv';

dotenv.config();

export class QueueConsumer {
  private auditService: AuditService;
  private connection: any = null;
  private channel: any = null;

  constructor() {
    this.auditService = new AuditService();
  }

  async start(): Promise<void> {
    try {
      const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
      
      this.connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();

      const exchange = 'audit-exchange';
      await this.channel.assertExchange(exchange, 'topic', { durable: true });

      const queue = 'audit-queue';
      await this.channel.assertQueue(queue, { durable: true });

      await this.channel.bindQueue(queue, exchange, 'audit.#');

      console.log('✅ Queue consumer started, waiting for messages...');

      this.channel.consume(queue, async (msg: any) => {
        if (msg && this.channel) {
          try {
            const content = JSON.parse(msg.content.toString());
            await this.auditService.create(content);
            this.channel.ack(msg);
          } catch (error) {
            console.error('Error processing message:', error);
            this.channel.nack(msg, false, false);
          }
        }
      });
    } catch (error) {
      console.warn('⚠️  RabbitMQ not available for audit service');
    }
  }

  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}