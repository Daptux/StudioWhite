import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { FAQS } from '../data/faqs'
import Reveal from './Reveal'

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section id="faq" className="section scroll-mt-20 border-y border-stone-200/70 bg-stone-50">
      <div className="container-px">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <Reveal>
            <span className="section-eyebrow">Preguntas</span>
            <h2 className="section-title">Dudas frecuentes</h2>
            <p className="lead mt-6">
              ¿Te queda alguna pregunta? Escríbenos por WhatsApp, respondemos rápido.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              {FAQS.map((item, i) => {
                const isOpen = openIdx === i
                return (
                  <div key={item.q} className="border-b border-stone-200/70 first:border-t">
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? -1 : i)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base font-medium text-stone-900">{item.q}</span>
                      <Plus
                        size={20}
                        strokeWidth={1.5}
                        className={`shrink-0 text-accent transition-transform duration-300 ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 pr-8 text-sm leading-relaxed text-stone-500">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
