import {
  Clock,
  Image,
  Lightbulb,
  Brush,
  Shirt,
  Wifi,
  Sofa,
  Boxes,
  Lock,
  Film,
} from 'lucide-react'
import Reveal from './Reveal'

const benefits = [
  { icon: Clock, title: 'Espacio por horas' },
  { icon: Image, title: 'Fondos disponibles' },
  { icon: Lightbulb, title: 'Iluminación profesional' },
  { icon: Brush, title: 'Zona de maquillaje' },
  { icon: Shirt, title: 'Vestidor' },
  { icon: Wifi, title: 'WiFi' },
  { icon: Sofa, title: 'Área de espera' },
  { icon: Boxes, title: 'Trae tus props' },
  { icon: Lock, title: 'Ambiente privado' },
  { icon: Film, title: 'Ideal para foto y video' },
]

export default function Benefits() {
  return (
    <section id="incluye" className="section scroll-mt-20 border-y border-stone-200/70 bg-stone-50">
      <div className="container-px">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <span className="section-eyebrow">Qué incluye</span>
            <h2 className="section-title">Todo listo para crear</h2>
            <p className="lead mt-6">
              Olvídate de montar luces o buscar locación. Llegas, te preparas y empiezas a
              producir contenido profesional de inmediato.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-x-10 gap-y-px sm:grid-cols-2">
            {benefits.map(({ icon: Icon, title }, i) => (
              <Reveal key={title} delay={(i % 2) * 0.05}>
                <div className="flex items-center gap-4 border-b border-stone-200/70 py-4">
                  <Icon size={20} strokeWidth={1.5} className="shrink-0 text-accent" />
                  <span className="text-sm font-medium text-stone-700">{title}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
