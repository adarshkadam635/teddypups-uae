import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowDown, ClipboardCheck, Heart, HeartHandshake, Mail, MapPin, MessageCircleQuestionMark, PawPrint, Phone, Plane, Search, ShieldCheck, Truck } from 'lucide-react'
import { PageHeading, SectionHeading, WhatsApp } from '../components/Layout.jsx'
import FAQAccordion from '../components/FAQAccordion.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'
import { FamilyGallery } from '../components/Gallery.jsx'
import { Photo } from '../components/PuppyCard.jsx'
import { PuppyIllustration } from '../components/PuppyCompanion.jsx'
import { FlightScene, ShowroomScene } from '../components/AdoptionRoutes.jsx'
import { faqs, journeys } from '../data/content.js'
import { familyIntroPhoto, familyPhotos, visitPhoto } from '../data/photos.js'
import { email, map, phone, whatsapp } from '../data/contact.js'

export function FAQ() {
  const [query, setQuery] = useState('')
  const words = query.toLowerCase().trim().split(/\s+/)
  const entries = faqs.filter(entry => words.every(word => entry.join(' ').toLowerCase().includes(word)))
  return <section className="faq-page" aria-labelledby="faq-title">
    <div className="wrap">
      <header className="faq-page-heading">
        <h1 id="faq-title">Questions<br className="faq-title-break" /> <em>&amp; answers</em></h1>
        <p>Find answers about meeting a puppy, checking health records, and arranging delivery or import.</p>
      </header>
      <div className="faq-layout">
        <aside className="faq-tools" aria-label="Find or ask a question">
          <label className="faq-search">Search questions <span><Search size={19} aria-hidden="true" /><input type="search" placeholder="Try vaccination or delivery" value={query} onChange={event => setQuery(event.target.value)} /></span></label>
          <p className="faq-count" role="status">{entries.length} {entries.length === 1 ? 'question' : 'questions'}</p>
          <div className="faq-help">
            <div className="faq-help-mascot" aria-hidden="true"><PuppyIllustration /><MessageCircleQuestionMark size={24} /></div>
            <h2>Have another question?</h2>
            {whatsapp ? <WhatsApp className="button primary">Ask on WhatsApp</WhatsApp> : <Link className="button primary" to="/contact#contact-letter">Ask us a question</Link>}
          </div>
        </aside>
        <div className="faq-board">
          {entries.length ? <FAQAccordion entries={entries} noticeboard /> : <div className="empty"><h2>No questions match</h2><p>Try a different search term.</p><button className="button outline" type="button" onClick={() => setQuery('')}>Clear search</button></div>}
        </div>
      </div>
    </div>
  </section>
}

export function FamilyStory({ scrapbook = false }) {
  return <figure className="testimonial" data-motion="family-note">
    {scrapbook && <PawPrint className="family-note-paw" size={20} aria-hidden="true" />}
    <blockquote>Sarah M. said her Maltipoo arrived healthy, and the regular updates and support helped her feel at ease during the import process.</blockquote>
    <figcaption>Sarah M., Dubai · Summary of a testimonial published by TeddyPups</figcaption>
  </figure>
}

export function HappyFamilies() {
  return <div className="families-page">
    <header className="wrap family-intro">
      <div className="family-intro-copy">
        <p className="eyebrow">Life after adoption</p>
        <h1>Happy <em>families</em></h1>
        <p className="lede">First cuddles, favorite walks, and all the little moments that make a dog part of the family.</p>
        <a className="button outline" href="#family-gallery">Explore the photo wall <ArrowDown size={17} aria-hidden="true" /></a>
      </div>
      <figure className="family-cover" data-motion="family-cover">
        <Photo photo={familyIntroPhoto} loading="eager" />
        <figcaption>Illustrative photograph</figcaption>
        <Heart className="family-cover-heart" size={25} aria-hidden="true" />
      </figure>
      <FamilyStory scrapbook />
    </header>
    <section id="family-gallery" className="wrap section family-board" aria-label="Family gallery">
      <SectionHeading title="Family gallery"><p className="meta">{familyPhotos.length} illustrative photographs</p></SectionHeading>
      <FamilyGallery photos={familyPhotos} />
      <div className="family-wall-ending" data-motion="family-ending">
        <PuppyIllustration />
        <Link className="text-link" to="/puppies">Meet the puppies</Link>
      </div>
    </section>
  </div>
}

export function Contact() {
  const [params] = useSearchParams()
  return <section className="contact-page" aria-labelledby="contact-title">
    <div className="wrap contact-layout">
      <div className="contact-intro">
        <p className="eyebrow">Visit &amp; contact</p>
        <h1 id="contact-title">Get in touch<br className="contact-title-break" /> <em>with us</em></h1>
        <div className="contact-direct">
          {whatsapp ? <WhatsApp className="button primary">Message us on WhatsApp</WhatsApp> : <a className="button primary" href="#contact-letter">Write an enquiry</a>}
          {phone && <a href={'tel:' + phone.replace(/[^+\d]/g, '')}><Phone size={18} aria-hidden="true" />{phone}</a>}
          {email && <a href={'mailto:' + email}><Mail size={18} aria-hidden="true" />{email}</a>}
        </div>
      </div>
      <p className="contact-lede">Ask us about a puppy, plan a showroom visit, or tell us what you’d like to know about bringing your new best friend home.</p>
      <div className="contact-letter" id="contact-letter" tabIndex={-1}>
        <div className="contact-stamp" aria-hidden="true" data-motion="postmark"><PawPrint size={26} /></div>
        <h2 className="sr-only">Write us a letter</h2>
        <EnquiryForm key={params.get('puppy') ?? ''} selected={params.get('puppy')}/>
        <div className="contact-letter-puppy" aria-hidden="true"><PuppyIllustration /></div>
      </div>
      <aside className="contact-aside" id="visit">
        <div>
          <h2>Visit us in Downtown Dubai</h2>
          <p>Check puppy availability before making a trip to the showroom.</p>
          <a className="button outline" href={map} target="_blank" rel="noreferrer"><MapPin size={17} aria-hidden="true" />Open in Google Maps<span className="sr-only"> for Downtown Dubai</span></a>
        </div>
        <Photo photo={visitPhoto} />
      </aside>
    </div>
  </section>
}

const guideLinks = [['two-ways', 'Two ways home', MapPin], ['promise', 'Our puppy promise', ShieldCheck], ['delivery', 'Delivery & collection', Truck], ['why', 'Why choose us', HeartHandshake]]
const delivery = [
  ['Showroom collection', 'Ask whether the puppy is already in Dubai and confirm an appointment before travelling.'],
  ['Delivery within Dubai', 'Discuss the handover location, timing and transport arrangements for your address.'],
  ['International cargo', 'Confirm the veterinary checks, paperwork and transport conditions for each journey.'],
  ['Worldwide delivery', 'Ask whether your destination is served and what import requirements apply.'],
]

const stepIcons = [Search, Heart, ClipboardCheck, Truck]

const puppyPromise = [
  [HeartHandshake, 'Breeder background', 'Ask where your puppy was raised and how they have been cared for.'],
  [ClipboardCheck, 'Health records', 'Request recent photos, videos and veterinary records before you decide.'],
  [Plane, 'Travel arrangements', 'Review the route, paperwork and handover plans with the team.'],
]

const guideSupport = [
  [Plane, 'Travel coordination', 'Discuss transport options and required documents before booking.'],
  [HeartHandshake, 'Help settling in', 'Ask the team for follow-up guidance on food, training and the first few days at home.'],
  [ShieldCheck, 'Veterinary information', 'Review the puppy’s health certificate, vaccination record and care history.'],
]

const journeyOptions = [
  {
    id: 'local',
    label: 'In Dubai',
    subtitle: 'Meet in person',
    title: 'Meet your puppy in person',
    description: 'Check which puppies are already in Dubai and arrange a showroom visit before making your decision.',
    browse: 'Browse local puppies',
    Icon: MapPin,
  },
  {
    id: 'imported',
    label: 'Imported',
    subtitle: 'Order upon request',
    title: 'Order upon request',
    description: 'Tell us which breed you are looking for and discuss availability, veterinary records, and travel arrangements.',
    browse: 'Browse imported puppies',
    Icon: Plane,
  },
]

function JourneyTabs() {
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const tabs = useRef([])
  const selected = new URLSearchParams(search).get('journey') === 'imported' ? 1 : 0

  function select(index) {
    if (index === selected) return
    const params = new URLSearchParams(search)
    if (index === 1) params.set('journey', 'imported')
    else params.delete('journey')
    const query = params.toString()
    navigate({ pathname, search: query ? '?' + query : '', hash }, { preventScrollReset: true })
  }

  function handleTabKey(event, current) {
    const targets = { ArrowLeft: 1 - current, ArrowRight: 1 - current, Home: 0, End: 1 }
    const index = targets[event.key]
    if (typeof index !== 'number') return
    event.preventDefault()
    select(index)
    tabs.current[index]?.focus({ preventScroll: true })
  }

  return <section id="two-ways">
    <div className="journey-heading">
      <h2 id="two-ways-title">Two ways <em>home</em></h2>
      <div className="journey-switch" role="tablist" aria-labelledby="two-ways-title">
        {journeyOptions.map(({ id, label, subtitle, Icon }, index) => <button
          key={id}
          ref={element => { tabs.current[index] = element }}
          type="button"
          id={'journey-tab-' + id}
          role="tab"
          aria-selected={selected === index}
          aria-controls={'journey-panel-' + id}
          tabIndex={selected === index ? 0 : -1}
          onClick={() => select(index)}
          onKeyDown={event => handleTabKey(event, index)}
        ><Icon className="journey-tab-icon" size={18} aria-hidden="true" /><strong>{label}</strong><span>{subtitle}</span></button>)}
      </div>
    </div>
    {journeyOptions.map(({ id, title, description, browse, Icon }, index) => <div
      key={id}
      id={'journey-panel-' + id}
      role="tabpanel"
      aria-labelledby={'journey-tab-' + id}
      tabIndex={0}
      hidden={selected !== index}
      className="journey-panel" data-motion="guide-steps"
    >
      <div className="journey-intro">
        <Icon size={30} aria-hidden="true" />
        <h3>{title}</h3>
        <p>{description}</p>
        <Link to={'/puppies?origin=' + id} className="text-link">{browse}</Link>
      </div>
      <div className="guide-journey-scene">{id === 'local' ? <ShowroomScene skylineOnly /> : <FlightScene />}</div>
      <ol className="guide-step-cards">
        {journeys[id].map(([title, text], index) => {
          const StepIcon = stepIcons[index]
          return <li key={title}>
            <span className="guide-step-icon"><StepIcon size={21} aria-hidden="true" /></span>
            <span className="guide-step-number">Step {index + 1}</span>
            <h4>{title}</h4>
            <p>{text}</p>
          </li>
        })}
      </ol>
    </div>)}
  </section>
}

export function HowItWorks() {
  return <div className="adoption-guide">
    <header className="wrap guide-opening">
      <div>
        <p className="eyebrow">The adoption guide</p>
        <h1>How it <em>works</em></h1>
        <p className="lede">From the first hello to the trip home, see how to meet a puppy in Dubai or welcome one from overseas.</p>
      </div>
      <div className="guide-postcard" aria-hidden="true" data-motion="guide-postcard">
        <span className="guide-postcard-route" />
        <Plane className="guide-postcard-plane" size={22} />
        <span className="guide-postcard-stamp"><Heart size={20} /></span>
        <PuppyIllustration />
      </div>
    </header>
    <div className="wrap guide-layout section">
      <nav aria-label="On this page" className="guide-nav"><h2>On this page</h2>{guideLinks.map(([id, label, Icon]) => <a key={id} href={'#' + id}><Icon size={16} aria-hidden="true" />{label}</a>)}</nav>
      <div className="guide-body">
        <JourneyTabs />
        <section id="promise" className="guide-passport" data-motion="guide-passport">
          <p className="guide-handwritten">Puppy passport</p>
          <h2>Our premium puppy promise</h2>
          <ul className="guide-stamps">{puppyPromise.map(([Icon, title, text]) => <li key={title}>
            <div className="guide-stamp"><Icon size={22} aria-hidden="true" /><h3>{title}</h3></div>
            <p>{text}</p>
          </li>)}</ul>
        </section>
        <section id="delivery" className="guide-split guide-delivery">
          <div>
            <h2>Delivery &amp; collection</h2>
            <div className="details-grid">{delivery.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
          </div>
          <FlightScene withSkyline />
        </section>
        <section id="why" className="guide-split guide-support">
          <div><h2>Why choose us</h2><p>From choosing a puppy to the first days at home, the team can help you prepare for each step.</p></div>
          <ul>{guideSupport.map(([Icon, title, text]) => <li key={title} className="feature-row"><Icon size={24} aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></li>)}</ul>
        </section>
        <section className="guide-sendoff">
          <div><h2>Ready to meet your puppy?</h2><p>Browse the puppies or get in touch about a visit, delivery, or what to expect next.</p>
            <div className="actions"><WhatsApp className="button primary">Ask on WhatsApp</WhatsApp><Link className="button outline" to="/puppies">See available puppies</Link></div>
          </div>
          <PuppyIllustration />
        </section>
      </div>
    </div>
  </div>
}

export function NotFound() {
  return <PageHeading title="Page not found"><p>That page or puppy profile is unavailable.</p><Link to="/puppies" className="button primary">Browse available puppies</Link></PageHeading>
}
