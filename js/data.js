// ============================================================
// CATÁLOGO DEMO — Mi Roperito (propuesta alterna)
// Fotos y precios reales de la tienda, incrustados aquí para que
// el demo funcione solo, sin Supabase ni backend.
// ============================================================

// Categorías principales: las 4 reales de la tienda + "Novedades".
// `corto` es la etiqueta dentro del círculo (los nombres largos no caben en móvil).
// `name` se usa en menús, listados y migas de pan.
const CATS = [
  { slug: "ropa",      name: "Ropa",      corto: "Ropa",      foto: "blusa-satin.jpg" },
  { slug: "deportiva", name: "Deportiva", corto: "Deportiva", foto: "conjunto-deportivo.jpg" },
  { slug: "playa",     name: "Playa",     corto: "Playa",     foto: "bikini-tropical.jpg" },
  { slug: "lenceria",  name: "Lencería",  corto: "Lencería",  foto: "pijama-rayitas.jpg" },
  { slug: "novedades", name: "Novedades", corto: "Novedades", foto: "vestido-floral.jpg" },
];

// Subcategorías por categoría. Hoy solo "Ropa" se divide;
// las demás entran directo a su listado.
const SUBS = {
  ropa: [
    { slug: "blusas",     name: "Blusas y Tops" },
    { slug: "pantalones", name: "Pantalones y Jeans" },
    { slug: "vestidos",   name: "Vestidos" },
    { slug: "shorts",     name: "Shorts" },
    { slug: "faldas",     name: "Faldas" },
  ],
};

const PRODUCTS = [
  { id: "vestido-floral",      name: "Vestido Floral Primavera",    cat: "ropa",      sub: "vestidos", price: 459, promo: 399, foto: "vestido-floral.jpg", nuevo: true,
    desc: "Vestido de tirantes con estampado floral y caída ligera. Fresco, femenino y perfecto para el día a día o una salida especial." },
  { id: "blusa-satin",         name: "Blusa Satín Rosé",            cat: "ropa",      sub: "blusas",   price: 349, foto: "blusa-satin.jpg", nuevo: true,
    desc: "Blusa oversize de satín con botones y caída elegante. Combínala fajada con jeans o suelta con falda." },
  { id: "falda-negra",         name: "Falda Skater Negra",          cat: "ropa",      sub: "faldas",   price: 389, foto: "falda-negra.jpg",
    desc: "Falda corta tipo skater con cierre lateral y vuelo bonito al caminar. Básico infalible que combina con todo." },
  { id: "jeans-mom",           name: "Jeans Mom Fit",               cat: "ropa",      sub: "pantalones",    price: 549, foto: "jeans-mom.jpg",
    desc: "Jeans de tiro alto corte mom, cómodos y con la caída que estiliza. El clásico que nunca falla." },
  { id: "chamarra-mezclilla",  name: "Chamarra Mezclilla Oversize", cat: "ropa",      sub: "pantalones",    price: 599, foto: "chamarra-mezclilla.jpg",
    desc: "Chamarra de mezclilla oversize para poner encima de todo. Ese toque casual que arma el look completo." },
  { id: "top-deportivo",       name: "Top Deportivo Gris",          cat: "deportiva", price: 289, foto: "top-deportivo.jpg",
    desc: "Top deportivo de soporte medio, tela suave que respira. Para entrenar cómoda y verte increíble." },
  { id: "conjunto-deportivo",  name: "Conjunto Deportivo Active",   cat: "deportiva", price: 549, promo: 479, foto: "conjunto-deportivo.jpg",
    desc: "Conjunto de top y legging que moldea y acompaña cada movimiento. Del gym a la calle sin cambiarte." },
  { id: "pijama-rayitas",      name: "Pijama Corta Rayitas",        cat: "lenceria",  price: 399, foto: "pijama-rayitas.jpg",
    desc: "Pijama corta de algodón con rayitas finas. Suavecita, fresca y para descansar como mereces." },
  { id: "bata-kimono",         name: "Bata Kimono Satín Floral",    cat: "lenceria",  price: 459, foto: "bata-kimono.jpg", nuevo: true,
    desc: "Bata kimono de satín con estampado floral y caída fluida. Elegancia para tu momento de descanso." },
  { id: "bikini-tropical",     name: "Bikini Tropical Atardecer",   cat: "playa",     price: 449, promo: 379, foto: "bikini-tropical.jpg",
    desc: "Bikini de estampado tropical con tirantes ajustables. Para brillar en la playa o la alberca." },
  { id: "traje-entero-flores", name: "Traje Entero Flores",         cat: "playa",     price: 529, foto: "traje-entero-flores.jpg", nuevo: true,
    desc: "Traje de baño entero con estampado floral y espalda descubierta. Cómodo, favorecedor y con mucho estilo." },
  // Gift card: el precio es el MONTO que elige la clienta ($300/$500/$1,000
  // o uno libre hasta $10,000). No sale en el mosaico del inicio (rompería
  // la retícula exacta de 16 celdas); vive en Novedades y en su ficha.
  { id: "gift-card",           name: "Gift Card Mi Roperito",       cat: "novedades", price: 300, foto: "gift-card.svg", nuevo: true, gift: true,
    desc: "Regala Mi Roperito. Elige el monto y la enviamos por correo con un diseño de la marca, código QR y un código único, listo para usarse en la tienda en línea o en la tienda física." },
];

// "Novedades" no es una categoría del catálogo: agrupa lo marcado como nuevo.
function productosDe(slug, sub) {
  if (slug === "novedades") return PRODUCTS.filter(p => p.nuevo);
  return PRODUCTS.filter(p => p.cat === slug && (!sub || p.sub === sub));
}

function nombreSub(cat, sub) {
  return (SUBS[cat] || []).find(s => s.slug === sub)?.name || "";
}

// Bloques editoriales del mosaico de inicio (van intercalados entre productos).
// Ocupan 2 + 2 + 1 = 5 celdas que, con los 11 productos, completan 16:
// retícula exacta de 4 columnas (escritorio) y de 2 (móvil), sin huecos.
const EDITORIALES = [
  { titulo: "Jeans",  sub: "El corte que te queda", href: "#/c/ropa/pantalones", foto: "jeans-mom.jpg",   span: "wide" },
  { titulo: "Playa",  sub: "Lista para el sol",     href: "#/c/playa",         foto: "bikini-tropical.jpg", span: "tall" },
  { titulo: "Fiesta", sub: "Para la noche",         href: "#/c/ropa/vestidos", foto: "vestido-floral.jpg",  span: "one"  },
];

// Carrusel de "moods" (bandas grandes tipo editorial)
const MOODS = [
  { titulo: "Suavidad",   desc: "Suave · Íntima · Chic",     href: "#/c/lenceria",       foto: "bata-kimono.jpg" },
  { titulo: "Denim",      desc: "Casual · Relax · Versátil", href: "#/c/ropa/pantalones", foto: "chamarra-mezclilla.jpg" },
  { titulo: "Movimiento", desc: "Activa · Cómoda · Ligera",  href: "#/c/deportiva",      foto: "conjunto-deportivo.jpg" },
  { titulo: "Fiesta",     desc: "Elegante · Noche · Brillo", href: "#/c/ropa/vestidos",  foto: "vestido-floral.jpg" },
  { titulo: "Verano",     desc: "Sol · Playa · Libertad",    href: "#/c/playa",          foto: "traje-entero-flores.jpg" },
  { titulo: "Básicos",    desc: "Neutro · Fresco · Diario",  href: "#/c/ropa/pantalones", foto: "jeans-mom.jpg" },
  { titulo: "Elegancia",  desc: "Satín · Brillo · Noche",    href: "#/c/ropa/blusas",    foto: "blusa-satin.jpg" },
  { titulo: "Descanso",   desc: "Suave · Cómoda · Tuya",     href: "#/c/lenceria",       foto: "pijama-rayitas.jpg" },
  { titulo: "Energía",    desc: "Fuerte · Libre · Activa",   href: "#/c/deportiva",      foto: "top-deportivo.jpg" },
];

const TIENDA = {
  wa: "https://wa.me/522722248037",
  tel: "+52 272 224 8037",
  ig: "https://www.instagram.com/_mi.roperito",
  tiktok: "https://www.tiktok.com/@miroperitoo",
  dir: "Sur 5 #260, entre Oriente 4 y 6 (local rosa)<br>Centro, Orizaba, Ver.",
  horario: "Lun a Sáb · 10:00 – 20:00",
  envioGratis: 999,
};
