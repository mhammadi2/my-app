import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

/* The `declare global` block in TypeScript is used to extend the global scope with custom types or
interfaces. In this specific case, `declare global` is declaring a global variable `prisma` with a
type of `undefined` or the return type of the `prismaClientSingleton` function. */
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

/* This line of code is initializing a constant variable `prisma` by checking if `globalThis.prisma` is
defined. If `globalThis.prisma` is defined (not null or undefined), then `prisma` is assigned the
value of `globalThis.prisma`. If `globalThis.prisma` is not defined, then `prisma` is assigned the
return value of the `prismaClientSingleton` function, effectively creating a new instance of the
Prisma client. This approach ensures that `prisma` is either set to an existing instance of the
Prisma client or creates a new instance if one does not already exist. */
const prisma = globalThis.prisma ?? prismaClientSingleton()

/* The line `export default prisma;` is exporting the `prisma` variable as the default export of the
module. This means that when another module imports this module, they can import `prisma` directly
as the default export without needing to specify its name. For example, in another module, you could
import `prisma` like this: */
export default prisma

/* This line of code `if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;` is a
conditional statement that checks the value of the `NODE_ENV` environment variable. */
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
