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
  const precio = p.promo
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
  PRODUCTS.forEach((p, i) => {
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
    <img src="img/banner.jpg" alt="Nueva temporada Mi Roperito">
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
    <img src="img/banner.jpg" alt="">
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

  let lista = [...productosDe(slug, sub)];
  const pr = p => p.promo || p.price;
  if (orden === "menor") lista.sort((a, b) => pr(a) - pr(b));
  if (orden === "mayor") lista.sort((a, b) => pr(b) - pr(a));
  if (orden === "nuevo") lista.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0));

  const cuerpo = lista.length
    ? `<div class="grid">${lista.map(tile).join("")}</div>`
    : `<p class="empty">Muy pronto tendremos piezas nuevas en esta categoría.</p>`;

  // Filtros de subcategoría (solo donde existen)
  const subs = SUBS[slug] || [];
  const chips = subs.length ? `
    <div class="subs">
      <a class="subs__c${!sub ? " is-on" : ""}" href="#/c/${slug}">Todo</a>
      ${subs.map(s => `<a class="subs__c${sub === s.slug ? " is-on" : ""}" href="#/c/${slug}/${s.slug}">${esc(s.name)}</a>`).join("")}
    </div>` : "";

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
    ${chips}
  </div>
  ${cuerpo}
  ${bloqueInfo()}`;
}

function vistaProducto(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return vistaInicio();
  const cat = CATS.find(c => c.slug === p.cat);
  const precio = p.promo
    ? `${money(p.promo)} <s>${money(p.price)}</s>`
    : money(p.price);
  const relacionados = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id);

  const msg = encodeURIComponent(`¡Hola! Me interesa "${p.name}" (${money(p.promo || p.price)}). ¿Sigue disponible?`);

  const subNom = p.sub ? nombreSub(p.cat, p.sub) : "";

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
        <p class="pdp__lbl">Talla</p>
        <div class="sizes" id="sizes">
          <button class="is-on">CH</button><button>M</button><button>G</button><button>XG</button>
        </div>
        <div class="pdp__acts">
          <button class="btn-fill" data-add="${p.id}">Agregar al carrito</button>
          <a class="btn-wa" href="${TIENDA.wa}?text=${msg}" target="_blank" rel="noopener">
            <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor"><path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4 29l7.3-2.2c1.5.8 3.1 1.2 4.7 1.2 6.6 0 12-5.3 12-11.9S22.6 3 16 3z"/></svg>
            Preguntar
          </a>
        </div>
      </div>
    </div>
  </div>
  ${relacionados.length ? `
    <section>
      <div class="sec-hd"><div><span class="sec-hd__kick">También te va a gustar</span><h2>${esc(cat.name)}</h2></div>
      <a href="#/c/${p.cat}">Ver todo →</a></div>
      <div class="grid">${relacionados.map(tile).join("")}</div>
    </section>` : ""}
  ${bloqueInfo()}`;
}

// ---------- Carrito ----------

function agregar(id) {
  const ex = carrito.find(i => i.id === id);
  if (ex) ex.qty++;
  else carrito.push({ id, qty: 1 });
  pintarCarrito();
  const p = PRODUCTS.find(x => x.id === id);
  flash("Agregado: " + (p ? p.name : "producto") + " ✓");
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

  const lineas = carrito.map(i => {
    const p = PRODUCTS.find(x => x.id === i.id);
    const u = p.promo || p.price;
    return `
      <div class="cart-l">
        <img src="${IMG(p.foto)}" alt="${esc(p.name)}">
        <div class="cart-l__i">
          <div class="cart-l__n">${esc(p.name)}</div>
          <div class="cart-l__p">${money(u)} c/u</div>
          <div class="qty">
            <button data-dec="${p.id}" aria-label="Menos">−</button>
            <b>${i.qty}</b>
            <button data-inc="${p.id}" aria-label="Más">+</button>
            <button class="cart-l__x" data-del="${p.id}">Quitar</button>
          </div>
        </div>
        <div style="font:600 14px/1 var(--body)">${money(u * i.qty)}</div>
      </div>`;
  }).join("");

  const total = carrito.reduce((s, i) => {
    const p = PRODUCTS.find(x => x.id === i.id);
    return s + (p.promo || p.price) * i.qty;
  }, 0);
  const falta = TIENDA.envioGratis - total;

  const detalle = carrito.map(i => {
    const p = PRODUCTS.find(x => x.id === i.id);
    return `• ${p.name} x${i.qty} — ${money((p.promo || p.price) * i.qty)}`;
  }).join("\n");
  const msg = encodeURIComponent(`¡Hola! Quiero pedir:\n${detalle}\n\nTotal: ${money(total)}`);

  body.innerHTML = `
    <div style="flex:1;overflow-y:auto;padding:12px 16px">${lineas}</div>
    <div class="cart-tot">
      <div class="cart-tot__r"><span>Subtotal</span><span>${money(total)}</span></div>
      <div class="cart-tot__r"><span>Envío</span><span>${falta <= 0 ? "Gratis ✓" : "Se calcula al pagar"}</span></div>
      ${falta > 0 ? `<p style="font:400 11.5px/1.4 var(--body);color:var(--muted);margin-bottom:8px">Te faltan ${money(falta)} para el envío gratis.</p>` : ""}
      <div class="cart-tot__r cart-tot__r--b"><span>Total</span><span>${money(total)}</span></div>
      <a class="btn-fill" href="${TIENDA.wa}?text=${msg}" target="_blank" rel="noopener">Pedir por WhatsApp</a>
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
  ["Jeans y Pantalones", "#/c/ropa/jeans"],
  ["Deportiva", "#/c/deportiva"],
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
  } else {
    app.innerHTML = vistaInicio();
    autoCarrusel();
  }

  render._rewire();
  window.scrollTo(0, 0);
  cerrarMega();
}

// Vuelve a enlazar lo que se pinta dinámicamente
render._rewire = function () {
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
  if (inc) { carrito.find(i => i.id === inc.dataset.inc).qty++; pintarCarrito(); return; }

  const dec = e.target.closest("[data-dec]");
  if (dec) {
    const it = carrito.find(i => i.id === dec.dataset.dec);
    if (it.qty > 1) it.qty--; else carrito = carrito.filter(i => i !== it);
    pintarCarrito(); return;
  }

  const del = e.target.closest("[data-del]");
  if (del) { carrito = carrito.filter(i => i.id !== del.dataset.del); pintarCarrito(); return; }

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
$("#bn-cart").onclick = () => abrir("cart");
$("#drw-btn").onclick = () => abrir("drw");
$("#bn-cats").onclick = () => abrir("drw");
$("#search-btn").onclick = () => flash("La búsqueda se conecta al catálogo real 🔍");

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { cerrar("drw"); cerrar("cart"); cerrarMega(); }
});

// Al navegar, cierra los paneles abiertos
window.addEventListener("hashchange", () => { cerrar("drw"); cerrar("cart"); render(); });

pintarCarrito();
render();
