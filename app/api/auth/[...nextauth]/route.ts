/* This code snippet is importing the `NextAuth` module from the "next-auth" package and an `options`
object from a local file "./options". It then creates a `handler` function by passing the `options`
object to `NextAuth`. Finally, it exports the `handler` function twice, once as `GET` and once as
`POST`. This means that the `handler` function can be accessed using both `GET` and `POST` methods. */
import NextAuth from 'next-auth'
import options from './options'

const handler = NextAuth(options)

export { handler as GET, handler as POST }
