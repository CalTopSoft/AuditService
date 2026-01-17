// controllers/AuditController.ts
import { Request, Response } from 'express';
import { AuditService } from '../services/AuditService';

export class AuditController {
  private auditService: AuditService;

  constructor(auditService: AuditService) {
    this.auditService = auditService;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const auditLog = await this.auditService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Audit log created',
        data: auditLog
      });
    } catch (error: any) {
      console.error('Error in audit create:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create audit log',
        error: error.message
      });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: any = {};
      
      // Filtros opcionales
      if (req.query.service) {
        filters.service = req.query.service;
      }
      if (req.query.action) {
        filters.action = req.query.action;
      }
      if (req.query.entityType) {
        filters.entityType = req.query.entityType;
      }
      if (req.query.entityId) {
        filters.entityId = req.query.entityId;
      }
      if (req.query.startDate || req.query.endDate) {
        filters.timestamp = {};
        if (req.query.startDate) {
          filters.timestamp.$gte = new Date(req.query.startDate as string);
        }
        if (req.query.endDate) {
          filters.timestamp.$lte = new Date(req.query.endDate as string);
        }
      }

      const logs = await this.auditService.findAll(filters);
      const total = await this.auditService.count();

      res.status(200).json({
        success: true,
        count: logs.length,
        total,
        data: logs
      });
    } catch (error: any) {
      console.error('Error in audit getAll:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve audit logs',
        error: error.message
      });
    }
  };

  // Para el endpoint que devuelve 1 (probablemente un health check)
  health = async (req: Request, res: Response): Promise<void> => {
    try {
      const count = await this.auditService.count();
      res.status(200).json({
        status: 'healthy',
        service: 'audit-service',
        database: 'connected',
        totalLogs: count,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        service: 'audit-service',
        database: 'disconnected',
        error: 'Database connection failed',
        timestamp: new Date().toISOString()
      });
    }
  };
}