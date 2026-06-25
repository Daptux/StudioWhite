import {
  Camera,
  Rocket,
  Store,
  Video,
  Sparkles,
  Package,
  Clapperboard,
  UserCircle,
} from 'lucide-react'
import Reveal from './Reveal'

const items = [
  { icon: Camera, title: 'Fotógrafos', text: 'Un set listo para producir sin montar nada.' },
  { icon: Rocket, title: 'Emprendedores', text: 'Fotos que generan confianza y venden.' },
  { icon: Store, title: 'Marcas y negocios', text: 'Contenido visual coherente para tu marca.' },
  { icon: Video, title: 'Creadores', text: 'Reels y TikToks con luz y fondos limpios.' },
  { icon: Sparkles, title: 'Modelos y artistas', text: 'Portafolios y books de alta calidad.' },
  { icon: Package, title: 'Producto', text: 'Fondos neutros e iluminación controlada.' },
  { icon: Clapperboard, title: 'Video y campañas', text: 'Producciones, lanzamientos y publicidad.' },
  { icon: UserCircle, title: 'Foto profesional', text: 'Tu imagen de perfil o portafolio laboral.' },
]

export default function IdealPara() {
  return (
    <section className="section">
      <div className="container-px">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="section-eyebrow">Para quién es</span>
          <h2 className="section-title">Hecho para quien crea</h2>
          <p className="lead mx-auto mt-5 max-w-lg">
            No importa qué tipo de contenido necesites: el estudio se adapta a tu proyecto.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          {items.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={(i % 4) * 0.08}>
              <div className="group text-center sm:text-left">
                <Icon
                  size={26}
                  strokeWidth={1.4}
                  className="mx-auto text-accent transition-transform duration-500 group-hover:-translate-y-1 sm:mx-0"
                />
                <h3 className="mt-4 text-base font-semibold text-stone-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
