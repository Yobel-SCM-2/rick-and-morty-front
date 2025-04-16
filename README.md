# 🌀 Rick and Morty API Frontend (Angular)

> Interfaz web creada con Angular que consume datos de la API de Rick and Morty mediante un backend reactivo con Spring WebFlux.

---

## 🚀 Tecnologías utilizadas

- 🅰️ **Angular 16**
- 🧠 **TypeScript**
- 🎨 **Angular Material** (UI moderna y responsiva)
- 🔁 **RxJS** (programación reactiva)
- 🧾 **PDFMake** para generación de PDFs
- 🧪 **Jasmine** y **Karma** para pruebas unitarias
- 💅 **HTML5 + SCSS** para diseño responsivo

---

## ✅ Funcionalidades implementadas

### 🧬 Modelado de datos

- Interfaces para `Character`, `Location`, `Episode` y `Origin`.
- Modelos optimizados para consumo desde el backend.

### 🖼️ Construcción de vistas

- Página principal con listado paginado de personajes.
- Componentes reutilizables: `Header`, `Footer`, `CharacterDetail`, etc.

### 🔍 Búsqueda de personajes

- Por nombre o ID.
- Resultados detallados con opción de exportar como PDF.

### 🚫 Página 404

- Página de error personalizada para rutas no válidas.

### 📱 Diseño responsivo

- Adaptación a dispositivos móviles y escritorio usando Flexbox y CSS Grid.

### ⚠️ Gestión de errores

- Manejo centralizado mediante `ErrorHandlerService`.
- Mensajes visuales claros y opciones de recuperación.

### 🧪 Testing

- Pruebas unitarias con **Jasmine** y **Karma**.
- Cobertura en componentes y servicios clave.
- Uso de **Mocks** para simular respuestas del backend.

---

## 🧾 Estructura del proyecto

```
rick-and-morty-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── character-list/
│   │   │   ├── character-search/
│   │   │   ├── character-detail/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   └── not-found/
│   │   ├── models/
│   │   ├── services/
│   │   ├── app-routing.module.ts
│   │   └── app.module.ts
├── assets/
│   └── images/
├── environments/
├── index.html
├── styles.scss
└── main.ts
```

---

## 🌟 Características destacadas

- ✅ **Listado paginado de personajes**
- ✅ **Búsqueda avanzada con filtros**
- ✅ **Detalles completos y exportación a PDF**
- ✅ **Diseño UI responsivo y moderno**
- ✅ **Manejo robusto de errores**
- ✅ **Pruebas unitarias con buena cobertura**

---

## 📸 Pantallas de la aplicación

- 🏠 **Inicio**: Lista de personajes paginada
- 🔍 **Búsqueda**: Por nombre o ID
- 👤 **Detalle**: Información extendida de cada personaje
- ❌ **404**: Página personalizada para rutas inexistentes

---

## ⚙️ Configuración e instalación

### 📌 Requisitos previos

- **Node.js 14+**
- **npm 6+**
- **Angular CLI 16+**

### 🛠️ Instrucciones

```bash
# Clonar el repositorio
git clone https://github.com/Yobel-SCM-2/rick-and-morty-front.git
cd rick-and-morty-front

# Instalar dependencias
npm install

# Configurar la URL del backend
# Editar: src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};

# Ejecutar en modo desarrollo
ng serve
# Disponible en: http://localhost:4200

# Compilar para producción
ng build --prod

# Ejecutar pruebas
ng test
```

---

## 🖥️ Integración con el backend

Este frontend se conecta con el backend disponible en:

[**Rick and Morty Backend (Spring WebFlux)**](https://github.com/Yobel-SCM-2/rick-and-morty-back)

> Se recomienda ejecutar ambos proyectos simultáneamente para una experiencia completa.

---

## 📦 Dependencias principales

```json
"dependencies": {
    "@angular/animations": "^16.2.0",
    "@angular/cdk": "^16.2.14",
    "@angular/common": "^16.2.0",
    "@angular/compiler": "^16.2.0",
    "@angular/core": "^16.2.0",
    "@angular/forms": "^16.2.0",
    "@angular/material": "^16.2.14",
    "@angular/platform-browser": "^16.2.0",
    "@angular/platform-browser-dynamic": "^16.2.0",
    "@angular/router": "^16.2.0",
    "html2canvas": "^1.4.1",
    "pdfmake": "^0.1.72",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.13.0"
  }
```

---

## 📬 Contacto

¿Tienes dudas o sugerencias sobre el proyecto? ¡No dudes en escribirme!
