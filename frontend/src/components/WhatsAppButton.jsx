import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { buildWhatsAppUrl, QUICK_WHATSAPP_MESSAGE } from '../config/site'

// Icono oficial de WhatsApp (Lucide no incluye la marca)
function WhatsAppIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.728-.979zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  )
}

export default function WhatsAppButton() {
  // Solo se muestra cuando NINGUN boton de WhatsApp ([data-wa-cta]) esta visible
  const [show, setShow] = useState(false)

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('[data-wa-cta]'))

    // Si no hay botones marcados, mostrarlo siempre como respaldo
    if (targets.length === 0) {
      setShow(true)
      return
    }

    const visible = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target)
          else visible.delete(entry.target)
        })
        // Mostrar el flotante solo si no hay ningun CTA de WhatsApp en pantalla
        setShow(visible.size === 0)
      },
      { threshold: 0 },
    )

    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={buildWhatsAppUrl(QUICK_WHATSAPP_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/40 transition-colors hover:bg-accent-dark sm:bottom-6 sm:right-6"
          aria-label="Escríbenos por WhatsApp"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
          <WhatsAppIcon size={28} />
          <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg bg-ink-800 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block">
            ¿Hablamos? 👋
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
