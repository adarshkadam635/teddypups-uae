import { Link, useSearchParams } from 'react-router-dom'
import { PageHeading } from '../components/Layout.jsx'
import { PuppyGrid } from '../components/PuppyCard.jsx'
import { adoptedPuppies, availablePuppies } from '../data/puppies.js'

const filters = [
  ['origin', 'Location', [['', 'Everywhere'], ['local', 'In Dubai'], ['imported', 'Imported'], ['korean', 'Korean Teacup']]],
  ['breed', 'Breed', [['maltipoo', 'Maltipoo'], ['pomeranian', 'Pomeranian'], ['poodle', 'Poodle'], ['cavapoo', 'Cavapoo'], ['shih-tzu', 'Shih Tzu']]],
  ['gender', 'Boy or girl', [['male', 'Boys'], ['female', 'Girls']]],
]

const genderWords = new Map([['male', 'boy'], ['female', 'girl']])
const olderGenderLinks = new Map([['boy', 'male'], ['girl', 'female']])

function matches(puppy, { origin, breed, gender }) {
  const originMatches = !origin || (origin === 'korean' ? puppy.breed.startsWith('Korean Teacup') : puppy.origin === origin)
  const genderWord = genderWords.get(gender) ?? gender
  return originMatches && (!breed || puppy.breed.toLowerCase().includes(breed.replaceAll('-', ' '))) &&
    (!genderWord || puppy.gender.toLowerCase().includes(genderWord))
}

export function Puppies() {
  const [params, setParams] = useSearchParams()
  const savedGender = params.get('gender') ?? ''
  const selected = {
    origin: params.get('origin') ?? '',
    breed: params.get('breed') ?? '',
    gender: olderGenderLinks.get(savedGender) ?? savedGender,
  }
  const filtered = Object.values(selected).some(Boolean)
  const results = availablePuppies.filter(puppy => matches(puppy, selected))

  function toggle(key, value) {
    const next = new URLSearchParams(params)
    if (value && selected[key] !== value) next.set(key, value)
    else next.delete(key)
    setParams(next, { preventScrollReset: true })
  }

  return <div className="catalog-page">
    <PageHeading label="The puppy catalog" title="Available puppies"><p>Browse by breed, location, or gender. Availability is shown as recorded at the time of the catalog snapshot.</p></PageHeading>
    <section className="wrap section list-section catalog-portraits" aria-label="Available puppy catalog">
      <div className="filter-panel">
        {filters.map(([key, label, options]) => <div className="catalog-filter" role="group" aria-label={label} key={key}>
          <span>{label}</span>
          <div className="catalog-filter-options">
            {options.map(([value, text]) => <button className="catalog-filter-button" type="button" key={value} aria-pressed={selected[key] === value} onClick={() => toggle(key, value)}>{text}</button>)}
          </div>
        </div>)}
        {filtered && <button className="button outline" type="button" onClick={() => setParams({}, { preventScrollReset: true })}>Clear filters</button>}
      </div>
      <p className="result-count" role="status">{results.length} {filtered ? (results.length === 1 ? 'puppy matches' : 'puppies match') : 'puppies looking for a home'}</p>
      {results.length ? <PuppyGrid puppies={results} portrait mobileDoor /> : <div className="empty"><h2>No puppies match these filters</h2><p>Try a different breed, location or gender.</p></div>}
    </section>
    <section className="section adopted-portraits" aria-labelledby="already-home"><div className="wrap">
      <div className="adopted-portraits-copy">
        <h2 id="already-home">Already gone home</h2>
        <p>These puppies have found their families.</p>
        <Link className="button primary" to="/gone-home">Explore the adopted gallery</Link>
      </div>
      <PuppyGrid puppies={adoptedPuppies.slice(0, 5)} portrait />
    </div></section>
  </div>
}

export function GoneHome() {
  return <>
    <PageHeading label="After adoption" title="Gone home"><p>Meet {adoptedPuppies.length} puppies who have already joined their families.</p><Link className="button primary" to="/puppies">See available puppies</Link></PageHeading>
    <section className="wrap section" aria-label="Adopted puppies"><PuppyGrid puppies={adoptedPuppies} /></section>
  </>
}
