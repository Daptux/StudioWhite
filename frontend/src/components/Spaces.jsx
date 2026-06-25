import { useEffect, useState } from 'react'
import Reveal from './Reveal'
import { api, assetUrl } from '../lib/api'

export default function Spaces() {
  const [spaces, setSpaces] = useState([])

  useEffect(() => {
    let alive = true
    api.spaces
      .listPublic()
      .then((data) => alive && setSpaces(data))
      .catch(() => alive && setSpaces([]))
    return () => {
      alive = false
    }
  }, [])

  if (spaces.length === 0) return null

  return (
    <section id="espacios" className="section scroll-mt-20">
      <div className="container-px">
        <Reveal className="mb-16 max-w-2xl">
          <span className="section-eyebrow">Espacios</span>
          <h2 className="section-title">Un estudio, muchas posibilidades</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.1}>
              <article className="group">
                <div className="relative overflow-hidden rounded-2xl bg-stone-100">
                  <span className="absolute left-4 top-4 z-10 font-display text-sm text-white/90 mix-blend-difference">
                    0{i + 1}
                  </span>
                  <img
                    src={assetUrl(s.image)}
                    alt={s.title}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-5 text-xl font-display font-medium text-stone-900">{s.title}</h3>
                {s.description && <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{s.description}</p>}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
