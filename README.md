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
- **Círculos de categoría: varios a la vista.** En escritorio caben los 8 en una fila;
  en móvil se ven 4.5 con scroll horizontal, no 2.
- **Info en 4 bloques**, el último en degradado rosa, como en la referencia.

## Datos

Es un demo estático: **no usa Supabase ni backend**. El catálogo está incrustado en
`js/data.js` y las fotos viven en `img/productos/`. Son los productos y precios reales
de la tienda al 15 de julio de 2026, copiados para que el demo funcione solo.

Las 4 categorías reales (Ropa, Deportiva, Lencería, Trajes de baño) se abrieron en 8
círculos (Novedades, Vestidos, Blusas y Tops, Jeans y Pantalones, Faldas, Deportiva,
Lencería, Trajes de baño) para lograr el efecto de "varias categorías a la vez".
Si esta propuesta se elige, esas categorías se crean en Supabase y el sitio se conecta
al catálogo real.

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
