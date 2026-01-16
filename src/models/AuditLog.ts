import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  service: string;
  action: string;
  entityType: string;
  entityId: string;
  data: any;
  timestamp: Date;
}

const AuditLogSchema = new Schema({
  service: { type: String, required: true },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);