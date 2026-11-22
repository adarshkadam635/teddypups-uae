import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, Heart, House, MapPin, PawPrint, Plane, ShieldCheck } from 'lucide-react'
import { SectionHeading, StepList, WhatsApp } from '../components/Layout.jsx'
import { Photo } from '../components/PuppyCard.jsx'
import PuppyDoor from '../components/PuppyDoor.jsx'
import { FamilyGallery } from '../components/Gallery.jsx'
import FAQAccordion from '../components/FAQAccordion.jsx'
import PuppyShowcase from '../components/PuppyShowcase.jsx'
import HeroPortraits from '../components/HeroPortraits.jsx'
import AdoptionRoutes from '../components/AdoptionRoutes.jsx'
import { PuppyCompanion, StoryStop, usePuppyStory } from '../components/PuppyCompanion.jsx'
import { faqs, healthItems } from '../data/content.js'
import { familyPhotos, heroPhoto, visitPhoto } from '../data/photos.js'
import { FamilyStory } from './Information.jsx'

const steps = [
  ['Find a breed you love', 'Browse the available puppies and open a profile to see the listing details.'],
  ['Ask for photos and records', 'Confirm availability, health information and a meeting or reservation.'],
  ['Plan their arrival', 'Discuss collection, delivery or the requirements for an import.'],
]

function JourneyPhone() {
  return <div className="journey-phone" data-motion="journey-phone" aria-label="Example enquiry">
    <div className="journey-phone-header"><PawPrint size={18} aria-hidden="true" /> TeddyPups UAE</div>
    <div className="journey-chat">
      <p>Can I arrange a visit to meet a puppy?</p>
      <p>Tell us which puppy you have in mind and when you would like to visit.</p>
      <div className="journey-chat-media"><Photo photo={visitPhoto} /></div>
      <div className="journey-route" aria-hidden="true"><MapPin /><span className="journey-route-line"><Plane /></span><House /></div>
    </div>
    <WhatsApp>Message us on WhatsApp</WhatsApp>
  </div>
}

function WelcomeHome() {
  return <section className="closing welcome-home">
    <div className="wrap">
      <h2>Ready to meet your new best friend?</h2>
      <p>Browse the catalog or ask about a visit to the showroom.</p>
      <figure className="welcome-porch" data-motion="welcome-door" aria-hidden="true">
        <StoryStop scene="closing" />
        <div className="welcome-door">
          <Photo photo={heroPhoto} alt="" />
          <PuppyDoor />
        </div>
        <span className="porch-light" />
        <span className="porch-planter" />
        <span className="welcome-mat">Welcome home</span>
      </figure>
      <div className="actions"><Link className="button light" to="/puppies">View available puppies</Link><Link className="button outline" to="/contact">Visit &amp; contact</Link></div>
    </div>
  </section>
}

export default function Home() {
  const root = useRef(null)
  const mascot = useRef(null)
  const trail = useRef(null)
  const greetPortrait = usePuppyStory(root, mascot, trail)

  return <div ref={root} className="story-home">
    <PuppyCompanion mascot={mascot} trail={trail} />
    <div className="hero-band"><section className="wrap hero">
      <StoryStop scene="welcome" />
      <div className="hero-paw-path" aria-hidden="true">
        <PawPrint /><PawPrint /><PawPrint /><PawPrint /><PawPrint />
      </div>
      <div className="hero-copy">
        <p className="eyebrow"><span className="hero-small-copy"><MapPin size={15} aria-hidden="true" /> Teacup puppies in Dubai</span><span className="hero-wide-copy">Little paws, big love</span></p>
        <h1><span className="hero-small-copy"><span>Love at</span> <em>first sniff.<Heart className="hero-title-heart" aria-hidden="true" /></em></span><span className="hero-wide-copy">Teacup puppies<br /> at home in Dubai</span></h1>
        <p className="hero-text"><span className="hero-small-copy">Find a little face you love, plan a showroom visit in Downtown Dubai, or ask about bringing a puppy home from overseas.</span><span className="hero-wide-copy">Meet your new best friend in our Dubai showroom, or ask about bringing home a puppy from overseas.</span></p>
        <div className="actions"><Link className="button primary" to="/puppies"><span className="hero-small-copy">Meet the puppies <ArrowUpRight size={18} aria-hidden="true" /></span><span className="hero-wide-copy">View available puppies</span></Link><WhatsApp>Enquire on WhatsApp</WhatsApp></div>
      </div>
      <HeroPortraits onPreview={greetPortrait} />
    </section></div>
    <PuppyShowcase />
    <AdoptionRoutes />
    <section className="section green-wash story-journey">
      <StoryStop scene="journey" />
      <div className="wrap editorial">
        <div>
          <h2>Your puppy journey</h2>
          <StepList items={steps} motion="journey-step" />
          <Link className="text-link" to="/how-it-works">See how it works</Link>
        </div>
        <JourneyPhone />
      </div>
    </section>
    <section className="section health-home">
      <StoryStop scene="health" />
      <div className="wrap health-passport" data-motion="passport">
        <div className="passport-intro"><ShieldCheck size={36} aria-hidden="true" /><h2>Health &amp; veterinary records</h2><p>Check each puppy’s health information and discuss their ongoing care.</p></div>
        <ul className="check-list">{healthItems.map(item => <li key={item}><Check size={20} aria-hidden="true"/>{item}</li>)}</ul>
      </div>
    </section>
    <section className="section soft story-families"><div className="wrap">
      <StoryStop scene="families" />
      <SectionHeading title="Happy families & puppies"><Link className="text-link" to="/happy-families">Explore the family gallery</Link></SectionHeading>
      <FamilyStory />
      <FamilyGallery photos={familyPhotos} preview />
    </div></section>
    <section className="section story-faq">
      <StoryStop scene="faq" />
      <div className="wrap" data-motion="night-faq">
        <SectionHeading title="Questions, answered"><Link className="text-link" to="/faq">Read all questions</Link></SectionHeading>
        <FAQAccordion entries={faqs.slice(0, 3)} initiallyOpen />
      </div>
    </section>
    <div className="story-closing" data-motion="dusk"><StoryStop scene="closing" /><WelcomeHome /></div>
  </div>
}

