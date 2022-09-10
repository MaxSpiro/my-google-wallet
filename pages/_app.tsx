import { Layout, Navbar } from 'components'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'
import { createOvermind } from 'overmind'
import * as React from 'react'
import { Provider as OvermindProvider } from 'overmind-react'
import { config } from '../lib/overmind'

const overmind = createOvermind(config)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <OvermindProvider value={overmind}>
      <div data-theme='forest'>
        <Navbar />
        <Component {...pageProps} />
        <Toaster position='top-center' />
      </div>
    </OvermindProvider>
  )
}

export default MyApp
