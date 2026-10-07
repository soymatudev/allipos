# 🏪 Allipos (Duolingo Style POS)

## 🎯 Objetivo del Proyecto
Desarrollar una aplicación web móvil (PWA) de Punto de Venta (POS) hiper-simplificada y accesible para niños de secundaria con barreras de aprendizaje o dificultades en el cálculo matemático durante una kermés escolar. 

La app reduce la carga cognitiva al mínimo mediante una interfaz táctil inspirada en Duolingo: botones gigantes con efecto 3D, colores llamativos y contrastantes, pasos secuenciales guiados, soporte 100% offline y cálculo automático del cambio.

---

## 🛠️ Stack Tecnológico
* **Build Tool:** Vite
* **Frontend:** Vanilla JS / HTML5 / CSS3 (o Tailwind CSS)
* **Persistencia:** `LocalStorage` (para productos, imágenes en Base64 e historial de ventas)
* **Efectos de Sonido:** Web Audio API (feedback sonoro al cobrar)
* **PWA:** Web App Manifest + Service Worker (para instalar en pantalla de inicio del celular)
* **Despliegue:** Vercel

---

## 📁 Estructura del Proyecto

```text
allipos/
├── public/
│   ├── favicon.ico
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── manifest.json
│   ├── sw.js
│   └── audio/
│       ├── click.mp3
│       └── success.mp3
├── src/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── store.js          # Control de LocalStorage y Estado
│   │   ├── audio.js          # Manejador de efectos de sonido
│   │   ├── ui/
│   │   │   ├── posView.js     # Interfaz de cobro (para alumnos)
│   │   │   ├── adminView.js   # Carga de productos (para profesores/alumnos)
│   │   │   └── summaryView.js # Reporte y corte de caja del día
│   │   └── app.js            # Punto de entrada de la aplicación
│   └── index.html
├── package.json
├── vite.config.js
└── vercel.json

```

---

## 💾 Esquemas de Datos (LocalStorage Schema)
1. kermes_products

```JSON
[
  {
    "id": "prod_1700000000000",
    "name": "Flan de Vainilla",
    "price": 15.00,
    "image": "data:image/webp;base64,..."
  }
]
```

2. kermes_sales
```JSON
{
  "totalSales": 150.00,
  "history": [
    {
      "id": "sale_1700000000100",
      "timestamp": "2026-10-06T10:30:00Z",
      "productId": "prod_1700000000000",
      "productName": "Flan de Vainilla",
      "quantity": 2,
      "totalPayable": 30.00,
      "amountPaid": 50.00,
      "changeReturned": 20.00
    }
  ]
}
```
---

## 🎨 Reglas de Diseño y Accesibilidad (Duolingo Style UI)

### 1- Botones Tactiles 3D:

* Borde inferior grueso (box-shadow: 0 5px 0 var(--color-shadow)).
* Esquinas muy redondeadas (border-radius: 16px).
* Animación de pulsación inmediata (active: transform translateY(4px)).

### 2- Paleta de Colores Contrastante:

* Principal (Verde Duolingo): #58cc02 / Sombra: #46a302
* Secundario (Azul): #1cb0f6 / Sombra: #1899d6
* Alerta / Borrar (Rojo): #ff4b4b / Sombra: #ea2b2b
* Billetes: $20 (Azul), $50 (Rosa), $100 (Amarillo/Ocre), $200 (Verde).
* Monedas: $10 (café).

### 3- Flujo Guiado Paso a Paso:

* Paso 1: Tocar la foto del producto deseado.
* Paso 2: Ajustar la cantidad con botones gigantes + y -.
* Paso 3: Tocar el botón del billete con el que pagaron ($20, $50, $100, $200, Pago Exacto).
* Paso 4: Ver el cambio a entregar en texto verde gigante y presionar el botón de confirmación con sonido festivo.

### 4- Validación de Errores: Si el pago es menor al total, deshabilitar la acción y mostrar una alerta visual clara: "¡Falta dinero!".

---

# 🚀 Plan de Desarrollo para Antigravity

## 1- Fase 1: Setup e Infraestructura Base
* Crear el proyecto Vite con la estructura de carpetas definida.
* Configurar vite.config.js y vercel.json para despliegue sin problemas en Vercel.
* Crear las variables CSS con el tema estilo Duolingo.

## 2- Fase 2: Módulo de Gestión de Productos (Admin View)
* Crear la vista de Ajustes / Configuración.
* Implementar formulario para añadir producto (Nombre, Precio y Foto).
* Convertir las fotos subidas desde la cámara/galería a Base64 con FileReader para persistir en LocalStorage.
* Permitir listar y borrar productos existentes.

## 3- Fase 3: Punto de Venta (POS View)
* Renderizar el catálogo de productos con sus fotos y precios en tarjetas grandes.
* Implementar selector de cantidad (+ / -) con cálculo dinámico del total.
* Rejilla de botones de billetes ($20, $50, $100, $200, Pago Exacto).
* Cálculo del cambio y pantalla de éxito.

## 4- Fase 4: Persistencia, Historial y Audio
* Guardar el historial de ventas y acumulado de "Vendido Hoy ($)" en LocalStorage.
* Agregar módulo audio.js para reproducir un efecto al presionar botones y un sonido de éxito al finalizar la venta.
* Agregar botón para reiniciar/limpiar la caja del día.

## 5- Fase 5: Configuración PWA y Vercel
* Generar manifest.json e incluir Service Worker para caché offline.
* Probar el proceso de build npm run build y la instalación en pantalla de inicio en un dispositivo móvil.