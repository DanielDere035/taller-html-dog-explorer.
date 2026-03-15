# Dog Explorer - Taller Evaluativo 1

## Descripción General

Dog Explorer es una aplicación web interactiva desarrollada para la materia de Ingeniería Web. Su objetivo es consumir datos de la [Dog CEO API](https://dog.ceo/dog-api/) de manera asíncrona proporcionando una interfaz para visualizar, buscar y filtrar diferentes razas de perros.

El proyecto implementa prácticas estándar de desarrollo Frontend, incluyendo código modular, estructura semántica en HTML5 y manejo de excepciones (errores de red o búsquedas sin resultados).

---

## Características Principales

- **Carga Aleatoria Inicial**: Al iniciar, la aplicación consulta el endpoint `/breeds/image/random/10` para mostrar 10 imágenes al azar.
- **Buscador por Raza**: Permite realizar consultas de razas específicas mediante un formulario validado (saneamiento de texto y entradas vacías).
- **Manejo de Errores Restrictivo**: Alerta visual dinámica. Si una búsqueda falla (HTTP status incorrecto o error interno de la API), se informa al usuario mediante la interfaz gráfica en lugar de fallar de manera silenciosa.
- **Persistencia de Favoritos**: Sistema de favoritos que permite guardar y eliminar selecciones mediante el uso del LocalStorage. Se implementa utilizando el patrón de Delegación de Eventos.
- **Diseño de Interfaz (Mobile-First)**: Interfaz responsiva con una estética limpia, estructurada y moderna. Utiliza la fuente tipográfica 'Outfit', variables CSS centralizadas y una distribución equilibrada basada en Flexbox y CSS Grid. Se implementan estándares de accesibilidad claves (`aria-labels`, `:focus-visible`).

---

## Tecnologías Implementadas

El proyecto fue construido utilizando Javascript, CSS y HTML nativo.

- **HTML5**: Uso de etiquetas semánticas (`<header>`, `<main>`, `<section>`, `<article>`).
- **CSS3 Moderno**: 
  - Gestión de variables (`Custom Properties`).
  - Layout construido mediante Flexbox y CSS Grid.
  - Aplicación de arquitectura de nombres BEM.
- **JavaScript (ES6+)**:
  - `Promises` y flujos asíncronos mediante `async/await`.
  - `Fetch API` para el consumo de datos REST.
  - `Web Storage API` (`LocalStorage`) para modelado y persistencia en cliente.

---

## Instrucciones de Ejecución

El proyecto no requiere procesos de compilación. Para ejecutar la aplicación:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/TuUsuario/taller-html-Daniel-Duque-Rivera.git
   ```
2. **Acceder al directorio:**
   ```bash
   cd taller-html-Daniel-Duque-Rivera
   ```
3. **Ejecutar la interfaz:**
   - **Recomendado:** Abrir el directorio en Visual Studio Code y ejecutar la extensión *Live Server*.
   - **Alternativa:** Abrir directamente el archivo `index.html` en cualquier navegador web moderno.

---

## Estructura de Archivos

```text
taller-html-Daniel-Duque-Rivera/
├── index.html      # Estructura semántica, accesibilidad y contenedores
├── styles.css      # Sistema de diseño, grid, responsividad y estados UI
├── app.js          # Lógica modular, peticiones fetch y persistencia
└── README.md       # Documentación del proyecto
```

---

**Autor:** Daniel Duque Rivera  
*Desarrollado para Ingeniería Web - 2026*
