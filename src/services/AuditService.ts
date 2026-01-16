import { AuditLog } from '../models/AuditLog';

export class AuditService {
  async create(data: any): Promise<void> {
    try {
      await AuditLog.create(data);
      console.log('✅ Audit log created:', data.action);
    } catch (error) {
      console.error('Error creating audit log:', error);
    }
  }

  async findAll(filters?: any) {
    return await AuditLog.find(filters).sort({ timestamp: -1 }).limit(100);
  }
}