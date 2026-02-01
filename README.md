# Resort — Aplicación Frontend

## Descripción

Interfaz frontend para la administración de un resort. Proyecto ligero basado en Vite que organiza el código en vistas, servicios de API y utilidades. Incluye `db.json` como mock de datos para desarrollo local.

## Dependencias (y por qué se usan)

Las dependencias reales del proyecto están declaradas en `package.json`. A continuación se listan las que aparecen actualmente y su propósito:

- **vite** (devDependency, ^7.1.7): servidor de desarrollo rápido y bundler para producción. Proporciona recarga en caliente (HMR), build optimizada y una experiencia de desarrollo moderna.
- **json-server** (devDependency, ^0.17.4): servidor REST mock que expone `db.json` como una API JSON. Útil para desarrollo y pruebas sin un backend real.
- **concurrently** (devDependency, ^9.2.1): permite ejecutar varios procesos en paralelo (por ejemplo `vite` y `json-server`) desde un mismo script `npm run dev`.

Notas:
- No hay dependencias de runtime en `dependencies` (todo está en `devDependencies`). Esto indica que la app es una SPA estática que se sirve como archivos estáticos en producción.
- Bootstrap y otros assets están incluidos localmente en `src/assets/`, por lo que no dependen de paquetes npm externos.

## Tecnologías principales

- JavaScript (ES Modules)
- Vite (desarrollo y build)
- HTML/CSS con Bootstrap (archivos en `src/assets/bootstrap`)

## Requisitos previos

- Node.js 16+ y npm (o Yarn). Node se usa para instalar paquetes y ejecutar los scripts de desarrollo/compilación.

## Instalación

1. Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd resort
```

2. Instalar dependencias:

```bash
npm install
# o
# yarn install
```

## Scripts (desde `package.json`)

El `package.json` actual define el siguiente script:

```json
"scripts": {
  "dev": "concurrently \"vite\" \"json-server --watch db.json --port 8080\""
}
```

- `npm run dev`: ejecuta `vite` (servidor de desarrollo) y `json-server` (API mock) en paralelo. `json-server` sirve `db.json` en el puerto `8080`.

Si deseas ejecutar únicamente `json-server` u otro servicio, puedes hacerlo con `npx json-server --watch db.json --port 3000`.

## Estructura de carpetas (vista en árbol)

La siguiente representación muestra la estructura actual del proyecto con los archivos y carpetas más relevantes:

```
resort/
├── db.json
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.js
    ├── api/
    │   └── services/
    │       └── auth.service.js
    ├── assets/
    │   ├── bootstrap/
    │   │   ├── bootstrap.css
    │   │   ├── bootstrap.min.css
    │   │   └── ...
    │   ├── img/
    │   └── js/
    ├── routes/
    │   └── router.js
    ├── utils/
    │   └── store.js
    └── views/
        ├── dashboardView.js
        ├── estadisticasView.js
        ├── loginView.js
        ├── menuView.js
        ├── notFoundView.js
        ├── ordersView.js
        ├── perfilView.js
        └── registerView.js

```

Notas sobre la estructura:
- `src/main.js` es el punto de entrada que suele inicializar el router y montar la aplicación.
- `src/api/services/` contiene wrappers para llamadas HTTP; centralizar aquí facilita cambiar el backend o la baseURL.
- `src/assets/bootstrap/` contiene todos los archivos CSS/JS de Bootstrap incluidos en el proyecto.

## Desarrollo local

Para ejecutar el entorno de desarrollo (según el `script` definido):

```bash
npm run dev
```

Esto levantará el servidor de Vite (por defecto `http://localhost:5173`) y `json-server` en `http://localhost:8080`.

Si prefieres ejecutar `json-server` en otro puerto para evitar conflictos:

```bash
npx json-server --watch db.json --port 3000
```

y en otra terminal:

```bash
npx vite
```

## Producción y despliegue

1. Generar build:

```bash
npm run build
```

2. Desplegar el contenido de `dist/` en un hosting estático (Netlify, Vercel, S3, GitHub Pages, etc.).

## Recomendaciones

- Extraer configuración de la API (base URL, puertos) a variables de entorno o a un archivo `config` para facilitar despliegues.
- Añadir un pequeño README dentro de `src/api/` explicando las rutas que consume la aplicación y cómo mapearlas al `db.json`.
- Considerar añadir linters (`eslint`) y formateadores (`prettier`) como dependencias de desarrollo si se requiere uniformidad en el código.

## Contribuir

1. Crear un branch con prefijo `feature/` o `fix/`.
2. Ejecutar `npm install` y probar los cambios en `npm run dev`.
3. Enviar un Pull Request describiendo los cambios.

## Licencia

Agregar la licencia (por ejemplo MIT) si se desea publicar.

## Contacto

Para preguntas o detalles sobre la implementación, revisa los archivos en `src/` o abre un issue en el repositorio.
