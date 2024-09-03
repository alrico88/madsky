import { createStorage } from "unstorage";
import redisDriver from "unstorage/drivers/redis";

export const madskyCache = createStorage({
  driver: redisDriver({
    base: "madsky",
    host: process.env.REDIS_HOST,
    db: Number(process.env.REDIS_DB),
    password: process.env.REDIS_PASS,
    port: Number(process.env.REDIS_PORT),
  }),
});
