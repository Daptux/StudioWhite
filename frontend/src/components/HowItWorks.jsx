import Reveal from './Reveal'

const steps = [
  { title: 'Elige tu producción', text: 'Fotos, video, producto, campaña o contenido.' },
  { title: 'Escríbenos', text: 'Cuéntanos fecha, hora y lo que necesitas.' },
  { title: 'Confirmamos', text: 'Revisamos disponibilidad por WhatsApp.' },
  { title: 'Separa tu fecha', text: 'Aseguras tu reserva y queda agendada.' },
  { title: 'Crea', text: 'Llegas al estudio y produces tu contenido.' },
]

export default function HowItWorks() {
  return (
    <section className="section border-y border-stone-200/70 bg-stone-50">
      <div className="container-px">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="section-eyebrow">Cómo funciona</span>
          <h2 className="section-title">Reservar es muy fácil</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map(({ title, text }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="border-t border-stone-300 pt-5">
                <span className="font-display text-4xl font-medium text-accent">0{i + 1}</span>
                <h3 className="mt-3 text-base font-semibold text-stone-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
