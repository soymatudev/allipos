# 🏪 Allipos - Punto de Venta Accesible e Intuitivo

<p align="center">
  <strong>Punto de Venta (POS) móvil y PWA hiper-simplificado estilo Duolingo 3D, diseñado para reducir la carga cognitiva en kermeses escolares y entornos inclusivos.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Vanilla JS" />
  <img src="https://img.shields.io/badge/CSS3-Duolingo%203D%20UI-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/PWA-100%25%20Offline-58cc02?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA Offline" />
  <img src="https://img.shields.io/badge/Autor-Juan%20Maturana%20(@soymatudev)-1cb0f6?style=for-the-badge" alt="Author" />
</p>

---

## 🎯 ¿Qué es Allipos?

**Allipos** es una aplicación web progresiva (PWA) desarrollada específicamente para permitir que niños y jóvenes —incluyendo alumnos con barreras de aprendizaje o dificultades en el cálculo matemático mental— puedan gestionar el cobro, conteo de dinero y entrega de cambio en una kermés escolar de manera **autónoma, segura y divertida**.

Inspirada en las mejores prácticas de microaprendizaje y gamificación de **Duolingo**, la interfaz elimina cualquier cálculo manual complejo, guiando al usuario paso a paso con componentes táctiles gigantes, colores de alto contraste, fotografías reales de monedas y billetes, y asistencia auditiva con voz nativa en español.

---

## ✨ Características Principales

### 1. 🎨 Sistema de Diseño Táctil 3D (Duolingo Style UI)
* **Botones con relieve 3D:** Bordes inferiores gruesos y animaciones de compresión táctil (`:active`) que ofrecen una respuesta física visual gratificante.
* **Paleta de Alto Contraste:** 
  * 🟢 **Verde (#58cc02):** Confirmación, éxito y avance.
  * 🔵 **Azul (#1cb0f6):** Opciones secundarias y acciones especiales.
  * 🟡 **Amarillo (#ffc800):** Navegación hacia atrás y recarga.
  * 🔴 **Rojo (#ff4b4b):** Acciones destructivas o borrado.
* **Diseño Mobile-First:** Diseñado para smartphones en orientación vertical sin desbordamientos ni scroll innecesario.

---

### 2. 🛒 Flujo Guiado de Cobro en 4 Pasos

1. **Paso 1: Selección de Producto**
   * Catálogo visual con tarjetas grandes, fotografía del producto, nombre y precio en tipografía destacada.
2. **Paso 2: Ajuste de Cantidad**
   * Controles gigantes de `+` y `-` con cálculo dinámico en tiempo real del total a cobrar.
3. **Paso 3: Recepción de Dinero & Reconocimiento Visual**
   * **Reconocimiento con fotos reales:** Botones táctiles interactivos con fotografías de las monedas y billetes mexicanos en circulación (**$1, $2, $5, $10, $20, $50 y $100**).
   * **Suma acumulativa por toque:** Cada pulsación suma el valor correspondiente.
   * **Teclado numérico directo:** Campo numérico nativo (`inputmode="decimal"`) para escribir montos arbitrarios.
   * **Botones inteligentes:** *✨ ¡Pago Exacto!* y *🧹 Borrar*.
   * **Validación en tiempo real:** Aviso visual si el dinero recibido es insuficiente ("Faltan $X.XX").
4. **Paso 4: Entrega de Cambio, Desglose Visual y Éxito**
   * Indicador del cambio a entregar en texto gigante verde.
   * **Desglose gráfico exacto:** Muestra cuántas monedas y billetes de cada denominación deben entregarse al cliente con sus fotos reales (ej. `1x Billete de $20`, `2x Moneda de $2`, `1x Moneda de $1`).
   * **🔄 Múltiples Formas de Cambio:** Botón dinámico para alternar entre diferentes combinaciones de monedas y billetes si la caja no cuenta con una denominación específica (ej. cambiar $15 de `1x $10 y 1x $5` a `3x $5` o `1x $10, 2x $2 y 1x $1`).

---

### 3. 🔊 Asistente de Voz y Efectos de Sonido Nativos

* **Dictado por Voz (Web Speech API):**
  * **Al sumar dinero (Paso 3):** La voz pronuncia instantáneamente la denominación tocada (*"1 peso"*, *"2 pesos"*, *"5 pesos"*, *"20 pesos"*), reforzando el reconocimiento del valor.
  * **Al calcular el cambio (Paso 4):** Dicta automáticamente en español latinoamericano la instrucción completa: *"El cambio es de 25 pesos. Entrega al cliente: 1 billete de 20 pesos y 1 moneda de 5 pesos."*
  * **Botón `🔊 Escuchar`:** Permite repetir la explicación por voz cuantas veces sea necesario.
* **Síntesis Web Audio API (Sin archivos externos):**
  * Pop táctil Duolingo al presionar botones.
  * Tono de advertencia suave ante montos faltantes.
  * Fanfarria festiva de victoria (progresión en Do Mayor C5-E5-G5-C6) al completar una venta.

---

### 4. 📦 Administración de Productos (Admin View)
* Catálogo base preconfigurado con productos típicos de kermés (Gelatinas, Aguas Frescas, Gomitas, etc.) con fotos reales de inventario.
* Formulario para añadir y editar productos (Nombre, Precio y Foto).
* Carga de fotografías desde la cámara o galería del dispositivo convertidas a Base64 con `FileReader`.
* **Versionado Automático & Botón `🔄 Recargar Catálogo Base`:** Sincronización instantánea entre el código y el `LocalStorage` del navegador sin necesidad de borrar datos manuales.

---

### 5. 📊 Corte de Caja y Reportes (Summary View)
* Acumulador en tiempo real del **Total Vendido Hoy ($)** y total de transacciones completadas.
* Historial cronológico con desglose de hora, producto, cantidad, dinero recibido y cambio entregado.
* Botón seguro para reiniciar la caja al inicio de una nueva jornada escolar.

---

### 6. 📱 100% Offline & PWA (Instalable)
* **Web App Manifest:** Permite instalar la aplicación directamente en la pantalla de inicio del teléfono en modo *standalone* (sin barra de direcciones del navegador).
* **Service Worker (`public/sw.js`):** Estrategia de caché de todos los recursos (HTML, CSS, JS, imágenes de dinero e inventario), garantizando funcionamiento ininterrumpido en patios escolares o ferias **sin acceso a Internet ni Wi-Fi**.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Herramienta de Construcción** | [Vite](https://vitejs.dev/) |
| **Arquitectura Frontend** | Vanilla JavaScript (ES Modules nativos) |
| **Estructura Semántica** | HTML5 Móvil PWA |
| **Estilos y Animaciones** | CSS3 Moderno (Vanilla CSS, variables y efectos 3D) |
| **Tipografía** | Nunito (Google Fonts) |
| **Persistencia de Datos** | `LocalStorage` API (Productos, historial y ventas) |
| **Audio y Fanfarria** | Web Audio API nativo |
| **Síntesis de Voz** | Web Speech API (`SpeechSynthesis`, español `es-MX`) |
| **Capacidades Offline** | Service Worker + Web App Manifest |

---

## 📁 Estructura del Repositorio

```text
allipos/
├── public/
│   ├── manifest.json            # Manifiesto PWA para instalación móvil
│   ├── sw.js                    # Service Worker con caché offline
│   ├── icon-192.png             # Ícono de la aplicación (192px)
│   └── icon-512.png             # Ícono de alta resolución (512px)
├── src/
│   ├── assets/
│   │   ├── diner/               # Fotografías de billetes y monedas ($1, $2, $5, $10, $20, $50, $100)
│   │   └── inventory/           # Fotografías de productos e inventario
│   ├── css/
│   │   └── style.css            # Sistema de diseño Duolingo 3D y reglas responsive
│   └── js/
│       ├── app.js               # Punto de entrada y enrutador de pestañas
│       ├── audio.js             # Motor de Web Audio API y Web Speech API
│       ├── store.js             # Modelo de datos, persistencia LocalStorage y versionado
│       └── ui/
│           ├── posView.js       # Interfaz principal de cobro en 4 pasos
│           ├── adminView.js     # Gestión y catálogo de productos
│           └── summaryView.js   # Corte de caja e historial del día
├── index.html                   # Documento principal HTML5
├── package.json                 # Dependencias y scripts de Vite
├── vite.config.js               # Configuración del bundler
├── vercel.json                  # Configuración para despliegue en Vercel
├── DOCUMENTACION_CAMBIOS.md     # Bitácora detallada de cambios técnicos y UX
└── README.md                    # Esta documentación
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
* [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).
* `npm` o cualquier gestor de paquetes compatible.

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/soymatudev/allipos.git
   cd allipos
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre el enlace proporcionado (por defecto `http://localhost:5173`) en tu navegador o escanea la IP local desde tu teléfono móvil conectado a la misma red Wi-Fi.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Los archivos listos para producción se generarán en la carpeta `dist/`.

---

## 📲 Instalación en Celulares (PWA)

1. Abre la aplicación desde Chrome o Safari en tu teléfono móvil.
2. Presiona el botón del menú del navegador (los tres puntos en Chrome o el botón de compartir en Safari).
3. Selecciona **"Agregar a la pantalla principal"** o **"Instalar aplicación"**.
4. ¡Listo! **Allipos** se abrirá en pantalla completa como una aplicación nativa y funcionará incluso con el modo avión activado.

---

## 👨‍💻 Autor y Créditos

Desarrollado con ❤️ para la educación inclusiva y la accesibilidad escolar:

* **Juan Maturana** — [@soymatudev](https://github.com/soymatudev)

---

## 📄 Licencia

Distribuido bajo la Licencia **MIT**. Consulta `LICENSE` para más información.
