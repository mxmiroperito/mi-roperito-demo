# Mi Roperito — propuesta alterna (demo)

Demo **visual** de un rediseño para [Mi Roperito](https://github.com/mxmiroperito/mi-roperito),
con la estructura de página de [shasa.com](https://shasa.com) y la identidad de la boutique
(Cormorant Garamond + Jost, paleta rosa/beige).

Es una segunda opción para que la clienta elija. **No reemplaza al sitio actual.**

## Qué incluye

- Inicio: hero, círculos de categoría, mosaico de productos, carrusel editorial, bloque de info.
- Listado por categoría con ordenamiento.
- Ficha de producto con tallas y pedido por WhatsApp.
- Carrito lateral que arma el pedido y lo manda a WhatsApp.
- Menú móvil, nav inferior y footer en acordeón.

## Decisiones de diseño

- **Productos sin marcos, sin separación y sin botones.** El mosaico va pegado (`gap: 0`),
  cada pieza es un enlace completo a su ficha. Nombre y precio van sobre la foto: aparecen
  al pasar el mouse en escritorio y siempre visibles en táctil.
- **Círculos de categoría: las 5 a la vista y grandes.** Crecen para llenar el ancho
  (258 px en escritorio) y en móvil caben las 5 sin scroll. Sin precio debajo.
- **Info en 4 bloques**, el último en degradado rosa, como en la referencia.
- **Banner y hero** usan `img/banner.jpg`. Es una foto panorámica (1161x360) de fondo claro,
  así que el texto va en tinta oscura sobre un velo claro: horizontal en escritorio
  (modelo a la derecha) y vertical en móvil (modelo arriba, texto abajo).

## Datos

Es un demo estático: **no usa Supabase ni backend**. El catálogo está incrustado en
`js/data.js` y las fotos viven en `img/productos/`. Son los productos y precios reales
de la tienda al 15 de julio de 2026, copiados para que el demo funcione solo.

Los círculos son las **4 categorías reales** (Ropa, Deportiva, Lencería, Trajes de baño)
más "Novedades", que agrupa lo marcado como nuevo. Dentro de **Ropa** hay subcategorías
—Vestidos, Blusas y Tops, Jeans y Pantalones, Faldas— que se filtran con los chips del
listado y aparecen en el menú (`#/c/ropa/jeans`). Esas subcategorías hoy **no existen en
Supabase**: si esta propuesta se elige, hay que crearlas antes de conectar el catálogo real.

## Correr en local

Cualquier servidor estático sirve; hace falta uno porque el sitio carga `js/` por rutas relativas:

```bash
python -m http.server 8080
# o
npx serve .
```

## Publicar en Cloudflare Pages

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Elige este repo (`mxmiroperito/mi-roperito-demo`).
3. Build command: *(vacío)* · Build output directory: `/`
4. **Save and Deploy**.

No hay build ni variables de entorno: es HTML, CSS y JS plano.
