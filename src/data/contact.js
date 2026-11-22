export const email = (import.meta.env.VITE_ENQUIRY_EMAIL ?? '').trim()
export const phone = (import.meta.env.VITE_CONTACT_PHONE ?? '').trim()
export const whatsapp = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')
export const map = 'https://www.google.com/maps/search/?api=1&query=Downtown+Dubai+United+Arab+Emirates'

export function whatsappLink(message = 'Hello, I would like to ask about your puppies.') {
  return 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(message)
}
