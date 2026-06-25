import Reveal from './Reveal'

const rules = [
  'Reserva con anticipación para asegurar tu fecha y horario.',
  'El tiempo de alquiler inicia desde la hora reservada.',
  'Confirma el número de personas que asistirán.',
  'Los daños a equipos o fondos se cobran según corresponda.',
  'Las horas extra están sujetas a disponibilidad.',
  'Consulta condiciones para comida, humo, pintura, mascotas o decoración.',
  'Te pedimos dejar el espacio en buen estado al finalizar.',
]

export default function Rules() {
  return (
    <section className="section">
      <div className="container-px">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <span className="section-eyebrow">Buenas prácticas</span>
            <h2 className="section-title">Para que todo fluya</h2>
            <p className="lead mt-6">
              Reglas claras y sencillas que nos ayudan a cuidar el espacio y a que tu sesión
              salga perfecta.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul>
              {rules.map((text, i) => (
                <li
                  key={text}
                  className="flex items-baseline gap-4 border-b border-stone-200/70 py-4 first:border-t"
                >
                  <span className="font-display text-sm text-accent">0{i + 1}</span>
                  <span className="text-sm leading-relaxed text-stone-600">{text}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
