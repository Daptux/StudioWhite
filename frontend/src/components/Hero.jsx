import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { buildWhatsAppUrl, QUICK_WHATSAPP_MESSAGE } from '../config/site'

const features = ['Alquiler por horas', 'Fondos disponibles', 'Iluminación profesional', 'Reserva por WhatsApp']

export default function Hero() {
  const waUrl = buildWhatsAppUrl(QUICK_WHATSAPP_MESSAGE)

  return (
    <section id="inicio" className="relative flex min-h-screen items-center overflow-hidden pt-20">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 -z-10">
        <img
          src="./img/hero.jpg"
          alt="Estudio fotográfico profesional Studio White en Villavicencio"
          className="h-full w-full object-cover"
          loading="eager"
        />
        {/* Veladuras claras para legibilidad y estética white */}
        <div className="absolute inset-0 bg-white/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40" />
      </div>

      <div className="container-px w-full py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow">
              <span className="h-px w-8 bg-accent" />
              Studio White · Creative House
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="text-[2.9rem] font-medium leading-[1.02] text-charcoal sm:text-6xl md:text-7xl"
          >
            El espacio donde
            <br />
            las ideas{' '}
            <span className="italic text-accent">toman forma</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-stone-600"
          >
            Alquila un estudio fotográfico profesional por horas. Ideal para fotos de
            producto, marcas, retratos, reels y producciones de alto impacto.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a href={waUrl} target="_blank" rel="noopener noreferrer" data-wa-cta className="btn-whatsapp">
              <MessageCircle size={18} />
              Reservar por WhatsApp
            </a>
            <a href="#espacios" className="btn-outline">
              Conocer el estudio
              <ArrowRight size={16} />
            </a>
          </motion.div>

          {/* Features en linea, discretas */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-[0.15em] text-stone-400"
          >
            {features.map((f, i) => (
              <li key={f} className="flex items-center gap-3">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-accent/60" />}
                {f}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
