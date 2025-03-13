
import dotenv from "dotenv"
dotenv.config()
const JWT_SECRET: string = process.env.JWT_SECRET || 'defaultSecret';
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || 'defaultSecret';
const JWT_EXPIRE: string = process.env.JWT_EXPIRE || '1h';
export { JWT_SECRET, JWT_EXPIRE,REFRESH_TOKEN_SECRET };