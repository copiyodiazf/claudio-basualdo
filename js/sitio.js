// Menú del celular, historia de Claudio por capítulos, consulta guiada → WhatsApp, compartir y año del pie.
// El movimiento de la portada (la foto que se aleja al bajar) es solo CSS.
const WHATSAPP = '5493855854222'

// ---- menú del celular
const boton = document.querySelector('.hamburguesa')
const menu = document.getElementById('menu')
boton?.addEventListener('click', () => {
  const abierto = menu.classList.toggle('abierta')
  boton.setAttribute('aria-expanded', abierto)
  boton.setAttribute('aria-label', abierto ? 'Cerrar el menú' : 'Abrir el menú')
  boton.querySelector('use').setAttribute('href', abierto ? '#i-x' : '#i-menu')
})

// ---- la historia de Claudio por capítulos (la foto fija cambia con el capítulo que se está leyendo)
document.querySelectorAll('[data-capitulos]').forEach(sec => {
  const figs = sec.querySelectorAll('.historia-fotos figure')
  const puntos = sec.querySelectorAll('.puntos li')
  const obs = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (!e.isIntersecting) return
      const n = e.target.dataset.n
      figs.forEach(f => f.classList.toggle('activa', f.dataset.n === n))
      puntos.forEach(p => p.classList.toggle('activo', p.dataset.n === n))
    })
  }, { rootMargin: '-45% 0px -45% 0px' })
  sec.querySelectorAll('.historia-textos article').forEach(a => obs.observe(a))
})

// ---- contador (Google Analytics, solo en la página real): cada consulta por WhatsApp y cada llamada
const contar = (evento, donde) => { if (typeof gtag === 'function') gtag('event', evento, { donde }) }
document.addEventListener('click', e => {
  const a = e.target.closest('a[href*="wa.me/"], a[href^="tel:"]')
  if (!a) return
  // de qué parte de la página: el botón flotante o la sección (contacto, servicios…)
  const donde = a.classList.contains('wa-flotante') ? 'botón flotante' : a.closest('[id]')?.id || 'página'
  contar(a.href.startsWith('tel:') ? 'llamada' : 'consulta_whatsapp', donde)
})

// ---- consulta guiada → WhatsApp
document.querySelectorAll('form.formulario').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault()
    const falta = form.querySelector('.falta')
    const lineas = []
    const vacios = []

    form.querySelectorAll('[data-etiqueta]').forEach(campo => {
      const etiqueta = campo.dataset.etiqueta
      const valor = campo.classList.contains('opciones')
        ? [...campo.querySelectorAll('input:checked')].map(i => i.value).join(', ')
        : campo.value.trim()
      if (!valor && campo.dataset.obligatorio === 'si') vacios.push(etiqueta.toLowerCase())
      if (valor) lineas.push(`• ${etiqueta}: ${valor}`)
    })

    if (vacios.length) {
      falta.textContent = `Falta completar: ${vacios.join(', ')}.`
      falta.hidden = false
      return
    }
    falta.hidden = true
    contar('consulta_whatsapp', `consulta guiada: ${form.dataset.servicio}`)
    const mensaje = `Hola, Claudio. Te escribo desde tu página. Quiero consultar por *${form.dataset.servicio}*.\n\n${lineas.join('\n')}`
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener')
  })
})

// ---- compartir la página
document.querySelectorAll('[data-compartir]').forEach(b => {
  b.addEventListener('click', async () => {
    const datos = { title: document.title, url: location.href }
    if (navigator.share) {
      try { await navigator.share(datos) } catch { /* la persona cerró el menú */ }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${datos.title} ${datos.url}`)}`, '_blank', 'noopener')
    }
  })
})

document.querySelectorAll('.anio').forEach(el => { el.textContent = new Date().getFullYear() })
