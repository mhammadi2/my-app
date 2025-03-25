import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/prisma/db'
import bcrypt from 'bcryptjs'

/**
 * It’s often helpful to rename this to something more descriptive like "authOptions".
 * This also avoids potential name conflicts in other modules.
 */
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      /**
       * "id" can just remain "credentials", but if you want
       * something more meaningful, "password" is also an option.
       */
      id: 'credentials',
      name: 'Username and Password',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'Enter your username...',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password...',
        },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          /**
           * Return null to indicate that authorization has failed.
           * Alternatively, you can throw an Error which NextAuth can catch
           * and display as a flash message. E.g.:
           * throw new Error('Username or password not provided.')
           */
          return null
        }

        // Fetch the user from your database
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        })

        // Remove sensitive data from logs in production.
        // console.log('user:', user)

        if (!user) {
          // Return null or throw new Error('No user found') as you see fit.
          return null
        }

        // Compare the entered password with the stored (hashed) password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValidPassword) {
          // Return null or throw an error
          return null
        }

        // Return the user object if credentials are valid
        return user
      },
    }),
  ],
  callbacks: {
    /**
     * The jwt callback is triggered whenever a token is created or updated.
     * You can augment the token here with custom properties, like user roles.
     */
    async jwt({ token, account, user }) {
      // If there's an account, it’s a sign-in event.
      if (account && user) {
        // For example, store role in the token
        token.role = user.role
      }
      return token
    },
    /**
     * session callback is run whenever a session is checked,
     * which can happen frequently. We copy the token data (like role)
     * into the session user.
     */
    async session({ session, token }) {
      if (session.user) {
        // Provide a fallback in case token.role is undefined
        session.user.role = token.role || 'USER'
      }
      return session
    },
  },
  /**
   * Optionally set pages for signIn, signOut, error, etc.
   * e.g.:
   * pages: {
   *   signIn: '/auth/signin',
   *   error: '/auth/error', // Error code passed in query string as ?error=
   * },
   */
}

export default authOptions
