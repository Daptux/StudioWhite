import { MapPin, Phone, Instagram, Clock, MessageCircle } from 'lucide-react'
import {
  SITE,
  WHATSAPP_NUMBER,
  NAV_ITEMS,
  buildWhatsAppUrl,
  QUICK_WHATSAPP_MESSAGE,
} from '../config/site'

export default function Footer() {
  const year = 2026 // actualiza si lo deseas

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="container-px py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="lg:col-span-1">
            <a href="#inicio" className="inline-flex flex-col items-start leading-none">
              <span className="font-display text-4xl font-semibold leading-none tracking-tight text-charcoal">
                SW
              </span>
              <span className="mt-2 font-display text-base font-semibold uppercase tracking-[0.22em] text-charcoal">
                Studio White
              </span>
              <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-accent">
                {SITE.brandSubtitle}
              </span>
            </a>
            <p className="mt-4 max-w-xs font-title text-sm italic leading-relaxed text-stone-500">
              {SITE.slogan}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-500">
              {SITE.tagline} en {SITE.city}. Alquila el estudio por horas y crea contenido
              profesional para tu marca, productos y redes sociales.
            </p>
          </div>

          {/* Enlaces rapidos */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-stone-900">Navegación</h3>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-sm text-stone-500 transition-colors hover:text-accent">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-stone-900">Contacto</h3>
            <ul className="space-y-3 text-sm text-stone-500">
              <li>
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 transition-colors hover:text-accent"
                >
                  <MapPin size={18} className="mt-0.5 shrink-0 text-accent" />
                  {SITE.address}
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppUrl(QUICK_WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 transition-colors hover:text-accent"
                >
                  <Phone size={18} className="shrink-0 text-accent" />
                  +{WHATSAPP_NUMBER}
                </a>
              </li>
              <li>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 transition-colors hover:text-accent"
                >
                  <Instagram size={18} className="shrink-0 text-accent" />
                  {SITE.instagramHandle}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={18} className="mt-0.5 shrink-0 text-accent" />
                {SITE.hours}
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-stone-900">¿Listo para crear?</h3>
            <p className="mb-4 text-sm text-stone-500">
              Reserva tu sesión hoy y crea contenido de alto impacto.
            </p>
            <a
              href={buildWhatsAppUrl(QUICK_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-cta
              className="btn-whatsapp w-full"
            >
              <MessageCircle size={18} />
              Reservar por WhatsApp
            </a>
          </div>
        </div>

        {/* Linea legal */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-6 text-center text-xs text-stone-400 sm:flex-row sm:text-left">
          <p>
            © {year} {SITE.name}. Todos los derechos reservados.
          </p>
          <p>Estudio fotográfico en {SITE.city} · Alquiler por horas</p>
        </div>
      </div>
    </footer>
  )
}
