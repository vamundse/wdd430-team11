import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export type EventType = "class" | "exam" | "meeting" | "deadline";

export interface IEvent extends Document {
  userId: Types.ObjectId;
  subjectId?: Types.ObjectId; // opcional: nem todo evento precisa de disciplina (ex: reunião geral)
  title: string;
  type: EventType;
  date: Date;
  time?: string; // ex: "14:00"
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["class", "exam", "meeting", "deadline"],
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    time: String,
  },
  { timestamps: true }
);

EventSchema.index({ userId: 1, date: 1 });

export const Event = models.Event || model<IEvent>("Event", EventSchema);
