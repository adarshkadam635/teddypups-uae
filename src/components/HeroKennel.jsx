import { PuppyIllustration } from './PuppyCompanion.jsx'

export default function HeroKennel() {
  return <div className="hero-kennel" aria-hidden="true">
    <svg viewBox="0 0 176 122" focusable="false">
      <ellipse cx="88" cy="113" rx="77" ry="7" fill="#393426" opacity=".24" />
      <path d="M27 52 87 15l63 37v60H27Z" fill="#d5a772" stroke="#493b2b" strokeWidth="3" strokeLinejoin="round" />
      <path d="M28 68h34m52 0h34M28 84h29m62 0h29M28 100h29m62 0h29" stroke="#a87953" strokeWidth="1.5" opacity=".72" />
      <path className="kennel-doorway" d="M51 112V82a37 28 0 0 1 74 0v30" fill="#3f382a" stroke="#493b2b" strokeWidth="3" />
      <path d="m17 59 71-48 71 48" fill="none" stroke="#493b2b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="14" />
      <path d="m17 57 71-48 71 48" fill="none" stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10" />
      <path d="M88 48c-2-2-10-6-10-11 0-5 6-7 10-2 4-5 10-3 10 2 0 5-8 9-10 11Z" fill="#f9d9dc" stroke="#8f4c55" strokeWidth="1.7" />
      <path d="M51 112h74" stroke="#493b2b" strokeLinecap="round" strokeWidth="3" />
    </svg>
    <span className="kennel-anchor" data-kennel-anchor />
    <div className="kennel-still"><PuppyIllustration /></div>
  </div>
}
