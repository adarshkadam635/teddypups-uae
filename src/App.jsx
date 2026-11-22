import { useLayoutEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Footer, Header, MobileContactBar, WhatsApp } from './components/Layout.jsx'
import { PageTransition, usePageTransition } from './components/PageTransition.jsx'
import PawCursorTrail from './components/PawCursorTrail.jsx'
import { useSmoothWheel } from './components/useSmoothWheel.js'
import { useViewportMotion } from './components/useViewportMotion.js'
import { whatsapp } from './data/contact.js'
import Home from './pages/Home.jsx'
import { GoneHome, Puppies } from './pages/Catalog.jsx'
import PuppyDetail from './pages/PuppyDetail.jsx'
import { Contact, FAQ, HappyFamilies, HowItWorks, NotFound } from './pages/Information.jsx'

export default function App() {
  const currentLocation = useLocation()
  useSmoothWheel(currentLocation.pathname)
  const { location, phase } = usePageTransition(currentLocation)
  const { pathname, hash } = location
  useViewportMotion(pathname)
  const previousPath = useRef()
  useLayoutEffect(() => {
    const main = document.getElementById('main')
    const current = main.querySelector('h1')
    document.title = current ? current.innerText.replace(/\s+/g, ' ').trim() + ' | TeddyPups UAE' : 'TeddyPups UAE'
    const changedPage = previousPath.current !== pathname
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: changedPage ? 'instant' : 'auto' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
    if (previousPath.current && pathname !== previousPath.current && !hash) main.focus({ preventScroll: true })
    previousPath.current = pathname
  }, [pathname, hash])

  return <>
    <Header/>
    <main id="main" tabIndex={-1}>
      <Routes location={location}>
        <Route index element={<Home/>}/>
        <Route path="/puppies" element={<Puppies/>}/>
        <Route path="/puppies/:slug" element={<PuppyDetail/>}/>
        <Route path="/happy-families" element={<HappyFamilies/>}/>
        <Route path="/how-it-works" element={<HowItWorks/>}/>
        <Route path="/delivery" element={<Navigate to="/how-it-works#delivery" replace/>}/>
        <Route path="/faq" element={<FAQ/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/gone-home" element={<GoneHome/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </main>
    <PawCursorTrail />
    <PageTransition phase={phase} />
    <Footer story={pathname === '/'} staticBasket={['/puppies', '/happy-families', '/how-it-works', '/faq', '/contact'].includes(pathname)}/>
    {(pathname !== '/contact' || whatsapp) && <WhatsApp className="float"><span className="sr-only">Ask on WhatsApp</span></WhatsApp>}
    <MobileContactBar mascot={pathname === '/puppies'} />
  </>
}


