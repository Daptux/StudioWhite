import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, X, Loader2, Upload, Image as ImageIcon, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { api, assetUrl } from '../../lib/api'
import AutocompleteField from './AutocompleteField'

const money = (v) =>
  v == null || v === ''
    ? '—'
    : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(v))

const fmtDate = (v) => {
  if (!v) return '—'
  const d = String(v).slice(0, 10)
  return d
}

// Devuelve la semana ISO de una fecha 'YYYY-MM-DD' en formato 'YYYY-Www'
function isoWeekString(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = (tmp.getUTCDay() + 6) % 7
  tmp.setUTCDate(tmp.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 4))
  const week = 1 + Math.round(((tmp - firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7)
  return `${tmp.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

function badgeColor(value) {
  const v = String(value || '').toLowerCase()
  if (['pagado', 'confirmada', 'completada', 'activo', 'visible', '1'].includes(v)) return 'bg-green-100 text-green-700'
  if (['pendiente'].includes(v)) return 'bg-amber-100 text-amber-700'
  if (['cancelada', 'oculto', '0'].includes(v)) return 'bg-stone-200 text-stone-600'
  return 'bg-stone-100 text-stone-600'
}

function cellValue(col, row) {
  if (col.render) return col.render(row)
  const v = row[col.key]
  switch (col.type) {
    case 'image':
      return v ? (
        <img src={assetUrl(v)} alt="" className="h-11 w-11 rounded-lg object-cover" />
      ) : (
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-stone-100 text-stone-300">
          <ImageIcon size={18} />
        </span>
      )
    case 'money':
      return money(v)
    case 'date':
      return fmtDate(v)
    case 'badge':
      return (
        <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${badgeColor(v)}`}>
          {v || '—'}
        </span>
      )
    case 'bool':
      return (
        <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${badgeColor(v ? 'visible' : 'oculto')}`}>
          {v ? 'Visible' : 'Oculto'}
        </span>
      )
    default:
      return v || <span className="text-stone-300">—</span>
  }
}

export default function ResourceManager({
  title,
  subtitle,
  resource,
  columns,
  fields,
  defaults = {},
  newLabel = 'Nuevo',
  filters = [],
  rowActions = [],
  canEdit = () => true,
  createFrom = null,
  reloadKey,
}) {
  const { token } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(defaults)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Selector de origen (ej: crear pago a partir de una cita)
  const [picking, setPicking] = useState(false)
  const [pickList, setPickList] = useState(null)

  // Estado de filtros (historial)
  const [filterVals, setFilterVals] = useState({})
  const [dateMode, setDateMode] = useState('') // '' | 'day' | 'week' | 'month'
  const [dateVal, setDateVal] = useState('')

  const hasActive = fields.some((f) => f.key === 'active')

  // Lista visible aplicando los filtros
  const visible = useMemo(() => {
    return list.filter((row) => {
      for (const f of filters) {
        if (f.type === 'select' && filterVals[f.key]) {
          if (String(row[f.key] ?? '') !== String(filterVals[f.key])) return false
        }
        if (f.type === 'date' && dateMode && dateVal) {
          const d = String(row[f.key] ?? '').slice(0, 10)
          if (!d) return false
          if (dateMode === 'day' && d !== dateVal) return false
          if (dateMode === 'month' && d.slice(0, 7) !== dateVal) return false
          if (dateMode === 'week' && isoWeekString(d) !== dateVal) return false
        }
      }
      return true
    })
  }, [list, filters, filterVals, dateMode, dateVal])

  const filterCtl =
    'rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 focus:border-accent focus:outline-none [color-scheme:light]'
  const anyFilter = Object.values(filterVals).some(Boolean) || !!dateMode

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setList(await resource.list(token))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey])

  const openNew = async () => {
    if (createFrom) {
      setPicking(true)
      setPickList(null)
      try {
        setPickList(await createFrom.fetch(token))
      } catch {
        setPickList([])
      }
      return
    }
    setForm({ ...defaults })
    setEditing({})
  }

  const chooseSource = (rec) => {
    setForm({ ...defaults, ...(rec ? createFrom.toForm(rec) : {}) })
    setPicking(false)
    setEditing({})
  }
  const openEdit = (row) => {
    const f = { ...defaults, ...row }
    // normaliza fechas a YYYY-MM-DD para los inputs
    fields.forEach((fl) => {
      if (fl.type === 'date' && f[fl.key]) f[fl.key] = String(f[fl.key]).slice(0, 10)
    })
    setForm(f)
    setEditing(row)
  }
  const close = () => {
    setEditing(null)
    setForm(defaults)
  }
  const upd = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  const onUpload = async (key, file) => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const r = await api.upload(token, file)
      upd(key, r.path)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const save = async (e) => {
    e.preventDefault()
    const req = fields.find((f) => f.required && !String(form[f.key] ?? '').trim())
    if (req) {
      setError(`El campo "${req.label}" es obligatorio.`)
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editing?.id) await resource.update(token, editing.id, form)
      else await resource.create(token, form)
      close()
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (row) => {
    try {
      await resource.update(token, row.id, { active: row.active ? 0 : 1 })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const del = async (row) => {
    if (!window.confirm('¿Eliminar este registro? Esta acción no se puede deshacer.')) return
    try {
      await resource.remove(token, row.id)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const input =
    'w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40'

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium text-stone-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-stone-500">{subtitle}</p>}
        </div>
        <button type="button" onClick={openNew} className="btn-accent shrink-0">
          <Plus size={18} />
          {newLabel}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Barra de filtros */}
      {!loading && filters.length > 0 && list.length > 0 && (
        <div className="mb-5 flex flex-wrap items-end gap-3">
          {filters.map((f) => {
            if (f.type === 'select') {
              const opts = f.fromData
                ? [...new Set(list.map((r) => r[f.key]).filter(Boolean))]
                : f.options || []
              return (
                <div key={f.key}>
                  <label className="mb-1 block text-xs font-medium text-stone-500">{f.label}</label>
                  <select
                    value={filterVals[f.key] || ''}
                    onChange={(e) => setFilterVals((s) => ({ ...s, [f.key]: e.target.value }))}
                    className={filterCtl}
                  >
                    <option value="">Todos</option>
                    {opts.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }
            if (f.type === 'date') {
              return (
                <div key={f.key} className="flex items-end gap-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-500">{f.label}</label>
                    <select
                      value={dateMode}
                      onChange={(e) => {
                        setDateMode(e.target.value)
                        setDateVal('')
                      }}
                      className={filterCtl}
                    >
                      <option value="">Todas</option>
                      <option value="day">Día</option>
                      <option value="week">Semana</option>
                      <option value="month">Mes</option>
                    </select>
                  </div>
                  {dateMode && (
                    <input
                      type={dateMode === 'day' ? 'date' : dateMode === 'week' ? 'week' : 'month'}
                      value={dateVal}
                      onChange={(e) => setDateVal(e.target.value)}
                      className={filterCtl}
                    />
                  )}
                </div>
              )
            }
            return null
          })}
          {anyFilter && (
            <button
              type="button"
              onClick={() => {
                setFilterVals({})
                setDateMode('')
                setDateVal('')
              }}
              className="py-2 text-sm text-stone-500 underline hover:text-accent"
            >
              Limpiar filtros
            </button>
          )}
          <span className="py-2 text-sm text-stone-400">
            {visible.length} resultado{visible.length === 1 ? '' : 's'}
          </span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-stone-400">
          <Loader2 className="animate-spin" />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center">
          <p className="text-stone-500">Aún no hay registros.</p>
          <button type="button" onClick={openNew} className="btn-accent mt-5">
            <Plus size={18} />
            {newLabel}
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wider text-stone-400">
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-semibold">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/60">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 align-middle text-stone-700">
                      {cellValue(c, row)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {rowActions.map((a, idx) =>
                        !a.show || a.show(row) ? (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => a.onClick(row)}
                            title={a.label}
                            className={
                              a.className ||
                              'inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-accent hover:bg-accent/10'
                            }
                          >
                            {a.icon ? <a.icon size={15} /> : null}
                            {a.label}
                          </button>
                        ) : null,
                      )}
                      {hasActive && (
                        <button
                          type="button"
                          onClick={() => toggleActive(row)}
                          title={row.active ? 'Ocultar' : 'Mostrar'}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                        >
                          {row.active ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      )}
                      {canEdit(row) && (
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          title="Editar"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                        >
                          <Pencil size={15} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => del(row)}
                        title="Eliminar"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-sm text-stone-400">
                    No hay resultados con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Selector de origen (ej: elegir cita completada sin pagar) */}
      {picking && createFrom && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-900/40 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-md rounded-2xl bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
              <h2 className="font-display text-xl font-medium text-stone-900">{createFrom.title || 'Elige una opción'}</h2>
              <button type="button" onClick={() => setPicking(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {pickList === null ? (
                <div className="flex items-center justify-center py-10 text-stone-400">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {pickList.length === 0 ? (
                    <p className="px-2 py-6 text-center text-sm text-stone-400">{createFrom.emptyText || 'No hay opciones disponibles.'}</p>
                  ) : (
                    pickList.map((rec) => (
                      <button
                        key={rec.id}
                        type="button"
                        onClick={() => chooseSource(rec)}
                        className="block w-full rounded-xl border border-stone-200 px-4 py-3 text-left text-sm transition-colors hover:border-accent hover:bg-accent/5"
                      >
                        {createFrom.label(rec)}
                      </button>
                    ))
                  )}
                  {createFrom.allowBlank !== false && (
                    <button
                      type="button"
                      onClick={() => chooseSource(null)}
                      className="block w-full rounded-xl border border-dashed border-stone-300 px-4 py-3 text-left text-sm text-stone-500 transition-colors hover:border-stone-900 hover:text-stone-900"
                    >
                      {createFrom.blankLabel || 'Pago libre (sin cita)'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-900/40 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
              <h2 className="font-display text-xl font-medium text-stone-900">
                {editing?.id ? 'Editar' : newLabel}
              </h2>
              <button type="button" onClick={close} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={save} className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((f) => {
                  const value = form[f.key] ?? ''
                  const wrap = f.full || f.type === 'textarea' || f.type === 'image' ? 'sm:col-span-2' : ''

                  if (f.type === 'image') {
                    return (
                      <div key={f.key} className={wrap}>
                        <label className="mb-1.5 block text-sm font-medium text-stone-700">{f.label}</label>
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                            {value ? (
                              <img src={assetUrl(value)} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-stone-300">
                                <ImageIcon size={24} />
                              </div>
                            )}
                          </div>
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:border-stone-900">
                            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            {uploading ? 'Subiendo...' : 'Subir imagen'}
                            <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => onUpload(f.key, e.target.files?.[0])} />
                          </label>
                        </div>
                      </div>
                    )
                  }

                  if (f.type === 'checkbox') {
                    return (
                      <label key={f.key} className={`flex items-center gap-2.5 ${wrap} sm:self-end sm:pb-2.5`}>
                        <input
                          type="checkbox"
                          checked={!!form[f.key]}
                          onChange={(e) => upd(f.key, e.target.checked ? 1 : 0)}
                          className="h-4 w-4 rounded border-stone-300 text-accent focus:ring-accent/40"
                        />
                        <span className="text-sm text-stone-700">{f.label}</span>
                      </label>
                    )
                  }

                  if (f.type === 'autocomplete') {
                    return (
                      <div key={f.key} className={wrap}>
                        <label className="mb-1.5 block text-sm font-medium text-stone-700">
                          {f.label}
                          {f.required && ' *'}
                        </label>
                        <AutocompleteField
                          value={value}
                          onChange={(v) => upd(f.key, v)}
                          onPick={(o) => {
                            upd(f.key, (f.optionLabel ? f.optionLabel(o) : o.name) || '')
                            if (f.fill) Object.entries(f.fill).forEach(([target, src]) => upd(target, o[src] || ''))
                          }}
                          token={token}
                          source={f.source}
                          optionLabel={f.optionLabel}
                          placeholder={f.placeholder}
                          className={input}
                        />
                      </div>
                    )
                  }

                  return (
                    <div key={f.key} className={wrap}>
                      <label className="mb-1.5 block text-sm font-medium text-stone-700">
                        {f.label}
                        {f.required && ' *'}
                      </label>
                      {f.type === 'textarea' ? (
                        <textarea rows={3} className={`${input} resize-none`} value={value} onChange={(e) => upd(f.key, e.target.value)} placeholder={f.placeholder} />
                      ) : f.type === 'select' ? (
                        <select className={input} value={value} onChange={(e) => upd(f.key, e.target.value)}>
                          {!f.required && <option value="">—</option>}
                          {f.options.map((o) => {
                            const val = typeof o === 'string' ? o : o.value
                            const lab = typeof o === 'string' ? o : o.label
                            return (
                              <option key={val} value={val}>
                                {lab}
                              </option>
                            )
                          })}
                        </select>
                      ) : (
                        <input
                          type={f.type || 'text'}
                          className={input}
                          value={value}
                          onChange={(e) => upd(f.key, e.target.value)}
                          placeholder={f.placeholder}
                        />
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-end gap-3 border-t border-stone-200 pt-5">
                <button type="button" onClick={close} className="btn-outline">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="btn-accent disabled:opacity-60">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : null}
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
