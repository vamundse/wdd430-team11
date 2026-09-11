import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string; // opcional se usar Clerk/Auth.js com provider externo
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      select: false, // nunca retorna esse campo em queries por padrão
    },
    image: {
      type: String,
    },
  },
  { timestamps: true } // cria createdAt e updatedAt automaticamente
);

// Evita recriar o model em hot reload (comum em Next.js dev mode)
export const User = models.User || model<IUser>("User", UserSchema);
