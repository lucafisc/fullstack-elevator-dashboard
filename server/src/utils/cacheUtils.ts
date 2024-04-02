import { clientRedis } from "../index";

const DEFAULT_CACHE_EXPIRATION = parseInt(
    process.env.DEFAULT_CACHE_EXPIRATION || "120"
  );

export function getOrSetCache(key: string, cb: () => any) {
    return new Promise(async (resolve, reject) => {
      const cachedValue = await clientRedis.get(key);
      if (cachedValue) {
        console.log("Cache hit for key:", key);
        return resolve(JSON.parse(cachedValue));
      }
      console.log("Cache miss for key:", key);
      const newValue = await cb();
      await clientRedis.set(key, JSON.stringify(newValue), {
        EX: DEFAULT_CACHE_EXPIRATION,
      });
      resolve(newValue);
    });
}

export async function clearCache(key: string) {
    console.log("Clearing cache for key:", key);
    await clientRedis.del(key);
}