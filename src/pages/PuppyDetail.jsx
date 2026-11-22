import { Link, useParams } from 'react-router-dom'
import { Check, ChevronLeft } from 'lucide-react'
import { availablePuppies, adoptedPuppies } from '../data/puppies.js'
import { healthItems, journeys } from '../data/content.js'
import { PuppyGallery } from '../components/Gallery.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'
import { StepList, WhatsApp } from '../components/Layout.jsx'
import { NotFound } from './Information.jsx'

export default function PuppyDetail() {
  const { slug } = useParams()
  const list = availablePuppies.some(puppy => puppy.slug === slug) ? availablePuppies : adoptedPuppies
  const index = list.findIndex(puppy => puppy.slug === slug)
  if (index < 0) return <NotFound />
  const puppy = list[index]
  const previous = list[(index - 1 + list.length) % list.length]
  const next = list[(index + 1) % list.length]
  const facts = [['Breed', puppy.breed], ['Boy or girl', puppy.gender], ['Age at listing', puppy.age], ['Location', puppy.origin === 'local' ? 'In Dubai' : 'Imported for you']]

  return <article className="wrap section profile" key={slug}>
    <nav aria-label="Breadcrumb" className="breadcrumb"><Link to={puppy.adopted ? '/gone-home' : '/puppies'}><ChevronLeft size={15} aria-hidden="true" />{puppy.adopted ? 'Gone home' : 'Available puppies'}</Link><span>/</span><span aria-current="page">{puppy.name}</span></nav>
    <div className="profile-hero">
      <PuppyGallery puppy={puppy} />
      <div className="profile-copy">
        <span className="status inline" data-motion="profile-tag">{puppy.adopted ? 'Gone home' : 'Available'}</span>
        <h1>{puppy.name}</h1>
        {puppy.name !== puppy.breed && <p className="lede">{puppy.breed}</p>}
        <dl className="facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <div className="actions"><WhatsApp className="button primary" message={'Hello, I would like to ask about ' + (puppy.adopted ? 'a puppy like ' : '') + puppy.name + ' (' + puppy.slug + ').'}>{puppy.adopted ? 'Ask about a puppy like this' : 'Ask on WhatsApp'}</WhatsApp><a href="#enquiry" className="button outline">Send an enquiry</a></div>
      </div>
    </div>
    <section className="profile-panel" aria-labelledby="health-heading" data-motion="check">
      <h2 id="health-heading">Health &amp; vaccination</h2>
      <p>Ask to review the puppy’s health records before arranging a handover.</p>
      <ul className="check-list">{healthItems.map(item => <li key={item}><Check size={19} aria-hidden="true"/>{item}</li>)}</ul>
    </section>
    {!puppy.adopted && <section className="profile-panel"><h2>{puppy.origin === 'imported' ? 'Coming home from abroad' : 'Meeting in Dubai'}</h2><StepList items={journeys[puppy.origin]} /></section>}
    <section id="enquiry" className="profile-panel enquiry-panel">
      <h2>{puppy.adopted ? 'Looking for a puppy like this?' : 'Ask about ' + puppy.name}</h2>
      <EnquiryForm puppy={puppy}/>
    </section>
    <nav className="profile-neighbors" aria-label="More puppy profiles">
      <Link to={'/puppies/' + previous.slug}><span>Previous puppy</span><strong>{previous.name}</strong></Link>
      <Link to={'/puppies/' + next.slug}><span>Next puppy</span><strong>{next.name}</strong></Link>
    </nav>
  </article>
}
