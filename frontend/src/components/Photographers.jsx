import { useEffect, useState } from 'react'
import { Clock, Tag, Instagram, MessageCircle, Mail } from 'lucide-react'
import { api, assetUrl } from '../lib/api'
import Reveal from './Reveal'

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function Photographers() {
  const [list, setList] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let alive = true
    api.photographers
      .listPublic()
      .then((data) => alive && setList(data))
      .catch(() => alive && setList([]))
      .finally(() => alive && setLoaded(true))
    return () => {
      alive = false
    }
  }, [])

  // Si no hay fotógrafos activos, no mostramos la sección
  if (loaded && list.length === 0) return null

  return (
    <section id="fotografos" className="section scroll-mt-20">
      <div className="container-px">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="section-eyebrow">Fotógrafos</span>
          <h2 className="section-title">Fotógrafos disponibles</h2>
          <p className="lead mx-auto mt-5 max-w-lg">
            ¿No tienes fotógrafo? Trabaja con profesionales aliados que conocen el estudio al
            detalle.
          </p>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-6">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08} className="w-full sm:w-[340px]">
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-stone-300 hover:shadow-card">
                {/* Foto o iniciales */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  {p.photo ? (
                    <img
                      src={assetUrl(p.photo)}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-display text-5xl font-medium text-stone-300">{initials(p.name)}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-display font-medium text-stone-900">{p.name}</h3>
                  {p.specialty && <p className="mt-1 text-sm text-accent">{p.specialty}</p>}

                  <div className="mt-4 space-y-2 text-sm text-stone-500">
                    {p.schedule && (
                      <p className="flex items-center gap-2.5">
                        <Clock size={15} className="shrink-0 text-stone-400" />
                        {p.schedule}
                      </p>
                    )}
                    {p.price && (
                      <p className="flex items-center gap-2.5">
                        <Tag size={15} className="shrink-0 text-stone-400" />
                        {p.price}
                      </p>
                    )}
                  </div>

                  {/* Contacto */}
                  <div className="mt-6 flex items-center gap-2 border-t border-stone-100 pt-5">
                    {p.phone && (
                      <a
                        href={`https://wa.me/${p.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-wa-cta
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-white transition-colors hover:bg-accent-dark"
                      >
                        <MessageCircle size={15} />
                        Contactar
                      </a>
                    )}
                    {p.instagram && (
                      <a
                        href={p.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Instagram de ${p.name}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition-colors hover:border-accent hover:text-accent"
                      >
                        <Instagram size={16} />
                      </a>
                    )}
                    {p.email && (
                      <a
                        href={`mailto:${p.email}`}
                        aria-label={`Correo de ${p.name}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition-colors hover:border-accent hover:text-accent"
                      >
                        <Mail size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
