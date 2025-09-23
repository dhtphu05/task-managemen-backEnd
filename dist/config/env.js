import dotenv from 'dotenv';
dotenv.config();
const get = (key, fallback) => {
    const v = process.env[key] ?? fallback;
    if (v === undefined)
        throw new Error(`Missing env: ${key}`);
    return v;
};
export const env = {
    NODE_ENV: get('NODE_ENV', 'development'),
    PORT: Number(get('PORT', '4000')),
};
//# sourceMappingURL=env.js.map