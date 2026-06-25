import { motion } from 'framer-motion'
import { MessageCircle, MapPin, Clock } from 'lucide-react'
import { SITE, buildWhatsAppUrl, QUICK_WHATSAPP_MESSAGE } from '../config/site'

export default function CtaReserva() {
  const waUrl = buildWhatsAppUrl(QUICK_WHATSAPP_MESSAGE)

  return (
    <section id="reservar" className="relative scroll-mt-20 overflow-hidden">
      {/* Fondo con imagen del estudio y veladura blanca */}
      <div className="absolute inset-0 -z-10">
        <img
          src="./img/studio-1.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-white/82" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-white" />
      </div>

      <div className="container-px py-28 text-center md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl"
        >
          <span className="section-eyebrow justify-center">Reserva tu sesión</span>
          <h2 className="font-display text-[2.6rem] font-medium leading-[1.05] text-stone-900 sm:text-6xl">
            ¿Listo para crear algo <span className="italic text-accent">increíble</span>?
          </h2>
          <p className="lead mx-auto mt-6 max-w-lg">
            Escríbenos por WhatsApp con tu idea o fecha tentativa. Confirmamos disponibilidad
            y separas tu reserva en minutos, sin enredos.
          </p>

          <div className="mt-9 flex justify-center">
            <a href={waUrl} target="_blank" rel="noopener noreferrer" data-wa-cta className="btn-whatsapp text-sm">
              <MessageCircle size={18} />
              Reservar por WhatsApp
            </a>
          </div>

          {/* Datos rápidos */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 text-sm text-stone-500 sm:flex-row sm:gap-10">
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-accent"
            >
              <MapPin size={16} className="text-accent" />
              {SITE.city}
            </a>
            <span className="hidden h-4 w-px bg-stone-300 sm:block" />
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-accent" />
              {SITE.hours}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
