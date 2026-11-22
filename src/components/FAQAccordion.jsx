import { Plus } from 'lucide-react'

export default function FAQAccordion({ entries, initiallyOpen = false, noticeboard = false }) {
  return <div className="accordion">{entries.map(([question, answer]) =>
    <details key={question} open={initiallyOpen} data-motion={noticeboard ? "note" : undefined}>
      <summary><span>{question}</span><Plus aria-hidden="true" size={21} /></summary>
      <div className="answer"><p>{answer}</p></div>
    </details>
  )}</div>
}
