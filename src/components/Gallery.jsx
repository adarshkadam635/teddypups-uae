import { useLayoutEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, CirclePlay, Maximize2, PawPrint, X } from 'lucide-react'
import { Photo } from './PuppyCard.jsx'

function Controls({ index, total, move }) {
  return <div className="gallery-controls">
    <button className="icon-button" type="button" onClick={() => move(-1)} aria-label="Previous media"><ChevronLeft aria-hidden="true" /></button>
    <output aria-live="polite">{index + 1} / {total}</output>
    <button className="icon-button" type="button" onClick={() => move(1)} aria-label="Next media"><ChevronRight aria-hidden="true" /></button>
  </div>
}

function moveOnArrows(event, move) {
  if (event.target.tagName === 'VIDEO') return
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    move(event.key === 'ArrowLeft' ? -1 : 1)
  }
}

function useSlide(total) {
  const [slide, setSlide] = useState({ index: 0, direction: 'forward' })
  const origin = useRef(null)

  function move(delta) {
    setSlide(({ index }) => ({ index: (index + delta + total) % total, direction: delta > 0 ? 'forward' : 'back' }))
  }

  function choose(index) {
    setSlide(previous => index === previous.index ? previous : { index, direction: index > previous.index ? 'forward' : 'back' })
  }

  return {
    ...slide, move, choose,
    swipe: {
      onTouchStart(event) {
        origin.current = event.touches.length === 1 ? event.touches[0] : null
      },
      onTouchEnd(event) {
        const start = origin.current
        origin.current = null
        if (!start || total < 2) return
        const end = event.changedTouches[0]
        const x = end.clientX - start.clientX
        const y = end.clientY - start.clientY
        if (Math.abs(x) > 42 && Math.abs(x) > Math.abs(y) * 1.35) move(x < 0 ? 1 : -1)
      },
    },
  }
}

function GalleryDialog({ dialog, opener, label, move, children, onClosed }) {
  return <dialog className="lightbox" ref={dialog} aria-label={label} onKeyDown={event => moveOnArrows(event, move)} onClick={event => {
    if (event.target === event.currentTarget) dialog.current.close()
  }} onClose={() => {
    dialog.current.querySelector('video')?.pause()
    onClosed?.()
    opener.current?.focus()
  }}>
    <div className="lightbox-panel">
      <button className="icon-button lightbox-close" type="button" aria-label="Close gallery" onClick={() => dialog.current.close()} autoFocus><X aria-hidden="true" /></button>
      {children}
    </div>
  </dialog>
}

function GalleryMedia({ item, direction }) {
  return item.video
    ? <video key={item.video} className="slide-media" data-direction={direction} controls playsInline preload="metadata" aria-label="Illustrative puppy video" src={item.video} />
    : <Photo key={item.src} className="slide-media" data-direction={direction} photo={item} loading="eager" />
}

export function PuppyGallery({ puppy }) {
  const media = puppy.video ? [...puppy.photos, { video: puppy.video }] : puppy.photos
  const { index, direction, move, choose, swipe } = useSlide(media.length)
  const item = media[index]
  const [expanded, setExpanded] = useState(false)
  const dialog = useRef(null)
  const opener = useRef(null)

  useLayoutEffect(() => {
    if (expanded && !dialog.current.open) dialog.current.showModal()
  }, [expanded])

  return <section aria-label="Puppy media" onKeyDown={event => {
    if (!event.target.closest('dialog')) moveOnArrows(event, move)
  }}>
    <div className="gallery-stage" {...(!item.video ? swipe : undefined)}>
      <GalleryMedia item={item} direction={direction} />
      <button ref={opener} type="button" className="icon-button gallery-expand" aria-label={'Open ' + puppy.name + ' gallery full screen'} onClick={event => {
        event.currentTarget.parentElement.querySelector('video')?.pause()
        setExpanded(true)
      }}><Maximize2 size={18} aria-hidden="true" /></button>
    </div>
    {media.length > 1 && <>
      <Controls index={index} total={media.length} move={move} />
      <div className="thumbnails" aria-label="Choose media">
        {media.map((entry, position) => <button type="button" key={entry.src ?? entry.video} aria-label={entry.video ? 'Show sample video' : 'Show photo ' + (position + 1)} aria-pressed={index === position} onClick={() => choose(position)}>
          {entry.video ? <CirclePlay aria-hidden="true"/> : <Photo photo={entry} alt="" />}
        </button>)}
      </div>
    </>}
    <GalleryDialog dialog={dialog} opener={opener} label={puppy.name + ' gallery'} move={move} onClosed={() => setExpanded(false)}>
      {expanded && <>
        <div className="lightbox-media" {...(!item.video ? swipe : undefined)}><GalleryMedia item={item} direction={direction} /></div>
        {media.length > 1 && <Controls index={index} total={media.length} move={move} />}
      </>}
    </GalleryDialog>
    <p className="media-note">Illustrative media. See the reference listing for the actual puppy.</p>
  </section>
}

export function FamilyGallery({ photos, preview = false }) {
  const { index, direction, move, choose, swipe } = useSlide(photos.length)
  const dialog = useRef(null)
  const opener = useRef(null)
  const thumbnails = preview ? photos.slice(0, 8) : photos
  return <>
    <div className={preview ? 'family-grid family-preview' : 'family-grid family-wall'}>{thumbnails.map((photo, i) => <button type="button" data-motion="photo-print" key={photo.src} aria-label={'Open photo ' + (i + 1) + ', ' + photo.alt} onClick={event => {
      opener.current = event.currentTarget
      choose(i)
      dialog.current.showModal()
    }}>
      {!preview && <PawPrint className="photo-pin" size={15} aria-hidden="true" />}
      <Photo photo={photo} />
    </button>)}</div>
    <GalleryDialog dialog={dialog} opener={opener} label="Family gallery" move={move}>
      <div className="lightbox-media" {...swipe}><GalleryMedia item={photos[index]} direction={direction} /></div>
      <Controls index={index} total={photos.length} move={move} />
    </GalleryDialog>
  </>
}
