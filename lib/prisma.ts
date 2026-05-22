import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  // 1. Initialize a Postgres connection pool
  const pool = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL })
  
  // 2. Wrap the pool in Prisma's Postgres Adapter
  const adapter = new PrismaPg(pool)
  
  // 3. Pass the adapter into the PrismaClient constructor
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma