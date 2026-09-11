import mongoose, { Schema, models, model, Document, Types } from "mongoose";

export type TaskStatus = "pending" | "in_progress" | "completed" | "overdue";
export type TaskPriority = "low" | "medium" | "high";

export interface ITask extends Document {
  userId: Types.ObjectId;
  subjectId: Types.ObjectId;
  title: string;
  description?: string;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
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
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "overdue"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    completedAt: Date,
  },
  { timestamps: true }
);

// Índice composto: acelera "buscar tarefas de um usuário ordenadas por prazo"
TaskSchema.index({ userId: 1, dueDate: 1 });

export const Task = models.Task || model<ITask>("Task", TaskSchema);
