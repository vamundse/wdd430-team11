import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function getUserByEmail(email: string) {
  await connectToDatabase();
  return User.findOne({ email: email.toLowerCase() })
    .select('+passwordHash') // pede o campo que fica escondido por padrão
    .lean();
}