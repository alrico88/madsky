import * as schema from '@root/schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
const queryClient = postgres(process.env.DATABASE_URL as string);

export default drizzle(queryClient, { schema });