import { useEffect } from 'react'

export function useViewportMotion(pathname) {
  useEffect(() => {
    const main = document.getElementById('main')
    if (!main) return
    const seen = new WeakSet()
    const reveal = new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) {
          target.dataset.revealed = 'true'
          reveal.unobserve(target)
        }
      }
    }, { threshold: .12 })

    function monitor() {
      for (const node of main.querySelectorAll('[data-motion]')) {
        if (seen.has(node)) continue
        seen.add(node)
        reveal.observe(node)
      }
    }

    const changes = new MutationObserver(monitor)
    changes.observe(main, { childList: true, subtree: true })
    monitor()
    return () => {
      changes.disconnect()
      reveal.disconnect()
    }
  }, [pathname])
}
