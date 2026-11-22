import { useEffect, useState } from 'react'

import { Link, NavLink, useLocation } from 'react-router-dom'

import { X, PawPrint, MessageCircle, Moon, Sparkles } from 'lucide-react'

import { phone, whatsapp, whatsappLink } from '../data/contact.js'

import { PuppyIllustration, StoryStop } from './PuppyCompanion.jsx'



const nav = [

  ['/puppies', 'Available puppies'],

  ['/happy-families', 'Happy families'],

  ['/how-it-works', 'How it works'],

  ['/faq', 'FAQ'],

]



function Wordmark() {

  return <Link className="wordmark" to="/" aria-label="TeddyPups UAE home">

    <span className="wordmark-icon"><PawPrint size={21} aria-hidden="true" /></span><span>TeddyPups<small> UAE</small></span>

  </Link>

}



export function WhatsApp({ children = 'Ask on WhatsApp', message, className = 'button outline' }) {

  if (!whatsapp) return <Link className={className} to="/contact"><MessageCircle size={18} aria-hidden="true" />{className === 'float' ? <span className="sr-only">Contact TeddyPups</span> : 'Contact & enquiries'}</Link>

  return <a className={className} href={whatsappLink(message)} target="_blank" rel="noreferrer"><MessageCircle size={18} aria-hidden="true" />{children}</a>

}



function useHeaderScroll() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    function checkDirection() {
      const y = window.scrollY
      if (y < 108) setHidden(false)
      else if (Math.abs(y - lastY) >= 3) setHidden(y > lastY)
      lastY = y
    }
    window.addEventListener('scroll', checkDirection, { passive: true })
    return () => window.removeEventListener('scroll', checkDirection)
  }, [])

  return hidden
}

export function Header() {
  const [open, setOpen] = useState(false)
  const hidden = useHeaderScroll()
  const { key } = useLocation()
  useEffect(() => { setOpen(false) }, [key])
  const links = [['/', 'Home'], ...nav, ['/contact', 'Visit & contact']]

  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header className="site-header" data-scroll-hidden={hidden && !open ? true : undefined}>
      <div className="wrap header-inner" onKeyDown={event => {
        if (event.key === 'Escape' && open) {
          setOpen(false)
          document.getElementById('menu-toggle')?.focus()
        }
      }}>
        <Wordmark />
        <button id="menu-toggle" className="menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>
          {open ? <X size={18} aria-hidden="true" /> : <PawPrint size={18} aria-hidden="true" />}
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="site-navigation" aria-label="Main navigation" className={open ? 'navigation open' : 'navigation'}>
          <div className="navigation-links">
            {links.map(([path, label]) => <NavLink key={path} to={path} end={path === '/'}>
              {path === '/puppies' ? 'Puppies' : label}<PawPrint size={11} className="navigation-marker" aria-hidden="true" />
            </NavLink>)}
          </div>
          {whatsapp
            ? <a className="button header-contact" href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp us</a>
            : <Link className="button header-contact" to="/contact#contact-letter">Ask us a question</Link>}
        </nav>
      </div>
    </header>
  </>
}

export function Footer({ story, staticBasket }) {

  const SkyIcon = story || staticBasket ? Moon : Sparkles
  return <footer className={'site-footer' + (story || staticBasket ? ' story-footer' : '') + (staticBasket ? ' photo-footer' : '')}>
    <SkyIcon className="footer-glimmer" aria-hidden="true" />

    <div className="wrap footer-grid">

      <div>

        <Wordmark />

        <p>Puppy profiles, showroom visits and adoption enquiries in Downtown Dubai.</p>

        {(story || staticBasket) && <div className="footer-companion-space" aria-hidden="true">
          {story && <StoryStop scene="rest" />}
          <div className="footer-basket"><div className="basket-still"><PuppyIllustration /></div></div>
        </div>}

      </div>

      <nav aria-label="Explore"><h2>Explore</h2>{nav.map(([path, label]) => <Link key={path} to={path}>{label}</Link>)}</nav>

      <nav aria-label="Plan a visit"><h2>Plan a visit</h2><Link to="/contact">Visit &amp; contact</Link><Link to="/how-it-works#delivery">Delivery &amp; collection</Link><Link to="/gone-home">Gone home</Link></nav>

    </div>

    <div className="wrap footer-note">Listing data is a snapshot. Photos and videos are illustrative.</div>

  </footer>

}

export function MobileContactBar({ mascot }) {
  const telephone = phone.replace(/[^+\d]/g, '')

  return <nav className="mobile-contact-bar" aria-label="Quick contact">
    {mascot && <PuppyIllustration peek />}
    {whatsapp
      ? <a className="button mobile-message" href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp us</a>
      : <Link className="button mobile-message" to="/contact#contact-letter">Write an enquiry</Link>}
    {telephone
      ? <a className="button mobile-call" href={'tel:' + telephone}>Call</a>
      : <Link className="button mobile-call" to="/contact#visit">Visit us</Link>}
  </nav>
}



export function PageHeading({ label, title, children }) {

  return <header className="page-heading">

    <div className="wrap">

      {label && <p className="eyebrow">{label}</p>}

      <h1>{title}</h1>

      {children && <div className="lede">{children}</div>}

    </div>

  </header>

}



export function SectionHeading({ title, children }) {

  return <div className="section-heading"><h2>{title}</h2>{children}</div>

}



export function StepList({ items, motion }) {

  return <ol className="steps">{items.map(([title, description]) => <li key={title} data-motion={motion}><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>

}

