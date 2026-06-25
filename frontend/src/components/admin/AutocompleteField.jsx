import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

// Campo de texto con búsqueda por nombre (combobox).
//  - Al enfocar muestra la lista; al escribir filtra por nombre.
//  - Permite escribir libremente (cliente nuevo) o elegir uno existente.
//  - Al elegir una opción dispara onPick(option) para autocompletar otros campos.
export default function AutocompleteField({
  value,
  onChange,
  onPick,
  token,
  source,
  optionLabel = (o) => o.name,
  placeholder,
  className,
}) {
  const [options, setOptions] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let alive = true
    source
      .list(token)
      .then((d) => alive && setOptions(d))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [source, token])

  const q = (value || '').toLowerCase().trim()
  const matches = q ? options.filter((o) => optionLabel(o).toLowerCase().includes(q)).slice(0, 10) : []

  return (
    <div className="relative">
      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
      <input
        className={`${className} pl-10`}
        value={value || ''}
        placeholder={placeholder || 'Buscar por nombre...'}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {/* Solo se muestra cuando ya hay texto escrito */}
      {open && q !== '' && (
        <ul className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-stone-200 bg-white py-1 shadow-card">
          {matches.length > 0 ? (
            matches.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onPick(o)
                    setOpen(false)
                  }}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm hover:bg-stone-50"
                >
                  <span className="font-medium text-stone-800">{optionLabel(o)}</span>
                  {o.phone && <span className="text-xs text-stone-400">{o.phone}</span>}
                </button>
              </li>
            ))
          ) : (
            <li className="px-4 py-2.5 text-sm text-stone-400">
              {options.length === 0 ? 'Aún no hay clientes guardados.' : 'Sin coincidencias · se usará como cliente nuevo.'}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
