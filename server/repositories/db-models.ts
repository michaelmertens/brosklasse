import * as mongoose from 'mongoose';

export interface IRegistration {
  _id: string;
  code: string;
  email?: string;
  registeredAt?: Date;
  createdBy?: string;
  reservedFor?: string;

  createdAt?: Date;
  updatedAt?: Date;
  tracking?: {
    openedPageAt?: Date;
    nrOfNoClick?: number;
  }
}

const registrationTrackingSchema = new mongoose.Schema({
  openedPageAt: { type: Date },
  nrOfNoClick: { type: Number },
});

export const registrationSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  email: { type: String },
  registeredAt: { type: Date },
  createdBy: { type: String },
  reservedFor: { type: String },

  tracking: registrationTrackingSchema,
}, {
  timestamps: true,
});
