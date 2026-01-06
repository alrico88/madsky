import * as schema from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const runtimeConfig = useRuntimeConfig();

const queryClient = postgres(runtimeConfig.databaseUrl as string);

export default drizzle(queryClient, { schema });
