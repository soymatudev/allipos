# 📘 Documentación de Cambios y Desarrollo - Allipos

Este documento registra todas las funcionalidades creadas, refactorizaciones y ajustes de diseño/UX realizados tanto en el desarrollo colaborativo como en los ajustes finos de interfaz.

---

## 🛠️ 1. Infraestructura y Arquitectura Base
* **Tecnologías:** Vanilla JavaScript (ES Modules), HTML5, CSS3 Nivel Producción y Vite.
* **PWA & Capacidades Offline:** 
  * Inclusión de `public/manifest.json` configurado en modo `standalone` para instalación en pantalla de inicio como **Allipos**.
  * Implementación de Service Worker (`public/sw.js`) con caché `allipos-v1` para funcionamiento **100% offline**.
* **Despliegue:** Configuración en `vercel.json` y `package.json` para despliegue continuo en Vercel.
* **Pie de Página (Créditos):** Firma sutil en la parte inferior de la pantalla: `Allipos By Juan Maturana @soymatudev`.

---

## 🎨 2. Sistema de Diseño (Estilo Duolingo 3D UI)
* **Botones Tactiles 3D (`src/css/style.css`):**
  * Bordes inferiores gruesos (`box-shadow: 0 5px 0 var(...)`).
  * Esquinas redondeadas estilo píldora/tarjeta (`border-radius: 16px`).
  * Animaciones de pulsación activa (`transform: translateY(4px)`).
* **Paleta de Colores de Alto Contraste:**
  * Verde Duolingo (`#58cc02` / Sombra `#46a302`) - Confirmación y éxito.
  * Azul (`#1cb0f6` / Sombra `#1899d6`) - Navegación y edición.
  * Rojo (`#ff4b4b` / Sombra `#ea2b2b`) - Borrado y deshabilitado.
  * Amarillo (`#ffc800` / Sombra `#e5b200`) - Volver / Regresar.
  * Naranja (`#ff9600`) / Morado (`#ce82ff`) - Billetes y Monedas.
* **Optimización Móvil:** 
  * Header optimizado con el logo de la tienda para asegurar que las 3 pestañas principales (`🛒 Cobrar`, `📦 Productos`, `📊 Corte`) quepan perfectamente en cualquier smartphone.

---

## 🛒 3. Flujo Guiado del Punto de Venta (`src/js/ui/posView.js`)

### 🔄 Flujo en 4 Pasos:
1. **Paso 1: Selección de Producto** - Tarjetas grandes con foto, nombre y precio.
2. **Paso 2: Cantidad** - Controles gigantes `+` y `-` con cálculo dinámico del total.
3. **Paso 3: Cobro de Dinero** - Selección/Suma de dinero recibido y cálculo de cambio.
4. **Paso 4: Venta Exitosa y Asistencia por Voz** - Pantalla de felicitación con cambio a entregar en verde gigante, desglose visual de billetes/monedas y dictado automático por voz del cambio.

### 🧠 Ajustes Cognitivos y Accesibilidad en el Cobro (Paso 3 y Paso 4):
* **Nuevas Monedas de $1 y $2 Pesos (Paso 3 y Paso 4):**
  * Inclusión de botones con imágenes reales para las monedas de **$1 peso** (`diner1.png`) y **$2 pesos** (`diner2.png`), completando el rango monetario mexicano ($1, $2, $5, $10, $20, $50, $100).
  * Estilos 3D táctiles diferenciados con paleta de alto contraste (`.bill-1` y `.bill-2`).
* **Voz Inmediata por Denominación al Sumar Dinero (Paso 3):**
  * Al tocar cualquier botón de billete o moneda, la síntesis de voz pronuncia inmediatamente la cantidad ingresada (ej. *"1 peso"*, *"2 pesos"*, *"5 pesos"*, *"20 pesos"*), facilitando el aprendizaje y la confirmación auditiva instantánea para los alumnos.
  * También pronuncia confirmación auditiva al presionar *¡Pago Exacto!* o *Borrar*.
* **Múltiples Formas de Entregar el Cambio (Paso 4):**
  * Motor inteligente de combinaciones de cambio que calcula de forma dinámica y realista alternativas válidas para una misma cantidad.
  * Botón interactivo **`🔄 Ver otra forma de dar cambio`** con contador de opciones (ej. `1/3`, `2/3`).
  * Si el alumno o la caja no cuenta con una moneda específica (por ejemplo, para $15 no tiene una moneda de $10 y $5), puede pulsar el botón para ver y escuchar combinaciones alternativas (ej. *3 monedas de $5* o *1 de $10, 2 de $2 y 1 de $1*).
  * Cada cambio de opción actualiza inmediatamente las tarjetas visuales con las fotos y reproduce la explicación por voz.
* **Desglose Visual del Cambio y Asistente de Voz Nativo (Paso 4):**
  * Cálculo óptimo inicial del cambio en monedas y billetes reales ($100, $50, $20, $10, $5, $2, $1).
  * Renderizado de mini-tarjetas con la imagen real de cada moneda/billete a entregar y la cantidad exacta (`1x Billete de $20`, `2x Moneda de $2`, `1x Moneda de $1`, etc.).
  * Lectura automática al ingresar al Paso 4 dictando la frase natural adaptada gramaticalmente a singular/plural (*"1 peso"* / *"pesos"*).
  * Botón **`🔊 Escuchar`** para repetir el dictado de la combinación activa.
* **Teclado Numérico Nativo Directo:**
  * Implementación del campo `<input type="number" inputmode="decimal">` que despliega inmediatamente el teclado numérico en celulares.
* **Billetes y Monedas Acumulables por Toque ($1, $2, $5, $10, $20, $50, $100):**
  * Denominaciones visuales que se van sumando acumulativamente con cada toque.
  * Botón de **`✨ ¡PAGO EXACTO!`** y botón de **`🧹 Borrar`**.
* **Posicionamiento de Botones de Acción (Trabajo Conjunto + Ajustes del Usuario):**
  * Los botones principales **`⬅️ Volver`** y **`Calcular Cambio ➡️`** fueron posicionados **arriba de los avisos/alertas de dinero**, garantizando que **siempre queden 100% visibles sin necesidad de hacer scroll** en ninguna pantalla.
  * La alerta visual (*"Recibido < Total. Faltan $X.XX"*) se muestra abajo sin empujar los botones fuera de vista.

---

## 📦 4. Módulo de Administración de Productos (`src/js/ui/adminView.js` & `store.js`)
* **Catálogo Base con Imágenes Reales de Inventario (`src/assets/inventory/`):**
  * Se configuraron los productos por defecto vinculados a las imágenes reales de inventario (`prod_001.jpeg` a `prod_011.jpeg`).
  * **Sistema de Versionado Automático (`CURRENT_CATALOG_VERSION`):** Cuando se modifican los productos en el código (`INITIAL_PRODUCTS`), la aplicación detecta la nueva versión y actualiza automáticamente el `LocalStorage` sin requerir acciones técnicas del usuario.
  * **Botón Manual `🔄 Recargar Catálogo Base`:** En la pestaña de **📦 Productos**, se integró un botón táctil amarillo para forzar la sincronización manual inmediata con los productos definidos en el código.
* **Edición de Productos Existentes (`Store.updateProduct`):**
  * Inclusión del botón **`✏️ Editar`** en cada producto del catálogo.
  * Modo de edición que carga automáticamente el Nombre, Precio y Foto previa para ser modificados.
* **Fotos en Base64:**
  * Conversión automática de fotos de cámara/galería a Base64 mediante `FileReader` para almacenamiento directo en `LocalStorage`.
* **Eliminación de Productos:** Botón de borrado con alerta de confirmación.

---

## 📊 5. Módulo de Corte de Caja y Reportes (`src/js/ui/summaryView.js`)
* **Total Vendido Hoy ($):** Tarjeta acumulativa del total cobrado en la jornada.
* **Historial de Ventas:** Lista cronológica con hora, producto, cantidad, dinero pagado y cambio entregado.
* **Reiniciar Caja:** Botón para reiniciar el contador e historial del día.

---

## 🔊 6. Efectos de Sonido Nativo (`src/js/audio.js`)
* Implementado con **Web Audio API** (sin depender de archivos `.mp3` externos):
  * **Pop táctil** al presionar botones.
  * **Tono de advertencia** para errores o faltante de dinero.
  * **Fanfarria de victoria** (acorde mayor C5-E5-G5-C6) al concluir cada venta.

---

## 🎨 7. Ajustes Finos de Estilos y Formateo (Realizados por el Usuario)
* Ajuste de márgenes y bordes en `.total-banner` (`margin: 0px`).
* Limpieza y formateo en CSS para estados de activación `:active` y reglas `@keyframes shake`.
* Ajuste fino en paddings y márgenes de los contenedores `.quantity-container`, `.bottom-nav` y `.alert-box`.
* Optimización del tamaño de botones en el Paso 4 para conclusión rápida de ventas.

---

### 🚀 Estado Actual del Proyecto
El proyecto se encuentra **100% funcional, probado y listo para producción / despliegue en Vercel** o ejecución local.
