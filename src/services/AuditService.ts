// services/AuditService.ts
import { AuditLog } from '../models/AuditLog';

export class AuditService {
  async create(data: any): Promise<any> {
    try {
      const auditLog = await AuditLog.create(data);
      console.log('✅ Audit log created:', data.action, { id: auditLog._id });
      return auditLog;
    } catch (error: any) {
      console.error('❌ Error creating audit log:', error.message);
      throw error;
    }
  }

  async findAll(filters?: any): Promise<any[]> {
    try {
      const logs = await AuditLog.find(filters || {})
        .sort({ timestamp: -1 })
        .limit(100)
        .lean();
      
      console.log(`📊 Found ${logs.length} audit logs`);
      return logs;
    } catch (error: any) {
      console.error('❌ Error finding audit logs:', error.message);
      throw error;
    }
  }

  async count(): Promise<number> {
    return await AuditLog.countDocuments();
  }
}
