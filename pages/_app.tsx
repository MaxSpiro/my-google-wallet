import { Layout, Navbar } from 'components'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div data-theme='forest'>
      <Navbar />
      <Component {...pageProps} />
      <Toaster position='top-center' />
    </div>
  )
}

export default MyApp
