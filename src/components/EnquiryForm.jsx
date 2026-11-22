import { useState } from 'react'
import { email } from '../data/contact.js'
import { availablePuppies } from '../data/puppies.js'

export default function EnquiryForm({ puppy, selected }) {
  const [draft, setDraft] = useState('')
  const [message, setMessage] = useState('')
  const letter = !puppy

  function prepareDraft(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const name = fields.get('name').trim()
    const phone = fields.get('phone').trim()
    const location = fields.get('location').trim()
    const digits = phone.replace(/\D/g, '')
    if (!name || !/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15) {
      setMessage('Enter your name and a valid phone number.')
      setDraft('')
      return
    }
    const chosen = puppy ?? availablePuppies.find(entry => entry.slug === fields.get('puppy'))
    const subject = chosen ? 'Puppy enquiry – ' + chosen.name : 'TeddyPups enquiry'
    const detail = [
      'Dear TeddyPups,',
      '',
      'My name is ' + name + '. I’m writing to ask about ' + (chosen ? chosen.name + ' (' + chosen.slug + ')' : 'your puppies') + '.',
      '',
      'Phone / WhatsApp: ' + phone,
      fields.get('email') && 'Email: ' + fields.get('email'),
      location && 'Area: ' + location,
      fields.get('message') && '\n' + fields.get('message').trim(),
    ].filter(line => line !== false && line != null).join('\n')
    setDraft('mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(detail))
    setMessage(email ? 'Your draft is ready. Open it in your email app and send it from there.' : 'Your draft is ready. Add the confirmed recipient in your email app before sending.')
  }

  const nameInput = <input name="name" placeholder="Full name" autoComplete="name" required maxLength={100} />
  const phoneInput = <input name="phone" type="tel" placeholder="+971 50 123 4567" autoComplete="tel" required minLength={7} maxLength={30} />
  const emailInput = <input name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength={150} />
  const locationInput = <input name="location" placeholder="e.g. Dubai Marina" autoComplete="address-level2" maxLength={100} />
  const required = <span className="required-mark" aria-hidden="true">*</span>

  return <form className={letter ? 'enquiry-form letter-form' : 'enquiry-form'} onSubmit={prepareDraft} onChange={() => { if (draft || message) { setDraft(''); setMessage('') } }}>
    {letter ? <>
      <p className="letter-greeting">Dear TeddyPups,</p>
      <div className="letter-flow">
        <label><span>My name is {required}</span>{nameInput}</label>
        <label><span>You can reach me on {required}</span>{phoneInput}</label>
        <label><span>Or by email at <span className="sr-only">(optional)</span></span>{emailInput}</label>
        <label><span>I live in <span className="sr-only">(optional)</span></span>{locationInput}</label>
        <label><span>I&#8217;m curious about</span><select name="puppy" defaultValue={selected ?? ''}><option value="">Any puppy (optional)</option>{availablePuppies.map(entry =>
          <option key={entry.slug} value={entry.slug}>{[entry.name + (entry.breed !== entry.name ? ' / ' + entry.breed : ''), entry.gender, entry.age].filter(Boolean).join(' · ')}</option>
        )}</select></label>
      </div>
    </> : <div className="field-grid">
      <label>Your name {required}{nameInput}</label>
      <label>Phone or WhatsApp {required}{phoneInput}</label>
      <label>Email (optional){emailInput}</label>
      <label>Your area (optional){locationInput}</label>
    </div>}
    <label className={letter ? 'letter-message' : undefined}>Message (optional)<textarea name="message" rows="4" placeholder="Tell us a little about what you're looking for." maxLength={700} /></label>
    {letter && <p className="letter-signoff">With love, a future puppy parent</p>}
    <p className="media-note">Prepare a draft to send from your email app.</p>
    <button className="button primary" type="submit">Prepare email draft</button>
    <div className="form-status" data-draft-ready={Boolean(draft) || undefined} role="status">{message}</div>
    {draft && <a className="button outline" href={draft}>Open email app</a>}
  </form>
}

