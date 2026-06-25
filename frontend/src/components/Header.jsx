import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, MessageCircle, Lock } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV_ITEMS, SITE, buildWhatsAppUrl, QUICK_WHATSAPP_MESSAGE } from '../config/site'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquea el scroll del fondo cuando el menu movil esta abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const waUrl = buildWhatsAppUrl(QUICK_WHATSAPP_MESSAGE)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-stone-200 bg-white/85 backdrop-blur-lg'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container-px flex h-16 items-center justify-between md:h-20">
        {/* Logo — lockup de marca: SW · STUDIO WHITE / CREATIVE HOUSE */}
        <a href="#inicio" className="group flex items-center gap-3" aria-label={`${SITE.name} - inicio`}>
          <span className="font-display text-3xl font-semibold leading-none tracking-tight text-charcoal transition-colors group-hover:text-accent">
            SW
          </span>
          <span className="h-8 w-px bg-stone-300" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-semibold uppercase tracking-[0.22em] text-charcoal">
              Studio White
            </span>
            <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.35em] text-accent">
              {SITE.brandSubtitle}
            </span>
          </span>
        </a>

        {/* Nav desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Lado derecho: acceso al panel + hamburguesa */}
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900 lg:inline-flex"
          >
            <Lock size={15} />
            Panel
          </Link>

          {/* Boton hamburguesa */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-stone-900 hover:bg-stone-100 lg:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Menu movil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-stone-200 bg-white/95 backdrop-blur-lg lg:hidden"
          >
            <ul className="container-px flex flex-col gap-1 py-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-stone-700 hover:bg-stone-100 hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="mt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="btn-whatsapp w-full"
                >
                  <MessageCircle size={18} />
                  Reservar por WhatsApp
                </a>
              </li>
              <li>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 px-4 py-3 text-base font-medium text-stone-700 hover:border-stone-900"
                >
                  <Lock size={17} />
                  Panel de administración
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
