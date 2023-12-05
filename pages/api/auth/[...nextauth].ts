import { db, dbUsers } from "@/database";
import NextAuth, { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import { connect } from '../../../database/db';
import { User } from "@/models";
import { jwt } from "@/utils";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
  interface User {
    id?: string
    _id: string
  }
};


export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Email:', type: 'email', placeholder: 'email@google.com' },
        password: { label: 'Password:', type: 'password', placeholder: 'Password' },
      },
      async authorize(credentials) {

        const { email, password } = credentials!;

        return await dbUsers.checkUserEmailPassword(email, password);
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  // Custom pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  // Callbacks
  // Por defecto trabaja con JWT, debemos crear la env (NEXTAUTH_SECRET) con la misma firma de los tokens de autenticacion.
  jwt: {
    // secret: process.env.NEXTAUTH_SECRET, //deprecated
  },session: {
    maxAge: 2592000, //30d
    strategy: 'jwt',
    updateAge: 86400, //cada dìa
  },


  callbacks: {
    async jwt({ token, account, user }) {
      // console.log({ token, account, user })
      if (account) {
        token.accessToken = account.access_token  //Si el account existe = entonces crea el token.accesstoken = account.access_token

        switch (account.type) {                 //Si el account existe
          case 'oauth':                           // account.type = 'oauth' verificacion por app de 3ros Github, Google, Social Media
            token.user = await dbUsers.oAuthToDbUser(user.email || '', user.name || '');
            break;

          case 'credentials':                      // account.type = 'credentials'
            token.user = user;
            break;

          default:
            break;
        }
      }
      return token
    },

    async session({ session, token, user }) {
      session.accessToken = token.accessToken as string;
      session.user = token.user as any;
      return session
    },

  }
}

export default NextAuth(authOptions)