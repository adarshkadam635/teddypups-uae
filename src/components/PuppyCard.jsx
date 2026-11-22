import { Link } from 'react-router-dom'
import { ArrowUpRight, CirclePlay, Heart, Sparkle } from 'lucide-react'
import PuppyDoor from './PuppyDoor.jsx'

export function Photo({ photo, loading = 'lazy', ...props }) {
  return <img src={photo.src} alt={photo.alt} loading={loading} decoding="async" {...props} />
}

export function PuppyCard({ puppy, featured, doorOpen, portrait, mobileDoor }) {
  return <Link className={puppy.adopted ? 'puppy-card ticket' : 'puppy-card'} to={'/puppies/' + puppy.slug} data-showcase-featured={featured || undefined} data-motion={featured === undefined ? (puppy.adopted ? 'ticket' : 'catalog') : undefined}>
    <div className="card-media" data-door-open={doorOpen || undefined}>
      <Photo photo={puppy.photos[0]} />
      {(doorOpen !== undefined || mobileDoor) && <PuppyDoor />}
      {portrait && <span className="portrait-accents" aria-hidden="true"><Heart /><Sparkle /></span>}
      <span className="status">{puppy.adopted ? 'Gone home' : 'Available'}</span>
      {puppy.video && <span className="video-tag"><CirclePlay size={16} aria-hidden="true"/> Sample video</span>}
    </div>
    <div className="card-copy">
      <span className="card-arrow" aria-hidden="true"><ArrowUpRight size={17} /></span>
      <h3>{puppy.name}</h3>
      {puppy.breed !== puppy.name && <p>{puppy.breed}</p>}
      <p className="meta">{[puppy.gender, puppy.age].filter(Boolean).join(' · ')}</p>
    </div>
  </Link>
}

export function PuppyGrid({ puppies, portrait, mobileDoor }) {
  return <div className="puppy-grid">{puppies.map(puppy => <PuppyCard key={puppy.slug} puppy={puppy} portrait={portrait} mobileDoor={mobileDoor} />)}</div>
}
