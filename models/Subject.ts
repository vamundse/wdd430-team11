import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export type SubjectStatus = "in_progress" | "completed" | "dropped";

export interface ISubject extends Document {
  userId: Types.ObjectId;
  name: string; // ex: "Database Systems"
  code: string; // ex: "CS 340"
  instructor?: string;
  color: string; // hex, ex: "#2f5fe0"
  status: SubjectStatus;
  progress: number; // 0-100
  startDate?: Date;
  endDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // acelera queries filtrando por usuário
    },
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Subject code is required"],
      trim: true,
    },
    instructor: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: "#2f5fe0",
    },
    status: {
      type: String,
      enum: ["in_progress", "completed", "dropped"],
      default: "in_progress",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    startDate: Date,
    endDate: Date,
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

export const Subject =
  models.Subject || model<ISubject>("Subject", SubjectSchema);
