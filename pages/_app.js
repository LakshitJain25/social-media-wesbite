import '../styles/globals.css'
import Layout from '../components/Layout'
import { StoreProvider } from '../utils/Store'
import { AnimateSharedLayout } from 'framer-motion'
function MyApp({ Component, pageProps }) {
  return <StoreProvider>
    <AnimateSharedLayout>
      <Component {...pageProps} />
    </AnimateSharedLayout>
  </StoreProvider>
}

export default MyApp
