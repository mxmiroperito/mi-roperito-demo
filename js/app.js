// ============================================================
// MI ROPERITO — propuesta alterna (demo estático)
// Rutas por hash: #/  ·  #/c/<categoria>  ·  #/p/<producto>
// ============================================================

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const IMG = f => "img/productos/" + f;
const money = n => "$" + Number(n).toLocaleString("es-MX");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

let carrito = [];
let metodoPago = "transferencia"; // "transferencia" | "whatsapp"

// Datos de transferencia (DE EJEMPLO — coinciden con el sitio oficial)
const BANK = { banco: "BBVA", titular: "Mi Roperito", clabe: "0121 8000 1234 5678 90", cuenta: "0123456789" };

// ---------- Sesión de clienta (MAQUETA) ----------
// Este demo no tiene backend: la "sesión" es solo un objeto guardado en el
// navegador para que el panel se sienta real. No se envía nada a ningún lado.
let cliente = null;
try { cliente = JSON.parse(localStorage.getItem("mr_cliente") || "null"); } catch (e) { cliente = null; }
function guardarCliente(c) { cliente = c; try { localStorage.setItem("mr_cliente", JSON.stringify(c)); } catch (e) {} }
function salirCliente() {
  cliente = null;
  try { localStorage.removeItem("mr_cliente"); } catch (e) {}
  location.hash = "#/cuenta"; render();
}

// Pedidos de ejemplo para llenar el panel
const PEDIDOS_DEMO = [
  { id: "MR-1042", fecha: "12 jul 2026", estado: "Listo para recoger", items: ["Vestido Floral Primavera · CH", "Blusa Satín Rosé · M"], total: 748 },
  { id: "MR-1031", fecha: "3 jul 2026",  estado: "Enviado",            items: ["Conjunto Deportivo Rosa · G"],                             total: 529 },
  { id: "MR-1017", fecha: "21 jun 2026", estado: "Entregado",          items: ["Gift Card · $500"],                                        total: 500 },
];
function estadoClase(e) {
  e = e.toLowerCase();
  if (e.includes("entreg")) return "ok";
  if (e.includes("enviado") || e.includes("listo")) return "go";
  return "wait";
}

// ---------- Marquesina ----------
const ANN = `♡  ENVÍO GRATIS desde ${money(TIENDA.envioGratis)}  ·  RECOGE EN TIENDA — Centro de Orizaba  ·  NUEVA TEMPORADA YA DISPONIBLE  ·  `;
$("#ann-a").textContent = ANN.repeat(2);
$("#ann-b").textContent = ANN.repeat(2);

// ---------- Fragmentos reutilizables ----------

// Tarjeta de producto: sin marco, sin separación y sin botón.
// Toda la pieza es un enlace a la ficha.
function tile(p) {
  const tag = p.promo
    ? '<span class="tile__tag is-sale">Oferta</span>'
    : (p.nuevo ? '<span class="tile__tag">Nuevo</span>' : "");
  const precio = p.gift
    ? `Desde ${money(p.price)}`
    : p.promo
    ? `${money(p.promo)} <s>${money(p.price)}</s>`
    : money(p.price);
  return `
    <a class="tile" href="#/p/${p.id}">
      ${tag}
      <img src="${IMG(p.foto)}" alt="${esc(p.name)}" loading="lazy">
      <div class="tile__i">
        <div class="tile__n">${esc(p.name)}</div>
        <div class="tile__p">${precio}</div>
      </div>
    </a>`;
}

function tileEditorial(e) {
  return `
    <a class="tile tile--ed tile--${e.span}" href="${e.href}">
      <img src="${IMG(e.foto)}" alt="${esc(e.titulo)}" loading="lazy">
      <div class="tile__ed">
        <h3>${esc(e.titulo)}</h3>
        <p>${esc(e.sub)}</p>
        <span>Comprar ahora</span>
      </div>
    </a>`;
}

function bloqueInfo() {
  return `
  <section class="info">
    <div class="info__g">
      <div class="info__c">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>
        <h3>Envío gratis</h3>
        <p>Desde ${money(TIENDA.envioGratis)} a toda la República.</p>
      </div>
      <div class="info__c">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16l-1 11H5z"/><path d="M4 9 6 4h12l2 5"/><path d="M9 13h6"/></svg>
        <h3>Recoge gratis</h3>
        <p>Pasa por ella al centro de Orizaba.</p>
      </div>
      <div class="info__c">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.5 3.4 7.6 8 9 4.6-1.4 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>
        <h3>Compra segura</h3>
        <p>Transferencia, depósito o efectivo.</p>
      </div>
      <div class="info__c info__c--hi">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <h3>Atención personal</h3>
        <p>Te asesoramos por WhatsApp, prenda por prenda.</p>
      </div>
    </div>
  </section>`;
}

// ---------- Vistas ----------

function vistaInicio() {
  const circulos = CATS.map(c => `
    <a class="cat" href="#/c/${c.slug}">
      <div class="cat__c">
        <img src="${IMG(c.foto)}" alt="" loading="lazy">
        <b>${esc(c.corto)}</b>
      </div>
    </a>`).join("");

  // Mosaico: productos + bloques editoriales intercalados, todo pegado.
  const piezas = [];
  // La gift card no entra al mosaico (mantendría 17 celdas y rompería
  // la retícula exacta); se compra desde Novedades o su ficha.
  // Los productos `zona:"catalogo"` (fondo blanco) tampoco: el inicio se
  // queda con las fotos de sesión. Ver el bloque temporal en data.js.
  PRODUCTS.filter(p => !p.gift && p.zona !== "catalogo").forEach((p, i) => {
    if (i === 4) piezas.push(tileEditorial(EDITORIALES[0]));
    if (i === 8) piezas.push(tileEditorial(EDITORIALES[1]));
    piezas.push(tile(p));
  });
  piezas.push(tileEditorial(EDITORIALES[2]));

  const mood = (m, copia) => `
    <a class="mood" href="${m.href}"${copia ? ' aria-hidden="true" tabindex="-1"' : ""}>
      <img src="${IMG(m.foto)}" alt="${copia ? "" : esc(m.titulo)}" loading="lazy">
      <div class="mood__t">
        <h3>${esc(m.titulo)}</h3>
        <p>${esc(m.desc)}</p>
        <span>Comprar ahora</span>
      </div>
    </a>`;
  // Se pinta dos veces: la segunda copia permite saltar de vuelta al inicio
  // sin que se note, en vez de rebobinar cruzando todos los productos.
  const moods = MOODS.map(m => mood(m, false)).join("") +
                MOODS.map(m => mood(m, true)).join("");

  return `
  <section class="hero">
    <img class="hero__img hero__img--a" src="img/banner.jpg" alt="Nueva temporada Mi Roperito">
    <img class="hero__img hero__img--b" src="img/banner.jpg" alt="" aria-hidden="true">
    <div class="hero__txt">
      <span class="hero__kick">♡ Nueva temporada</span>
      <h1 class="hero__ttl">Novedades</h1>
      <p class="hero__sub">Tu outfit coqueto ya te está esperando</p>
      <a class="btn-out" href="#/c/novedades">Comprar <span style="font-size:15px">→</span></a>
    </div>
  </section>

  <section class="cats">
    <h2>Compra por categoría</h2>
    <div class="cats__row">${circulos}</div>
  </section>

  <a class="band" href="#/c/novedades">
    <img class="band__img band__img--a" src="img/banner.jpg" alt="">
    <img class="band__img band__img--b" src="img/banner.jpg" alt="" aria-hidden="true">
    <div class="band__in">
      <span class="band__kick">Primavera · Verano</span>
      <h2 class="band__ttl">La colección que vas a amar</h2>
      <span class="band__cta">Comprar ahora →</span>
    </div>
  </a>

  <section>
    <div class="sec-hd">
      <div>
        <span class="sec-hd__kick">♡ Recién llegado</span>
        <h2>Novedades</h2>
      </div>
      <a href="#/c/novedades">Ver todo →</a>
    </div>
    <div class="grid">${piezas.join("")}</div>
  </section>

  <section class="moods">
    <div class="moods__row" id="moods">${moods}</div>
  </section>

  ${bloqueInfo()}`;
}

function vistaCategoria(slug, sub = "", orden = "destacados") {
  const cat = CATS.find(c => c.slug === slug);
  if (!cat) return vistaInicio();
  const subs = SUBS[slug] || [];

  // LANDING DE SUBCATEGORÍAS: si la categoría tiene subcategorías y aún no se
  // eligió una, mostramos un mosaico (imagen + título) que lleva a cada una.
  if (subs.length && !sub) {
    // Cada subcategoría se muestra con una foto de producto real (fondo blanco).
    const tiles = subs.map(s => `
        <a class="subcat-tile" href="#/c/${slug}/${s.slug}">
          <img src="${IMG(s.foto)}" alt="${esc(s.name)}" loading="lazy">
          <div class="subcat-tile__t"><h3>${esc(s.name)}</h3><span>Ver productos →</span></div>
        </a>`).join("");
    return `
    <div class="cat-hd">
      <div class="crumbs"><a href="#/">Inicio</a> / <span style="color:var(--ink)">${esc(cat.name)}</span></div>
      <div class="cat-hd__r">
        <div>
          <span class="sec-hd__kick">Colección</span>
          <h1>${esc(cat.name)}</h1>
          <p class="cat-hd__n">Elige una categoría</p>
        </div>
      </div>
    </div>
    <div class="subcat-grid">${tiles}</div>`;
  }

  let lista = [...productosDe(slug, sub)];
  const pr = p => p.promo || p.price;
  if (orden === "menor") lista.sort((a, b) => pr(a) - pr(b));
  if (orden === "mayor") lista.sort((a, b) => pr(b) - pr(a));
  if (orden === "nuevo") lista.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0));

  const cuerpo = lista.length
    ? `<div class="grid">${lista.map(tile).join("")}</div>`
    : `<p class="empty">Muy pronto tendremos piezas nuevas en esta categoría.</p>`;

  const titulo = sub ? nombreSub(slug, sub) : cat.name;

  return `
  <div class="cat-hd">
    <div class="crumbs">
      <a href="#/">Inicio</a> /
      ${sub ? `<a href="#/c/${slug}">${esc(cat.name)}</a> / ` : ""}
      <span style="color:var(--ink)">${esc(titulo)}</span>
    </div>
    <div class="cat-hd__r">
      <div>
        <span class="sec-hd__kick">${sub ? esc(cat.name) : "Colección"}</span>
        <h1>${esc(titulo)}</h1>
        <p class="cat-hd__n">${lista.length} ${lista.length === 1 ? "pieza" : "piezas"}</p>
      </div>
      <div class="sortbox">
        <span>Ordenar</span>
        <select id="sort">
          <option value="destacados"${orden === "destacados" ? " selected" : ""}>Destacados</option>
          <option value="menor"${orden === "menor" ? " selected" : ""}>Precio: menor a mayor</option>
          <option value="mayor"${orden === "mayor" ? " selected" : ""}>Precio: mayor a menor</option>
          <option value="nuevo"${orden === "nuevo" ? " selected" : ""}>Novedades primero</option>
        </select>
      </div>
    </div>
  </div>
  ${cuerpo}`;
}

function vistaProducto(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return vistaInicio();
  const cat = CATS.find(c => c.slug === p.cat);
  const precio = p.gift
    ? `<span id="gc-precio">${money(p.price)}</span>`
    : p.promo
    ? `${money(p.promo)} <s>${money(p.price)}</s>`
    : money(p.price);
  // Relacionados de la MISMA zona que el producto abierto (catálogo con
  // catálogo, sesión con sesión) para no mezclar fondo blanco con sesión.
  const mismaZona = p.zona === "catalogo" ? (x => x.zona === "catalogo") : (x => x.zona !== "catalogo");
  const relacionados = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id && !x.gift && mismaZona(x));

  const subNom = p.sub ? nombreSub(p.cat, p.sub) : "";

  // Gift card: en vez de tallas se elige el monto (o uno libre hasta $10,000)
  const selector = p.gift ? `
        <p class="pdp__lbl">Elige el monto</p>
        <div class="sizes" id="gc-m">
          <button class="is-on" data-monto="300">$300</button><button data-monto="500">$500</button><button data-monto="1000">$1,000</button><button data-monto="otro">Otro</button>
        </div>
        <div id="gc-otro" hidden style="margin:10px 0 4px">
          <input id="gc-inp" type="number" min="100" max="10000" step="50" inputmode="numeric"
            placeholder="Tu monto ($100 a $10,000)"
            style="width:100%;max-width:240px;padding:10px 12px;border:1px solid var(--line);border-radius:8px;font:400 14px/1 var(--body)">
        </div>
        <p style="font:400 12.5px/1.6 var(--body);color:var(--muted);margin:8px 0 0">
          Llega por correo con código QR y código único al acreditarse el pago.
          Quien la recibe la canjea en su cuenta o la muestra en la tienda física.
        </p>` : `
        <p class="pdp__lbl">Talla</p>
        <div class="sizes" id="sizes">
          <button class="is-on">CH</button><button>M</button><button>G</button><button>XG</button>
        </div>`;

  return `
  <div class="pdp">
    <div class="crumbs">
      <a href="#/">Inicio</a> / <a href="#/c/${p.cat}">${esc(cat.name)}</a> /
      ${subNom ? `<a href="#/c/${p.cat}/${p.sub}">${esc(subNom)}</a> / ` : ""}
      <span style="color:var(--ink)">${esc(p.name)}</span>
    </div>
    <div class="pdp__g">
      <div class="pdp__img"><img src="${IMG(p.foto)}" alt="${esc(p.name)}"></div>
      <div>
        <span class="pdp__k">${esc(subNom || cat.name)}</span>
        <h1 class="pdp__t">${esc(p.name)}</h1>
        <div class="pdp__pr">${precio}</div>
        <p class="pdp__d">${esc(p.desc)}</p>
        ${selector}
        <div class="pdp__acts">
          <button class="btn-fill" data-add="${p.id}">Agregar al carrito</button>
        </div>
      </div>
    </div>
  </div>
  ${relacionados.length ? `
    <section>
      <div class="sec-hd"><div><span class="sec-hd__kick">También te va a gustar</span><h2>${esc(cat.name)}</h2></div>
      <a href="#/c/${p.cat}">Ver todo →</a></div>
      <div class="grid">${relacionados.map(tile).join("")}</div>
    </section>` : ""}`;
}

// ---------- Cuenta de clienta (maqueta) ----------

function vistaCuenta() {
  // Sin sesión: tarjeta de acceso con pestañas Iniciar sesión / Crear cuenta
  if (!cliente) {
    return `
    <div class="acc">
      <div class="crumbs"><a href="#/">Inicio</a> / <span style="color:var(--ink)">Mi cuenta</span></div>
      <div class="acc-auth">
        <div class="acc-auth__hd">
          <span class="sec-hd__kick">♡ Bienvenida</span>
          <h1>Mi cuenta</h1>
          <p>Entra para ver tus pedidos y guardar tus datos.</p>
        </div>
        <div class="acc-tabs">
          <button type="button" class="acc-tab is-on" data-auth="login">Iniciar sesión</button>
          <button type="button" class="acc-tab" data-auth="registro">Crear cuenta</button>
        </div>
        <form class="acc-form" id="acc-form">
          <label class="fld fld--reg" hidden><span>Nombre</span><input name="nombre" type="text" placeholder="Tu nombre" autocomplete="name"></label>
          <label class="fld"><span>Correo</span><input name="email" type="email" placeholder="tucorreo@mail.com" autocomplete="email" required></label>
          <label class="fld fld--reg" hidden><span>WhatsApp</span><input name="tel" type="tel" placeholder="272 000 0000" autocomplete="tel"></label>
          <label class="fld"><span>Contraseña</span><input name="pass" type="password" placeholder="••••••••" autocomplete="current-password" required></label>
          <button class="btn-fill" type="submit" id="acc-submit">Entrar</button>
          <p class="acc-note">Maqueta: tus datos no se envían a ningún lado; la sesión se guarda solo en este navegador.</p>
        </form>
      </div>
    </div>`;
  }

  // Con sesión: panel con perfil, pedidos y dirección
  const inicial = (cliente.nombre || cliente.email || "?").trim().charAt(0).toUpperCase();
  const pedidos = PEDIDOS_DEMO.map(o => `
    <div class="acc-order">
      <div class="acc-order__t">
        <div><b>${esc(o.id)}</b><span>${esc(o.fecha)}</span></div>
        <span class="acc-chip acc-chip--${estadoClase(o.estado)}">${esc(o.estado)}</span>
      </div>
      <ul>${o.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
      <div class="acc-order__f"><span>Total</span><b>${money(o.total)}</b></div>
    </div>`).join("");

  return `
  <div class="acc">
    <div class="crumbs"><a href="#/">Inicio</a> / <span style="color:var(--ink)">Mi cuenta</span></div>
    <div class="acc-dash">
      <aside class="acc-side">
        <div class="acc-profile">
          <div class="acc-avatar">${esc(inicial)}</div>
          <div class="acc-profile__i">
            <b>${esc(cliente.nombre || "Clienta Mi Roperito")}</b>
            <span>${esc(cliente.email)}</span>
            ${cliente.tel ? `<span>${esc(cliente.tel)}</span>` : ""}
          </div>
        </div>
        <button type="button" class="acc-logout" id="acc-logout">Cerrar sesión</button>
      </aside>
      <div class="acc-main">
        <section class="acc-block">
          <h2>Mis pedidos</h2>
          <div class="acc-orders">${pedidos}</div>
        </section>
        <section class="acc-block">
          <h2>Mi dirección</h2>
          <div class="acc-card">
            <p><b>Envío a domicilio</b></p>
            <p>Agrega tu dirección para que tus pedidos lleguen más rápido a toda la República.</p>
            <button type="button" class="btn-out acc-mini">Agregar dirección</button>
          </div>
        </section>
      </div>
    </div>
  </div>`;
}

// ---------- Carrito ----------

function agregar(id) {
  const p = PRODUCTS.find(x => x.id === id);

  // Gift card: se agrega con el monto elegido; cada monto es su propia línea
  if (p?.gift) {
    const btn = $("#gc-m .is-on");
    const inp = $("#gc-inp");
    const monto = btn?.dataset.monto === "otro"
      ? Math.round(Number(inp?.value) || 0)
      : Number(btn?.dataset.monto || 0);
    if (monto < 100 || monto > 10000) {
      flash("Elige un monto entre $100 y $10,000");
      return;
    }
    const ex = carrito.find(i => i.id === id && i.monto === monto);
    if (ex) ex.qty++;
    else carrito.push({ id, qty: 1, monto });
    pintarCarrito();
    flash(`Agregado: Gift Card de ${money(monto)} ✓`);
    return;
  }

  const ex = carrito.find(i => i.id === id);
  if (ex) ex.qty++;
  else carrito.push({ id, qty: 1 });
  pintarCarrito();
  flash("Agregado: " + (p ? p.name : "producto") + " ✓");
}

// Precio unitario de una línea del carrito (la gift card vale su monto)
function unit(i) {
  const p = PRODUCTS.find(x => x.id === i.id);
  return i.monto || p.promo || p.price;
}
function lineName(i) {
  const p = PRODUCTS.find(x => x.id === i.id);
  return i.monto ? `${p.name} · ${money(i.monto)}` : p.name;
}

function pintarCarrito() {
  const n = carrito.reduce((s, i) => s + i.qty, 0);
  [["#pill", "#pill-m"]].flat().forEach(sel => {
    const el = $(sel);
    if (!el) return;
    el.textContent = n;
    el.hidden = n === 0;
  });

  const body = $("#cart-body");
  if (!carrito.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <span style="font-size:40px">🎀</span>
        <p>Tu carrito está vacío</p>
        <p>Agrega tus prendas favoritas para empezar.</p>
        <button class="btn-fill" data-close="cart" style="width:auto;margin-top:6px">Seguir comprando</button>
      </div>`;
    return;
  }

  // Las líneas se identifican por su POSICIÓN (no por id): puede haber
  // varias gift cards con montos distintos del mismo producto.
  const lineas = carrito.map((i, idx) => {
    const p = PRODUCTS.find(x => x.id === i.id);
    const u = unit(i);
    return `
      <div class="cart-l">
        <img src="${IMG(p.foto)}" alt="${esc(p.name)}">
        <div class="cart-l__i">
          <div class="cart-l__n">${esc(lineName(i))}</div>
          <div class="cart-l__p">${money(u)} c/u</div>
          <div class="qty">
            <button data-dec="${idx}" aria-label="Menos">−</button>
            <b>${i.qty}</b>
            <button data-inc="${idx}" aria-label="Más">+</button>
            <button class="cart-l__x" data-del="${idx}">Quitar</button>
          </div>
        </div>
        <div style="font:600 14px/1 var(--body)">${money(u * i.qty)}</div>
      </div>`;
  }).join("");

  const total = carrito.reduce((s, i) => s + unit(i) * i.qty, 0);
  const falta = TIENDA.envioGratis - total;

  const detalle = carrito.map(i =>
    `• ${lineName(i)} x${i.qty} — ${money(unit(i) * i.qty)}`).join("\n");
  const msg = encodeURIComponent(`¡Hola! Quiero pedir:\n${detalle}\n\nTotal: ${money(total)}`);
  const msgT = encodeURIComponent(`¡Hola! Ya hice mi transferencia del pedido:\n${detalle}\n\nTotal: ${money(total)}\nAdjunto mi comprobante.`);

  const acciones = metodoPago === "transferencia" ? `
      <div class="pay-card">
        <div class="pay-card__r"><span>Banco</span><b>${BANK.banco}</b></div>
        <div class="pay-card__r"><span>Titular</span><b>${BANK.titular}</b></div>
        <div class="pay-card__r"><span>CLABE</span><b>${BANK.clabe}</b></div>
        <div class="pay-card__r"><span>Cuenta</span><b>${BANK.cuenta}</b></div>
      </div>
      <p class="pay-note">Haz tu transferencia y envíanos el comprobante por WhatsApp con tu número de pedido. También aceptamos depósito y efectivo en tienda.</p>
      <a class="btn-fill" href="${TIENDA.wa}?text=${msgT}" target="_blank" rel="noopener">Enviar comprobante por WhatsApp</a>`
    : `<p class="pay-note">Tu pedido se confirma por WhatsApp y ahí acordamos el pago.</p>
      <a class="btn-fill" href="${TIENDA.wa}?text=${msg}" target="_blank" rel="noopener">Pedir por WhatsApp</a>`;

  body.innerHTML = `
    <div style="flex:1;overflow-y:auto;padding:12px 16px">${lineas}</div>
    <div class="cart-tot">
      <div class="cart-tot__r"><span>Subtotal</span><span>${money(total)}</span></div>
      <div class="cart-tot__r"><span>Envío</span><span>${falta <= 0 ? "Gratis ✓" : "Se calcula al pagar"}</span></div>
      ${falta > 0 ? `<p style="font:400 11.5px/1.4 var(--body);color:var(--muted);margin-bottom:8px">Te faltan ${money(falta)} para el envío gratis.</p>` : ""}
      <div class="cart-tot__r cart-tot__r--b"><span>Total</span><span>${money(total)}</span></div>
      <div class="pay-tabs">
        <button class="pay-tab ${metodoPago === "transferencia" ? "is-on" : ""}" data-pago="transferencia">Transferencia</button>
        <button class="pay-tab ${metodoPago === "whatsapp" ? "is-on" : ""}" data-pago="whatsapp">WhatsApp</button>
      </div>
      ${acciones}
    </div>`;
}

function flash(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-on");
  clearTimeout(flash._t);
  flash._t = setTimeout(() => t.classList.remove("is-on"), 2200);
}

// ---------- Menús y drawers ----------

function abrir(id) { $("#" + id).classList.add("is-on"); document.body.style.overflow = "hidden"; }
function cerrar(id) { $("#" + id).classList.remove("is-on"); document.body.style.overflow = ""; }

function cerrarMega() {
  $("#mega").hidden = true;
  $("#mega-bd").hidden = true;
  $("#mega-btn").setAttribute("aria-expanded", "false");
}

// Enlaces de categorías en mega menú, drawer y footer.
// Donde hay subcategorías, se listan debajo de su categoría.
$("#mega").innerHTML = CATS.map(c => {
  const subs = SUBS[c.slug] || [];
  return `
    <div class="mega__col">
      <a class="mega__t" href="#/c/${c.slug}">${esc(c.name)}<span>→</span></a>
      ${subs.map(s => `<a class="mega__s" href="#/c/${c.slug}/${s.slug}">${esc(s.name)}</a>`).join("")}
    </div>`;
}).join("");

$("#drw-body").innerHTML = `
  <span style="display:block;padding:8px 12px 4px;font:600 10px/1 var(--body);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)">Categorías</span>
  ${CATS.map(c => {
    const subs = SUBS[c.slug] || [];
    return `
      <a class="drw-link" href="#/c/${c.slug}">${esc(c.name)}<span>→</span></a>
      ${subs.map(s => `<a class="drw-sub" href="#/c/${c.slug}/${s.slug}">${esc(s.name)}</a>`).join("")}`;
  }).join("")}
  <div style="height:1px;background:var(--line);margin:12px"></div>
  <a href="${TIENDA.wa}" target="_blank" rel="noopener" style="font:500 14px/1 var(--body)">Escríbenos por WhatsApp</a>`;

$("#ft-cats").innerHTML = [
  ["Novedades", "#/c/novedades"],
  ["Vestidos", "#/c/ropa/vestidos"],
  ["Blusas y Tops", "#/c/ropa/blusas"],
  ["Pantalones y Jeans", "#/c/ropa/pantalones"],
  ["Deportiva", "#/c/deportiva"],
  ["Gift Card", "#/p/gift-card"],
].map(([n, h]) => `<li><a href="${h}">${esc(n)}</a></li>`).join("");

// ---------- Router ----------

// "#/c/ropa/vestidos" -> ["ropa", "vestidos"]
function rutaCat() {
  const [slug, sub = ""] = location.hash.slice(4).split("/");
  return [slug, sub];
}

function render() {
  const h = location.hash || "#/";
  const app = $("#app");

  if (h.startsWith("#/c/")) {
    const [slug, sub] = rutaCat();
    app.innerHTML = vistaCategoria(slug, sub);
  } else if (h.startsWith("#/p/")) {
    app.innerHTML = vistaProducto(h.slice(4));
  } else if (h.startsWith("#/cuenta")) {
    app.innerHTML = vistaCuenta();
  } else {
    app.innerHTML = vistaInicio();
    autoCarrusel();
  }

  // El footer completo solo va en el inicio; en el resto de vistas estorba.
  const esHome = h === "#/" || h === "#" || h === "";
  const ft = document.querySelector(".ft");
  if (ft) ft.hidden = !esHome;

  render._rewire();
  window.scrollTo(0, 0);
  cerrarMega();
}

// Vuelve a enlazar lo que se pinta dinámicamente
render._rewire = function () {
  // Selector de monto de la gift card
  const gcm = $("#gc-m");
  if (gcm) {
    const precio = $("#gc-precio"), otro = $("#gc-otro"), inp = $("#gc-inp");
    gcm.onclick = e => {
      const b = e.target.closest("button");
      if (!b) return;
      $$("#gc-m button").forEach(x => x.classList.remove("is-on"));
      b.classList.add("is-on");
      const esOtro = b.dataset.monto === "otro";
      otro.hidden = !esOtro;
      if (esOtro) { inp.focus(); }
      else precio.textContent = money(Number(b.dataset.monto));
    };
    if (inp) inp.oninput = () => {
      const v = Math.round(Number(inp.value) || 0);
      if (v >= 100 && v <= 10000) precio.textContent = money(v);
    };
  }

  const sizes = $("#sizes");
  if (sizes) sizes.onclick = e => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("#sizes button").forEach(x => x.classList.remove("is-on"));
    b.classList.add("is-on");
  };
  const sel = $("#sort");
  if (sel) sel.onchange = () => {
    const [slug, sub] = rutaCat();
    $("#app").innerHTML = vistaCategoria(slug, sub, sel.value);
    render._rewire();
  };

  // Cuenta: pestañas de acceso, envío del formulario y cerrar sesión
  const accForm = $("#acc-form");
  if (accForm) {
    $$(".acc-tab").forEach(t => t.onclick = () => {
      $$(".acc-tab").forEach(x => x.classList.remove("is-on"));
      t.classList.add("is-on");
      const esReg = t.dataset.auth === "registro";
      $$(".fld--reg", accForm).forEach(f => f.hidden = !esReg);
      $("#acc-submit").textContent = esReg ? "Crear cuenta" : "Entrar";
    });
    accForm.onsubmit = e => {
      e.preventDefault();
      const fd = new FormData(accForm);
      const email = String(fd.get("email") || "").trim();
      if (!email) { flash("Escribe tu correo"); return; }
      guardarCliente({
        nombre: String(fd.get("nombre") || "").trim(),
        email,
        tel: String(fd.get("tel") || "").trim(),
      });
      flash("¡Bienvenida! ✓");
      render();
    };
  }
  const accLogout = $("#acc-logout");
  if (accLogout) accLogout.onclick = salirCliente;
};

// Carrusel de moods: avanza solo una pieza a la vez.
// Se detiene si el usuario lo toca o pasa el mouse por encima.
function autoCarrusel() {
  const el = $("#moods");
  if (!el) return;
  clearInterval(autoCarrusel._i);

  let i = 0, pausa = false;
  const parar = () => { pausa = true; };
  el.addEventListener("pointerdown", parar);
  el.addEventListener("mouseenter", parar);
  el.addEventListener("mouseleave", () => { pausa = false; });

  autoCarrusel._i = setInterval(() => {
    if (pausa || !document.body.contains(el)) return;
    const cards = el.querySelectorAll(".mood");
    const N = MOODS.length;
    if (cards.length <= N) return;

    // El destino se toma de la posición real de cada tarjeta, no de un ancho
    // calculado: así coincide exacto con el punto de imán del scroll-snap.
    // Si no coincide, el navegador corrige al siguiente y salta de dos en dos.
    const vuelta = cards[N].offsetLeft - cards[0].offsetLeft;

    // Al entrar en la segunda copia, retrocedemos una vuelta sin animación.
    // Las copias son idénticas, así que el salto no se ve y el giro es infinito.
    if (el.scrollLeft >= cards[N].offsetLeft - 2) {
      el.scrollLeft -= vuelta;
      i -= N;
    }
    i++;
    // scrollTo absoluto, no scrollBy: los pasos relativos se acumulaban si la
    // animación anterior seguía corriendo.
    el.scrollTo({ left: cards[i].offsetLeft, behavior: "smooth" });
  }, 2600);
}

// ---------- Eventos globales ----------

document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) { agregar(add.dataset.add); return; }

  const inc = e.target.closest("[data-inc]");
  if (inc) { carrito[Number(inc.dataset.inc)].qty++; pintarCarrito(); return; }

  const dec = e.target.closest("[data-dec]");
  if (dec) {
    const it = carrito[Number(dec.dataset.dec)];
    if (it.qty > 1) it.qty--; else carrito = carrito.filter(i => i !== it);
    pintarCarrito(); return;
  }

  const del = e.target.closest("[data-del]");
  if (del) { carrito = carrito.filter((_, idx) => idx !== Number(del.dataset.del)); pintarCarrito(); return; }

  const pago = e.target.closest("[data-pago]");
  if (pago) { metodoPago = pago.dataset.pago; pintarCarrito(); return; }

  const close = e.target.closest("[data-close]");
  if (close) { cerrar(close.dataset.close); return; }

  // Clic en el fondo del overlay cierra el panel
  if (e.target.classList.contains("ov")) { cerrar(e.target.id); return; }

  // Acordeón del footer (solo móvil)
  const acc = e.target.closest(".ft__acc-t");
  if (acc) { acc.parentElement.classList.toggle("is-open"); return; }
});

$("#mega-btn").onclick = () => {
  const abierto = !$("#mega").hidden;
  $("#mega").hidden = abierto;
  $("#mega-bd").hidden = abierto;
  $("#mega-btn").setAttribute("aria-expanded", String(!abierto));
};
$("#mega-bd").onclick = cerrarMega;

$("#cart-btn").onclick = () => abrir("cart");
$("#cart-btn-m").onclick = () => abrir("cart");
$("#acc-btn").onclick = () => { location.hash = "#/cuenta"; };
$("#bn-cart").onclick = () => abrir("cart");
$("#drw-btn").onclick = () => abrir("drw");
$("#bn-cats").onclick = () => abrir("drw");
// ---------- Buscador ----------
function abrirBusqueda() {
  abrir("search");
  const inp = $("#search-inp");
  inp.value = "";
  pintarResultados("");
  setTimeout(() => inp.focus(), 80);
}
function pintarResultados(q) {
  const box = $("#search-res");
  const t = q.trim().toLowerCase();
  // La búsqueda es parte del catálogo: solo devuelve productos reales
  // (zona:"catalogo" + gift), no las fotos de sesión del inicio.
  const buscables = PRODUCTS.filter(enCatalogo);
  if (!t) { box.innerHTML = `<p class="srch__hint">Escribe para buscar entre ${buscables.length} productos.</p>`; return; }
  const catName = slug => (CATS.find(c => c.slug === slug) || {}).name || "";
  const res = buscables.filter(p =>
    p.name.toLowerCase().includes(t) ||
    (p.desc || "").toLowerCase().includes(t) ||
    catName(p.cat).toLowerCase().includes(t) ||
    nombreSub(p.cat, p.sub).toLowerCase().includes(t)
  ).slice(0, 20);
  box.innerHTML = res.length ? res.map(p => `
    <a class="srch__i" href="#/p/${p.id}" data-close="search">
      <img src="${IMG(p.foto)}" alt="">
      <div class="srch__i-n">${esc(p.name)}<div class="srch__i-c">${esc(p.gift ? "Novedades" : catName(p.cat))}</div></div>
      <span class="srch__i-p">${p.gift ? "Desde " : ""}${money(p.promo || p.price)}</span>
    </a>`).join("")
    : `<p class="srch__hint">No encontramos nada con “${esc(q)}”. Prueba con otra palabra.</p>`;
}
$("#search-btn").onclick = abrirBusqueda;
$("#search-btn-m").onclick = abrirBusqueda; // lupa del header móvil
$("#bn-search")?.addEventListener("click", abrirBusqueda);
$("#search-inp").oninput = e => pintarResultados(e.target.value);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { cerrar("drw"); cerrar("cart"); cerrarMega(); }
});

// Al navegar, cierra los paneles abiertos
window.addEventListener("hashchange", () => { cerrar("drw"); cerrar("cart"); cerrar("search"); render(); });

pintarCarrito();
render();
