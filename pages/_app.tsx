import type { AppProps } from 'next/app'
import { ThemeProvider } from '@emotion/react'
import { SessionProvider } from "next-auth/react"
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SWRConfig } from 'swr';

import '@/styles/globals.css'
import { lightTheme } from '../themes/light-theme';
import { CssBaseline } from '@mui/material';
import { UiProvider , CartProvider, AuthProvider} from '@/context';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{ clientId : process.env.NEXT_PUBLIC_PAYPAL_CLIENT || '' }}>
        <SWRConfig 
          value={{
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
          }}
        >
          <AuthProvider>
            <CartProvider>
              <UiProvider>
                <ThemeProvider theme={ lightTheme }>
                  <CssBaseline />
                  <Component {...pageProps} />
                </ThemeProvider>
              </UiProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  
  )
}
