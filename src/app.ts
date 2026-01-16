import express from 'express';
import { AuditService } from './services/AuditService';

export const createApp = () => {
  const app = express();
  const auditService = new AuditService();

  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'audit-service' });
  });

  app.get('/api/audit', async (req, res) => {
    try {
      const logs = await auditService.findAll(req.query);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching audit logs' });
    }
  });

  app.post('/api/audit', async (req, res) => {
    try {
      await auditService.create(req.body);
      res.status(201).json({ message: 'Audit log created' });
    } catch (error) {
      res.status(500).json({ error: 'Error creating audit log' });
    }
  });

  return app;
};