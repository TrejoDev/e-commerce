import { NextResponse, type NextRequest } from 'next/server'
// import * as jose from 'jose';  //Libreria que sirve de soporte a jwt, puesto que esta presenta problema con los middlewares.
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
 
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const requestedPage = req.nextUrl.pathname;
  const validRoles = ['admin', 'super-user', 'SEO'];

  if( !session ){
      const url = req.nextUrl.clone();

      url.pathname = `/auth/login`;
      url.search = `p=${ requestedPage }`;
      
      if( requestedPage.includes('/api') ){
        return new Response( JSON.stringify({ message: 'No autorizado' }),{
          status: 401,
          headers:{
            'Content-Type':'application/json'
          }
        });
      };

      return NextResponse.redirect( url );
  };

  if( requestedPage.includes('/api/admin') && !validRoles.includes( session.user.role ) ){

    return new Response( JSON.stringify({ message: 'No autorizado' }),{
      status: 401,
      headers:{
        'Content-Type':'application/json'
      }
      });
  };

  if( requestedPage.includes('/admin') && !validRoles.includes( session.user.role ) ){
    return NextResponse.redirect(new URL('/', req.url));
  };

  return NextResponse.next();
};

export const config = {
  matcher: [
    '/checkout/:path*',
    '/orders/:path*',
    '/api/orders/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};