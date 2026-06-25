// =========================================================================
//  CONFIGURACION GENERAL DEL SITIO
//  Edita aqui los datos del negocio: WhatsApp, redes, direccion, etc.
//  No necesitas tocar el codigo de los componentes para cambiar esto.
// =========================================================================

// Numero de WhatsApp del dueño (formato internacional, SIN + ni espacios)
export const WHATSAPP_NUMBER = '573112258608'

export const SITE = {
  name: 'Studio White',
  // Descriptor de marca (brand book)
  brandSubtitle: 'Creative House',
  // Slogan oficial
  slogan: 'Diseñado para crear, recordar y destacar.',
  // Concepto de marca
  concept: 'El espacio donde las ideas toman forma.',
  tagline: 'Estudio Fotográfico Profesional',
  city: 'Villavicencio, Meta',
  address:
    'El Buque, Carrera 44b #20-48, Edificio Gestar, Local 102, Villavicencio, Meta',
  // Enlace de Google Maps (busqueda por direccion)
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Carrera+44b+20-48+Edificio+Gestar+Villavicencio+Meta',
  instagram: 'https://www.instagram.com/shop.web.oficial/',
  instagramHandle: '@shop.web.oficial',
  hours: 'Lun - Sáb: 8:00 a.m. - 7:00 p.m. (con reserva previa)',
}

// Mensaje rapido del boton flotante de WhatsApp
export const QUICK_WHATSAPP_MESSAGE =
  'Hola, quiero más información sobre el alquiler del estudio fotográfico.'

// Construye un enlace wa.me con el mensaje codificado correctamente
export function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

// Items de navegacion del header (id = id de la seccion)
export const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'incluye', label: 'Incluye' },
  { id: 'espacios', label: 'Espacios' },
  { id: 'fotografos', label: 'Fotógrafos' },
  { id: 'faq', label: 'FAQ' },
  { id: 'reservar', label: 'Reservar' },
]
