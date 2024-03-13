import * as schema from '@root/schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
const queryClient = postgres(import.meta.env.DATABASE_URL);

export default drizzle(queryClient, { schema });