import { useEffect } from 'react'
import { PawPrint } from 'lucide-react'

const kennelIdleTime = 3000
const kennelWalkTime = 260

export function StoryStop({ scene, end = false }) {
  return <span className="puppy-stop" data-puppy-stop={scene} data-stop-end={end || undefined} aria-hidden="true" />
}

function drawStory(root, mascot, trail) {
  const stops = Array.from(root.querySelectorAll('[data-puppy-stop]'))
  const rest = document.querySelector('[data-puppy-stop="rest"]')
  const footer = rest?.closest('footer')
  let frame = 0
  let lastFrame = 0
  let position
  let lastY = window.scrollY
  let settle
  let scrollDirection = 1
  const carousel = root.querySelector('.puppy-showcase')
  const carouselFloor = carousel.querySelector('.showcase-progress')
  const catalogStart = stops.findIndex(stop => stop.dataset.puppyStop === 'catalog')
  const track = carousel.querySelector('.puppy-preview-track')
  const kennel = root.querySelector('[data-kennel-anchor]')
  let kennelPose = 'awake'
  let idleTimer
  let napTimer
  let lastActivity
  let pointerX
  let pointerStep = false
  let lastTrackX = track.scrollLeft
  if (lastY < 40) mascot.dataset.intro = 'true'

  function render(time) {
    frame = 0
    const scroll = window.scrollY
    const width = document.documentElement.clientWidth
    const height = window.innerHeight
    const baseline = Math.min(height * .76, 820)
    const boxes = stops.map(stop => stop.getBoundingClientRect())
    const next = boxes.findIndex(box => box.top > baseline)
    const footerBox = footer?.getBoundingClientRect()
    const restPoint = rest?.getBoundingClientRect()
    const nearRest = rest?.isConnected && footerBox?.height > 0 && footerBox.top < height * .8 &&
      restPoint.top >= footerBox.top && restPoint.top < height - 64 && restPoint.top > 48
    const index = next < 0 ? boxes.length - 1 : Math.max(0, next - 1)
    const from = boxes[index]
    const to = boxes[Math.min(index + 1, boxes.length - 1)]
    const distance = to.top - from.top
    const progress = distance > 0 ? Math.max(0, Math.min(1, (baseline - from.top) / distance)) : 0
    const ease = progress * progress * (3 - 2 * progress)
    let x = nearRest ? restPoint.left : from.left + (to.left - from.left) * ease
    const inHallway = carousel.classList.contains('has-scroll-tour') &&
      boxes[catalogStart].top <= baseline + 1 && boxes[catalogStart + 1].top >= baseline - 1
    let scene = nearRest ? 'rest' : inHallway ? 'catalog' : stops[index].dataset.puppyStop
    const onHallwayFloor = scene === 'catalog' && inHallway
    const difference = scroll - lastY
    const trackDifference = track.scrollLeft - lastTrackX
    if (difference) {
      scrollDirection = Math.sign(difference)
      delete mascot.dataset.intro
    } else if (scene === 'catalog' && trackDifference) {
      scrollDirection = Math.sign(trackDifference)
    }
    const heading = Math.sign(to.left - from.left) || 1
    let direction = heading * scrollDirection
    let y = Math.max(87, Math.min(baseline, distance > 0 && from.top < baseline ? baseline : from.top))
    if (scene === 'welcome') {
      const firstHeight = Math.min(baseline, from.top + scroll)
      y = Math.max(87, firstHeight + (baseline - firstHeight) * ease)
    } else if (onHallwayFloor) {
      const floor = carouselFloor.getBoundingClientRect()
      y = Math.min(height - 16, floor.top + floor.height * .72)
    } else if (scene === 'rest') {
      y = restPoint.top
    }
    const door = scene === 'welcome' && scroll < 260 ? kennel.getBoundingClientRect() : null
    const atKennel = door && door.top > 125 && door.top < height - 38
    if (atKennel) {
      if (kennelPose === 'awake') {
        const drift = pointerX === undefined ? 0 : Math.max(-32, Math.min(32, (pointerX - door.left) * .12))
        const departure = Math.min(1, scroll / 225)
        const patioX = door.left - 40 + drift
        x = patioX + (x - patioX) * departure
        y = door.top + (y - door.top) * departure
        if (!difference && position && Math.abs(x - position.x) > .75) direction = Math.sign(x - position.x)
      } else {
        x = door.left
        y = door.top
        if (kennelPose === 'sleep') scene = 'kennel'
        else direction = 1
      }
    }
    const kennelMoving = atKennel && (pointerStep || kennelPose === 'enter' || mascot.dataset.scene === 'kennel')
    if (scene !== 'rest' && scene !== 'kennel' && (difference || pointerStep || kennelMoving || (scene === 'catalog' && trackDifference))) {
      mascot.dataset.moving = 'true'
      clearTimeout(settle)
      settle = setTimeout(() => { mascot.dataset.moving = 'false' }, 310)
    }
    const halfMascot = mascot.offsetWidth / 2
    x = Math.max(halfMascot, Math.min(width - halfMascot, x))
    const elapsed = lastFrame ? Math.min(time - lastFrame, 48) : 16
    const blend = 1 - Math.exp(-elapsed / 44)
    const movingToTarget = position && Math.hypot(x - position.x, y - position.y) > .6
    const enteringHallway = onHallwayFloor && mascot.dataset.scene !== 'catalog'
    if (movingToTarget && !enteringHallway && scene !== 'kennel' && scene !== 'rest') {
      position = { x: position.x + (x - position.x) * blend, y: onHallwayFloor ? y : position.y + (y - position.y) * blend }
      schedule()
    } else {
      position = { x, y }
    }
    lastFrame = time
    const translated = position.x + 'px ' + position.y + 'px'
    mascot.style.translate = translated
    mascot.style.setProperty('--direction', direction)
    mascot.dataset.scene = scene
    trail.style.setProperty('--direction', direction)
    trail.style.translate = translated
    trail.dataset.scene = scene
    lastY = scroll
    lastTrackX = track.scrollLeft
    pointerStep = false
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render)
  }

  function checkIdle() {
    const remaining = kennelIdleTime - kennelWalkTime - (performance.now() - lastActivity)
    if (remaining > 0) {
      idleTimer = setTimeout(checkIdle, remaining)
      return
    }
    idleTimer = undefined
    kennelPose = 'enter'
    schedule()
    napTimer = setTimeout(() => {
      napTimer = undefined
      kennelPose = 'sleep'
      schedule()
    }, kennelWalkTime)
  }

  function wake() {
    lastActivity = performance.now()
    kennelPose = 'awake'
    if (napTimer !== undefined) {
      clearTimeout(napTimer)
      napTimer = undefined
    }
    if (idleTimer === undefined) idleTimer = setTimeout(checkIdle, kennelIdleTime - kennelWalkTime)
    schedule()
  }

  function wakeOnScroll() {
    pointerX = undefined
    wake()
  }

  function wakeOnPointer(event) {
    if (event.pointerType !== 'mouse') return
    pointerX = event.clientX
    pointerStep = true
    wake()
  }

  window.addEventListener('scroll', wakeOnScroll, { passive: true })
  window.addEventListener('pointermove', wakeOnPointer, { passive: true })
  root.addEventListener('click', wake)
  window.addEventListener('resize', schedule)
  track.addEventListener('scroll', schedule, { passive: true })
  const resize = new ResizeObserver(schedule)
  resize.observe(root)
  wake()

  return () => {
    resize.disconnect()
    window.removeEventListener('scroll', wakeOnScroll)
    window.removeEventListener('pointermove', wakeOnPointer)
    root.removeEventListener('click', wake)
    window.removeEventListener('resize', schedule)
    track.removeEventListener('scroll', schedule)
    cancelAnimationFrame(frame)
    clearTimeout(settle)
    clearTimeout(idleTimer)
    clearTimeout(napTimer)
    delete mascot.dataset.scene
    delete mascot.dataset.intro
    delete mascot.dataset.moving
    delete trail.dataset.scene
  }
}

export function usePuppyStory(root, mascot, trail) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let cleanup
    function update() {
      cleanup?.()
      cleanup = preference.matches ? undefined : drawStory(root.current, mascot.current, trail.current)
    }
    update()
    preference.addEventListener('change', update)
    return () => {
      preference.removeEventListener('change', update)
      cleanup?.()
    }
  }, [root, mascot, trail])

  return function greetPortrait() {
    const character = mascot.current
    if (!['welcome', 'kennel'].includes(character?.dataset.scene) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const figure = character.querySelector('.puppy-figure')
    for (const animation of figure.getAnimations()) {
      if (animation.id === 'portrait-greeting') animation.cancel()
    }
    figure.animate(
      [{ translate: '0 0' }, { translate: '-7px -12px', offset: .43 }, { translate: '0 0' }],
      { id: 'portrait-greeting', duration: 410, easing: 'ease-out' },
    )
  }
}

export function PuppyCompanion({ mascot, trail }) {
  return <div className="puppy-companion" aria-hidden="true">
    <div className="puppy-trail" ref={trail}>
      {Array.from({ length: 6 }, (_, index) => <PawPrint key={index} style={{ '--step': index }} />)}
    </div>
    <div className="puppy-mascot" ref={mascot}>
      <PuppyIllustration />
    </div>
  </div>
}

export function PuppyIllustration({ peek = false }) {
  if (peek) return <svg aria-hidden="true" className="puppy-figure puppy-peek" viewBox="0 0 96 69">
    <g className="puppy-peek-head">
      <path className="puppy-outline" d="M26 32c-10-4-18 3-18 13-4 7 2 17 9 17 10 2 16-8 14-22m39-8c10-4 18 3 18 13 4 7-2 17-9 17-10 2-16-8-14-22" fill="#b87555" />
      <path className="puppy-outline" d="M25 32c-7-9 0-17 9-18 2-8 12-10 19-6 7-3 15 0 17 7 9 2 13 14 7 21 4 13-6 26-28 26S20 51 25 32Z" fill="#e9a971" />
      <path d="M40 18q5-5 10-1m7 0q5-2 7 2" fill="none" stroke="#ffe2b8" strokeWidth="2.5" strokeLinecap="round" />
      <g className="puppy-peek-eyes" fill="#392622"><ellipse cx="36" cy="37" rx="3" ry="3.5" /><ellipse cx="62" cy="37" rx="3" ry="3.5" /></g>
      <path d="M34 48c0-11 28-11 28 0 0 12-28 12-28 0Z" fill="#ffe2b8" />
      <path d="M44 44q5-5 10 0-1 5-5 5t-5-5Z" fill="#392622" />
      <path d="M45 52q2 3 4 0 2 3 4 0" fill="none" stroke="#392622" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="31" cy="46" rx="4" ry="2" fill="#d78f85" /><ellipse cx="66" cy="46" rx="4" ry="2" fill="#d78f85" />
    </g>
    <path className="puppy-outline" d="M18 67v-5q0-6 8-6 7 0 7 6v5m30 0v-5q0-6 8-6 7 0 7 6v5" fill="#f4c79e" />
  </svg>

  return <svg aria-hidden="true" className="puppy-figure" viewBox="0 0 96 79">
        <ellipse className="puppy-shadow" cx="50" cy="69" rx="29" ry="5" />
        <g className="puppy-trot">
          <path className="puppy-tail puppy-outline" d="M26 46c-7-1-11-5-13-11-7-2-8-9-3-12 4-5 11-2 12 3 4 3 2 7-1 9 2 3 5 4 9 4" fill="#c4855d" />
          <path className="puppy-leg rear puppy-outline" d="M31 54v10q3 5 10 0l2-10" fill="#bb794b" />
          <path className="puppy-leg fore puppy-outline" d="M52 54v10q3 5 10 0l1-11" fill="#bb794b" />
          <path className="puppy-outline" d="M24 47c-3-6 3-12 9-11 4-5 11-5 15-1 11-3 18 5 18 13 3 7-4 15-12 14-5 4-13 3-17-1-9 1-15-6-13-14Z" fill="#e4a46e" />
          <path className="puppy-leg fore puppy-outline" d="M58 53v11q4 6 11 0l-1-12" fill="#efc795" />
          <path className="puppy-leg rear puppy-outline" d="M29 54v10q4 6 11 0l-1-9" fill="#efc795" />
          <g className="puppy-head">
            <path className="puppy-outline" d="M45 28c-4-6 2-12 8-12 3-8 13-10 18-5 8-1 14 4 14 11 5 3 5 12 0 16-1 9-9 14-22 14-16 0-23-10-18-24Z" fill="#e9a971" />
            <path className="puppy-ear puppy-outline" d="M53 22c-6-7-14-3-17 5-4 3-4 10-1 13-1 6 6 10 11 6 6-1 7-8 6-12 3-4 3-8 1-12Z" fill="#b87555" />
            <path d="M59 17q4-4 9-1m6 2q4 0 6 5" fill="none" stroke="#ffe2b8" strokeWidth="2.4" strokeLinecap="round" />
            <path className="puppy-outline" d="M69 36q1-6 12-5 8 0 9 5 2 9-12 11-12 0-9-11Z" fill="#f3d1a9" />
            <circle className="puppy-eye" cx="69" cy="29" r="2.45" fill="#2c281f" />
            <path d="M87 32q4 0 3 4-3 3-6 0-2-3 3-4Z" fill="#2c281f" />
            <path d="M60 49l8 3 9-5-6 12Z" fill="#b8e0d2" stroke="#426555" strokeWidth="2" strokeLinejoin="round" />
          </g>
        </g>
        <g className="puppy-nap">
          <path d="M14 60q6-11 33-11t35 11l-6 7H20Z" fill="#879777" stroke="#33442c" strokeWidth="2" />
          <path className="puppy-outline" d="M26 52c-2-7 3-12 10-13 5-6 13-6 17-2 8-1 13 4 15 12l-5 9H37q-12 0-11-6Z" fill="#e4a46e" />
          <path className="puppy-outline" d="M48 44q3-12 13-12 10 0 13 10l8 4q3 10-12 10H54Z" fill="#efc795" />
          <path className="puppy-outline" d="M60 35c-5-4-10-1-12 4-5 4-2 11 2 11 0 4 7 2 7-2 4-4 4-9 3-13Z" fill="#b87555" />
          <path d="M67 43q2 2 5 0m8 4 2 1" fill="none" stroke="#2c281f" strokeWidth="1.8" strokeLinecap="round" />
          <path className="puppy-dream" d="M70 23h7l-7 7h7m5-16h5l-5 5h5" fill="none" stroke="#f9f7f0" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
}
