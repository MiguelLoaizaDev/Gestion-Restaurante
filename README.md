# Sistema de Gestión de Restaurante

Este proyecto es una aplicación web desarrollada con React + Vite para la gestión integral de un restaurante. Permite administrar mesas, pedidos, inventario y generar reportes.

## Características

- **Gestión de Mesas**
  - Vista de planta del restaurante
  - Estado de mesas en tiempo real
  - Gestión de pedidos por mesa

- **Inventario**
  - Registro de productos
  - Registro de ingredientes
  - Control de stock

- **Reportes**
  - Visualización de ventas
  - Estado del inventario
  - Estadísticas generales

## Tecnologías Utilizadas

- React 18
- Vite
- Bootstrap 5
- React Router Dom
- React Icons

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd gestion-restaurante
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
gestion-restaurante/
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── pages/           # Páginas principales
│   ├── styles/          # Archivos CSS y variables
│   └── App.jsx          # Componente principal
├── public/              # Archivos estáticos
└── package.json         # Dependencias y scripts
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la versión de producción

## Plugins de Vite

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) - Utiliza Babel para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) - Utiliza SWC para Fast Refresh

## Configuración ESLint

Para desarrollo en producción, se recomienda usar TypeScript con reglas de lint conscientes de tipos. Consulta el [template TS](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) para más información.

## Contribuir

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
