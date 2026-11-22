import { test, expect } from '@playwright/test'
import { availablePuppies, adoptedPuppies } from '../src/data/puppies.js'
import { familyPhotos, heroPhoto, visitPhoto } from '../src/data/photos.js'

const routes = ['/', '/puppies', '/happy-families', '/how-it-works', '/faq', '/contact', '/gone-home', '/puppies/maltipoo-max-male']

for (const width of [1440, 1024, 768, 390, 320]) {
  test('primary pages fit at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 850 })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push([message.location().url, message.text()]) })
    for (const route of routes) {
      await page.goto(route)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow, route).toBeLessThanOrEqual(1)
    }
    expect(errors).toEqual([])
  })
}

test('all 42 listings have direct profile routes and correct data', async ({ page }) => {
  for (const puppy of [...availablePuppies, ...adoptedPuppies]) {
    await page.goto('/puppies/' + puppy.slug)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(puppy.name)
    await expect(page.locator('.facts')).toContainText(puppy.age)
    await expect(page.locator('.profile-copy .status')).toHaveText(puppy.adopted ? 'Gone home' : 'Available')
  }
  await page.goto('/puppies/this-does-not-exist')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
})

test('catalog filters deep-link, clear and open a listing', async ({ page }) => {
  await page.goto('/puppies?origin=local')
  await expect(page.getByRole('heading', { name: 'No puppies match these filters' })).toBeVisible()
  await page.getByRole('button', { name: 'Korean Teacup', exact: true }).click()
  await expect(page).toHaveURL(/origin=korean/)
  await expect(page.getByRole('status')).toHaveText('5 puppies match')
  await page.getByRole('button', { name: 'Poodle', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('1 puppy matches')
  await page.getByRole('button', { name: 'Clear filters' }).click()
  await expect(page.getByRole('status')).toHaveText('15 puppies looking for a home')
  const girls = page.getByRole('button', { name: 'Girls', exact: true })
  await girls.click()
  await expect(page).toHaveURL(/gender=female/)
  await expect(girls).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('status')).toHaveText('10 puppies match')
  await girls.click()
  await expect(page).not.toHaveURL(/gender=/)
  await page.goto('/puppies?gender=boy')
  await expect(page.getByRole('button', { name: 'Boys', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('status')).toHaveText('6 puppies match')
  await page.getByRole('button', { name: 'Clear filters' }).click()
  await page.getByRole('link', { name: /Available .*Max/ }).click()
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Max')
})

test('profile photo and video controls, neighbors and inquiry', async ({ page }) => {
  await page.goto('/puppies/maltipoo-max-male')
  await expect(page.locator('output')).toHaveText('1 / 3')
  await page.getByRole('button', { name: 'Next media' }).click()
  await expect(page.locator('output')).toHaveText('2 / 3')
  await page.getByRole('button', { name: 'Show sample video' }).click()
  const video = page.locator('video')
  await expect(video).toBeVisible()
  await expect.poll(() => video.evaluate(node => node.readyState)).toBeGreaterThanOrEqual(1)
  await page.getByRole('link', { name: 'Send an enquiry' }).click()
  await expect(page).toHaveURL(/#enquiry/)
  await page.getByRole('textbox', { name: 'Your name' }).fill('Demo User')
  await page.getByRole('textbox', { name: 'Phone or WhatsApp' }).fill('+971 50 123 4567')
  await page.getByRole('button', { name: 'Prepare email draft' }).click()
  await expect(page.getByRole('link', { name: 'Open email app' })).toHaveAttribute('href', /maltipoo-max-male/)
  await page.getByRole('link', { name: /Next puppy/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Korean Teacup Maltipoo')
  await expect(page.locator('output')).toHaveText('1 / 3')
})

test('family lightbox has 64 photos, keyboard navigation and focus return', async ({ page }) => {
  await page.goto('/happy-families')
  await expect(page.locator('.family-grid button')).toHaveCount(64)
  const first = page.locator('.family-grid button').first()
  await first.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.press('ArrowLeft')
  await expect(dialog.locator('output')).toHaveText('64 / 64')
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(first).toBeFocused()
})

test('all shipped image assets are served as WebP', async ({ request }) => {
  const sources = new Set([...availablePuppies, ...adoptedPuppies].flatMap(puppy => puppy.photos.map(photo => photo.src)))
  for (const photo of [heroPhoto, visitPhoto, ...familyPhotos]) sources.add(photo.src)
  await Promise.all([...sources].map(async src => {
    const response = await request.get(src)
    expect(response.ok(), src).toBeTruthy()
    expect(response.headers()['content-type'], src).toContain('image/webp')
    const body = await response.body()
    expect(body.subarray(8, 12).toString(), src).toBe('WEBP')
  }))
})

test('FAQ filters, expands and resets', async ({ page }) => {
  await page.goto('/faq')
  const search = page.getByRole('searchbox')
  await expect(page.getByRole('status')).toHaveText('9 questions')
  await search.fill('vaccinated')
  await expect(page.getByRole('status')).toHaveText('1 question')
  await page.getByText('Are your puppies vaccinated and health-checked?').click()
  await expect(page.getByText(/individual puppy’s health certificate/)).toBeVisible()
  await page.getByText('Are your puppies vaccinated and health-checked?').click()
  await expect(page.getByText(/individual puppy’s health certificate/)).not.toBeVisible()
  await search.fill('unmatched phrase')
  await expect(page.getByRole('heading', { name: 'No questions match' })).toBeVisible()
  await page.getByRole('button', { name: 'Clear search' }).click()
  await expect(page.getByRole('status')).toHaveText('9 questions')
})

test('letter form validates and only prepares an email draft', async ({ page }) => {
  await page.goto('/contact')
  const prepare = page.getByRole('button', { name: 'Prepare email draft' })
  await prepare.click()
  await expect(page.locator('input[name="name"]:invalid')).toBeFocused()
  await page.getByRole('textbox', { name: 'My name is' }).fill('Demo User')
  await page.getByRole('textbox', { name: 'You can reach me on' }).fill('abc def gh')
  await page.getByRole('textbox', { name: 'Or by email at' }).fill('demo@example.test')
  await page.getByRole('textbox', { name: 'I live in' }).fill('Dubai')
  await page.getByRole('combobox', { name: 'I’m curious about' }).selectOption('copper-male')
  await prepare.click()
  await expect(page.getByRole('status')).toContainText('valid phone number')
  await page.getByRole('textbox', { name: 'You can reach me on' }).fill('+971 50 123 4567')
  await page.getByRole('textbox', { name: 'Or by email at' }).fill('')
  await page.getByRole('textbox', { name: 'I live in' }).fill('')
  await prepare.click()
  await expect(page.getByRole('status')).toContainText('Your draft is ready.')
  const href = await page.getByRole('link', { name: 'Open email app' }).getAttribute('href')
  expect(decodeURIComponent(href)).toContain('Copper (copper-male)')
  await page.getByRole('textbox', { name: 'Message (optional)' }).fill('Now editing.')
  await expect(page.getByRole('link', { name: 'Open email app' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /Open in Google Maps for Downtown Dubai/ })).toHaveAttribute('href', /google\.com\/maps/)
})

test('mobile menu closes via Escape and on navigation; delivery links scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'Open menu' })
  await menu.click()
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menu).toBeFocused()
  await menu.click()
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'How it works' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How it works')
  await expect(menu).toBeVisible()
  await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Delivery & collection' }).click()
  await expect(page).toHaveURL(/#delivery/)
  await expect(page.getByRole('heading', { name: 'Delivery & collection' })).toBeInViewport()
  await page.goto('/delivery')
  await expect(page).toHaveURL(/how-it-works#delivery/)
})





test('homepage companion moves through the desktop showcase and settles in the footer', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const mascot = page.locator('.puppy-mascot')
  const showcase = page.locator('.puppy-showcase')
  const track = page.locator('#puppy-preview-track')
  const facing = () => mascot.evaluate(element => element.style.getPropertyValue('--direction'))
  await expect(mascot).toHaveAttribute('data-scene', 'welcome')
  await expect(mascot.locator('.puppy-figure')).toHaveCSS('animation-name', 'puppy-walk-in')
  await expect.poll(facing).toBe('-1')
  await expect(showcase).toHaveClass(/has-scroll-tour/)
  const tour = await showcase.evaluate(section => {
    const styles = getComputedStyle(section)
    const start = section.getBoundingClientRect().top + window.scrollY + parseFloat(styles.paddingTop) - 24
    const distance = parseFloat(styles.getPropertyValue('--catalog-distance'))
    return { start, distance }
  })
  const isOnHallwayFloor = () => mascot.evaluate(element => {
    const floor = document.querySelector('.showcase-progress').getBoundingClientRect()
    const y = Number.parseFloat(element.style.translate.split(' ')[1])
    return y > floor.top && y < floor.bottom
  })
  for (const progress of [0, .98, .3, .5]) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), Math.ceil(tour.start + tour.distance * progress))
    await expect.poll(isOnHallwayFloor).toBe(true)
  }
  await expect(mascot).toHaveAttribute('data-scene', 'catalog')
  await expect.poll(facing).toBe('1')
  await expect.poll(() => mascot.evaluate(element => parseFloat(element.style.translate))).toBeLessThan(1440 * .26)
  await expect.poll(() => track.evaluate(node => node.scrollLeft)).toBeGreaterThan(100)
  await expect(track.locator('[data-showcase-featured] h3')).not.toHaveText('Max')
  await expect(track.locator('[data-showcase-featured] .puppy-door-panel')).toHaveCSS('transform', /^matrix3d/)
  await expect(track.getByRole('link', { name: 'Meet them all' })).toHaveAttribute('href', '/puppies')
  await expect(track.locator('.puppy-door-panel').last()).toHaveCSS('transform', 'none')
  const before = await track.evaluate(node => node.scrollLeft)
  await page.getByRole('button', { name: 'Next puppy cards' }).click()
  await expect.poll(() => track.evaluate(node => node.scrollLeft)).toBeGreaterThan(before + 100)
  for (const [scene, direction] of [['journey', '1'], ['faq', '-1']]) {
    await page.locator('[data-puppy-stop="' + scene + '"]').evaluate(stop => {
      const baseline = Math.min(window.innerHeight * .76, 820)
      window.scrollTo({ top: window.scrollY + stop.getBoundingClientRect().top - baseline + 15, behavior: 'instant' })
    })
    await expect(mascot).toHaveAttribute('data-scene', scene)
    await expect.poll(facing).toBe(direction)
  }
  const questions = page.locator('.story-faq details')
  await expect(page.locator('.story-faq details[open]')).toHaveCount(3)
  await questions.first().locator('summary').click()
  await expect(page.locator('.story-faq details[open]')).toHaveCount(2)
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
  await expect(mascot).toHaveAttribute('data-scene', 'rest')
  await page.evaluate(() => window.scrollTo({ top: 380, behavior: 'instant' }))
  await expect(mascot).toHaveAttribute('data-scene', 'welcome')
  await expect(mascot.locator('.puppy-nap')).toHaveCSS('opacity', '0')
})

test('mobile puppy doors stay browsable in two columns with reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const track = page.getByRole('region', { name: 'Meet the pups' })
  await expect(page.locator('.puppy-companion')).not.toBeVisible()
  await expect(page.locator('.puppy-showcase')).not.toHaveClass(/has-scroll-tour/)
  await expect(track.locator('.puppy-card')).toHaveCount(15)
  await expect(track.locator('.puppy-door-panel').first()).toBeVisible()
  await expect(track).toHaveCSS('grid-template-columns', /^\d+(\.\d+)?px \d+(\.\d+)?px$/)
  await expect(page.locator('.basket-still')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Next puppy cards' })).toBeHidden()
  await page.getByRole('link', { name: /See all .* available puppies/ }).click()
  await expect(page).toHaveURL(/\/puppies$/)
  const catalog = page.getByRole('region', { name: 'Available puppy catalog' })
  await expect(catalog.locator('.puppy-door-panel').first()).toBeVisible()
  await expect(catalog.locator('.puppy-grid')).toHaveCSS('grid-template-columns', /^\d+(\.\d+)?px \d+(\.\d+)?px$/)
  const contact = page.getByRole('navigation', { name: 'Quick contact' })
  await expect(contact).toHaveCSS('position', 'fixed')
  await expect(contact.getByRole('link', { name: /WhatsApp us|Write an enquiry/ })).toBeVisible()
  await expect(contact.getByRole('link', { name: /Call|Visit us/ })).toBeVisible()
  await catalog.locator('.puppy-card').first().click()
  await expect(page).toHaveURL(/\/puppies\/maltipoo-max-male$/)
})

test('adoption guide switches between Dubai and imported journeys', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/how-it-works#two-ways')
  const dubai = page.getByRole('tab', { name: /In Dubai/ })
  const imported = page.getByRole('tab', { name: /Imported/ })
  await expect(dubai).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel')).toContainText('Arrange a visit')

  await imported.click()
  await expect(imported).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel')).toContainText('Follow the journey')
  await expect(page.getByRole('tabpanel')).not.toContainText('Arrange a visit')
  await expect(page.getByRole('link', { name: 'Browse imported puppies' })).toHaveAttribute('href', '/puppies?origin=imported')
  await expect(page).toHaveURL(/\?journey=imported#two-ways$/)
  await page.reload()
  await expect(imported).toHaveAttribute('aria-selected', 'true')
  await page.goBack()
  await expect(dubai).toHaveAttribute('aria-selected', 'true')

  await dubai.focus()
  await page.keyboard.press('ArrowRight')
  await expect(imported).toBeFocused()
  await expect(imported).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('Home')
  await expect(dubai).toBeFocused()
  await expect(page.getByRole('tabpanel')).toContainText('Arrange a visit')
})

test('route curtain covers the outgoing page and skips reduced-motion navigation', async ({ page }) => {
  await page.goto('/puppies')
  await page.evaluate(() => {
    window.curtainFrames = []
    new MutationObserver(() => {
      const phase = document.querySelector('.route-curtain')?.dataset.phase
      if (phase && phase !== window.curtainFrames.at(-1)?.phase) {
        window.curtainFrames.push({ phase, heading: document.querySelector('main h1')?.innerText.replace(/\s+/g, ' ') })
      }
    }).observe(document.body, { childList: true, attributes: true, subtree: true })
  })
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  await nav.getByRole('link', { name: 'FAQ', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Questions & answers' })).toBeVisible()
  await expect(page.locator('.route-curtain')).toHaveCount(0)
  expect(await page.evaluate(() => window.curtainFrames)).toEqual([
    { phase: 'cover', heading: 'Available puppies' },
    { phase: 'reveal', heading: 'Questions & answers' },
  ])
  await expect(page.locator('.faq-board summary')).toHaveCount(9)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.evaluate(() => { window.curtainFrames = [] })
  await nav.getByRole('link', { name: 'Puppies', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Available puppies' })).toBeVisible()
  expect(await page.evaluate(() => window.curtainFrames)).toEqual([])
})

test('homepage portraits take turns introducing themselves', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const rail = page.getByRole('group', { name: 'Choose a puppy portrait' })
  await rail.scrollIntoViewIfNeeded()
  const introduction = rail.locator('.portrait-intro')
  for (const tile of await rail.getByRole('button').all()) {
    const label = await tile.getAttribute('aria-label')
    await expect(introduction).toHaveText('Hi, I’m ' + label.slice('Preview '.length) + '!')
    await expect(tile).toHaveAttribute('data-speaking', 'true')
    await expect(rail.locator('[data-speaking]')).toHaveCount(1)
  }
  await expect(introduction).toHaveCount(0)
})

test('homepage portraits pop individually and use a paw cursor', async ({ page }) => {
  await page.goto('/')
  const rail = page.getByRole('group', { name: 'Choose a puppy portrait' })
  const tiles = rail.getByRole('button')
  const featured = page.locator('.hero-figure img')
  const initialPhoto = await featured.getAttribute('src')
  await expect(tiles).toHaveCount(6)
  const max = rail.getByRole('button', { name: 'Preview Max' })
  const line = max.locator('q')
  await expect(line).toBeHidden()
  await max.hover()
  await expect(line).toHaveText('I saved you a spot in the sunshine.')
  await expect(line).toBeVisible()
  await expect(max).toHaveAccessibleDescription('I saved you a spot in the sunshine.')
  await expect(featured).toHaveAttribute('src', initialPhoto)
  for (const tile of await tiles.all()) {
    await tile.click()
    await expect(tile).toHaveAttribute('aria-pressed', 'true')
    await expect(rail.locator('[aria-pressed="true"]')).toHaveCount(1)
    await expect(featured).toHaveAttribute('src', await tile.locator('img').getAttribute('src'))
    await expect(tile.locator('q')).toBeVisible()
  }
  await expect(featured).not.toHaveAttribute('src', initialPhoto)
  await max.click()
  const firstPop = await max.locator('.portrait-pop').elementHandle()
  await max.click()
  expect(await firstPop.evaluate(element => element.isConnected)).toBe(false)
  await expect(max).toHaveCSS('cursor', /paw-cursor\.svg/)
  await page.mouse.move(80, 220)
  await expect.poll(() => page.locator('.pointer-paws svg').evaluateAll(paws => paws.some(paw => paw.getAnimations().length > 0))).toBeTruthy()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.pointer-paws')).toBeHidden()
  await expect(max.locator('.portrait-pop')).toHaveCSS('animation-name', 'none')
})

test('desktop wheel scrolling eases toward its destination', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    window.wheelPositions = []
    window.addEventListener('scroll', () => window.wheelPositions.push(window.scrollY))
  })
  await page.mouse.move(300, 360)
  await page.mouse.wheel(0, 520)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(519)
  const positions = await page.evaluate(() => window.wheelPositions)
  expect(positions[0]).toBeLessThan(70)
  expect(positions.filter(position => position > 5 && position < 500).length).toBeGreaterThan(8)

  const trackpad = await page.evaluate(async () => {
    const dispatch = deltaY => document.body.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY }))
    const start = window.scrollY
    for (let index = 0; index < 12; index++) {
      dispatch(8)
      await new Promise(resolve => setTimeout(resolve, 16))
    }
    return { start, during: window.scrollY }
  })
  expect(trackpad.during - trackpad.start).toBeGreaterThan(24)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(615)

  const reversed = await page.evaluate(async () => {
    const dispatch = deltaY => document.body.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY }))
    const start = window.scrollY
    dispatch(480)
    for (let frame = 0; frame < 30 && window.scrollY < start + 50; frame++) {
      await new Promise(resolve => requestAnimationFrame(resolve))
    }
    const peak = window.scrollY
    dispatch(-100)
    return { start, peak }
  })
  expect(reversed.peak).toBeGreaterThanOrEqual(reversed.start + 50)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(reversed.peak - 98)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  const wheelUsesBrowser = await page.evaluate(() => document.body.dispatchEvent(
    new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 100 }),
  ))
  expect(wheelUsesBrowser).toBe(true)
})

test('homepage puppy naps in its kennel and wakes on pointer movement or scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const puppy = page.locator('.puppy-mascot')
  const kennel = page.locator('.hero-kennel')
  await expect(kennel).toBeVisible()
  const kennelBox = await kennel.boundingBox()
  expect(kennelBox.x).toBeGreaterThan(1440 * .75)
  expect(kennelBox.y + kennelBox.height).toBeLessThan(900 * .3)
  await expect(puppy).toHaveAttribute('data-scene', 'kennel')
  await expect(puppy.locator('.puppy-nap')).toHaveCSS('opacity', '1')
  const doorway = await kennel.locator('.kennel-doorway').boundingBox()
  const bed = await puppy.locator('.puppy-nap > path').first().boundingBox()
  expect(bed.x).toBeGreaterThan(doorway.x)
  expect(bed.x + bed.width).toBeLessThan(doorway.x + doorway.width)
  expect(doorway.y + doorway.height - (bed.y + bed.height)).toBeGreaterThanOrEqual(0)
  expect(doorway.y + doorway.height - (bed.y + bed.height)).toBeLessThan(8)
  const distanceFromDoor = await puppy.evaluate(element => {
    const door = document.querySelector('[data-kennel-anchor]').getBoundingClientRect()
    const [x, y] = element.style.translate.split(' ').map(parseFloat)
    return Math.hypot(x - door.left, y - door.top)
  })
  expect(distanceFromDoor).toBeLessThan(1)

  await page.mouse.move(300, 300)
  await expect(puppy).toHaveAttribute('data-scene', 'welcome')
  await expect(puppy).toHaveAttribute('data-moving', 'true')
  await expect(puppy).toHaveAttribute('data-scene', 'kennel')
  await page.evaluate(() => window.scrollTo({ top: 85, behavior: 'instant' }))
  await expect(puppy).toHaveAttribute('data-scene', 'welcome')
  await expect(puppy.locator('.puppy-nap')).toHaveCSS('opacity', '0')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.kennel-still')).toBeVisible()
  await expect(page.locator('.puppy-companion')).toBeHidden()
})

test('reference-inspired reveals run on catalog, ticket, family, FAQ, and contact pages', async ({ page }) => {
  const screens = [
    ['/puppies', 'catalog', 'img', 'photo-unfold'],
    ['/gone-home', 'ticket', '', 'ticket-unfold'],
    ['/happy-families', 'photo-print', '', 'photo-arrive'],
    ['/faq', 'note', '', 'note-arrive'],
    ['/contact', 'postmark', '', 'pin-arrive'],
  ]
  for (const [route, name, child, animation] of screens) {
    await page.goto(route)
    const marker = page.locator('[data-motion="' + name + '"]').first()
    await marker.scrollIntoViewIfNeeded()
    await expect(marker).toHaveAttribute('data-revealed', 'true')
    await expect(child ? marker.locator(child) : marker).toHaveCSS('animation-name', animation)
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('[data-motion="postmark"]')).toHaveCSS('animation-name', 'none')
})

test('animated full-screen puppy media preserves the selected slide and focus', async ({ page }) => {
  await page.goto('/puppies/maltipoo-max-male')
  const expand = page.getByRole('button', { name: 'Open Max gallery full screen' })
  await expand.click()
  const lightbox = page.getByRole('dialog', { name: 'Max gallery' })
  await expect(lightbox).toBeVisible()
  await expect(lightbox.locator('output')).toHaveText('1 / 3')
  await lightbox.getByRole('button', { name: 'Next media' }).click()
  await expect(lightbox.locator('output')).toHaveText('2 / 3')
  await expect(lightbox.locator('.slide-media')).toHaveCSS('animation-name', 'slide-arrive')
  await page.keyboard.press('Escape')
  await expect(lightbox).toBeHidden()
  await expect(expand).toBeFocused()
  await expect(page.locator('.gallery-stage + .gallery-controls output')).toHaveText('2 / 3')
})

test('the navigation hides on scroll down and returns on scroll up', async ({ page }) => {
  await page.goto('/faq')
  const header = page.locator('.site-header')
  await page.evaluate(() => window.scrollTo({ top: 490, behavior: 'instant' }))
  await expect(header).toHaveAttribute('data-scroll-hidden', 'true')
  await page.evaluate(() => window.scrollTo({ top: 310, behavior: 'instant' }))
  await expect(header).not.toHaveAttribute('data-scroll-hidden', 'true')
  await expect(header).toBeInViewport()
})

test('adoption illustrations reveal the showroom and fly to Dubai', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const flight = page.getByRole('img', { name: 'Illustrated flight from Korea to Dubai' })
  await flight.scrollIntoViewIfNeeded()
  const plane = flight.locator('.route-plane')
  await expect.poll(() => plane.evaluate(node => new DOMMatrix(getComputedStyle(node).transform).m41)).toBeGreaterThan(380)
  const showroom = page.locator('.showroom-scene')
  await showroom.scrollIntoViewIfNeeded()
  await expect(showroom.locator('img')).toHaveCSS('animation-name', 'window-reveal')
  await expect(page.getByRole('link', { name: 'View imported puppies' })).toHaveAttribute('href', '/puppies?origin=imported')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect.poll(() => plane.evaluate(node => node.getAnimations().length)).toBe(0)
  await expect(showroom.locator('img')).toHaveCSS('animation-name', 'none')
})

test('the homepage journey reveals its phone, passport and evening porch', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const phone = page.locator('.journey-phone')
  const passport = page.locator('.health-passport')
  const porch = page.locator('.welcome-porch')
  await phone.scrollIntoViewIfNeeded()
  await expect(phone).toHaveAttribute('data-revealed', 'true')
  await expect(phone.locator('.journey-chat > p').first()).toHaveCSS('animation-name', /chat-scroll|story-arrive/)
  await passport.scrollIntoViewIfNeeded()
  await expect(passport.locator('.check-list')).toHaveCSS('animation-name', 'passport-open')
  await expect(page.locator('.story-families .family-preview button')).toHaveCount(8)
  await porch.scrollIntoViewIfNeeded()
  await expect(porch.locator('.puppy-door-panel')).toHaveCSS('transform', /^matrix3d/)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(passport.locator('.check-list')).toHaveCSS('animation-name', 'none')
  await expect(porch.locator('.puppy-door-panel')).toBeHidden()
})
