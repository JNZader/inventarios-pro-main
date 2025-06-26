# Inventarios Pro

sistema de inventario completo construido con React y Supabase, diseñado para una gestión de inventario eficiente y en tiempo real.

## Características

* **Gestión de productos:** Registra, actualiza y elimina productos con detalles como stock, precio de compra y venta, y más.
* **Seguimiento de inventario (Kardex):** Mantén un registro de todos los movimientos de inventario, incluyendo entradas y salidas.
* **Gestión de personal:** Administra usuarios y sus permisos dentro del sistema.
* **Manejo de categorías y marcas:** Organiza productos por categorías y marcas para una mejor gestión.
* **Reportes detallados:** Genera reportes de stock, movimientos de inventario y valoración de inventario.
* **Autenticación y autorización:** Sistema de inicio de sesión seguro con rutas protegidas basadas en roles.
* **Interfaz de usuario moderna y adaptable:** Construida con `styled-components` para una experiencia de usuario agradable en diferentes dispositivos.

## Tecnologías Utilizadas

### Frontend

* **React:** Biblioteca principal para construir la interfaz de usuario.
* **React Router:** Para el enrutamiento del lado del cliente.
* **Styled Components:** Para el estilo de los componentes.
* **TanStack Query (React Query):** Para la gestión del estado del servidor y el cacheo de datos.
* **Zustand:** Para la gestión del estado global del lado del cliente.
* **React Hook Form:** Para la gestión de formularios.
* **React Table:** Para la creación de tablas de datos potentes y flexibles.
* **SweetAlert2:** Para mostrar alertas y notificaciones atractivas.
* **React-PDF:** Para generar y visualizar reportes en formato PDF.

### Backend y Base de Datos

* **Supabase:** Plataforma de backend-as-a-service que proporciona base de datos, autenticación y más.

### Herramientas de Desarrollo

* **Vite:** Herramienta de construcción y servidor de desarrollo rápido para proyectos web modernos.
* **ESLint:** Para el análisis estático de código y la aplicación de reglas de estilo.

## Estructura del Proyecto

El repositorio está estructurado de la siguiente manera:

* `src/components`: Contiene componentes de React reutilizables, organizados por átomos, moléculas y organismos según la metodología de Atomic Design.
* `src/context`: Contiene el contexto de autenticación.
* `src/hooks`: Contiene hooks personalizados, como el `Layout` y las `ProtectedRoute`.
* `src/pages`: Contiene los componentes de página principales de la aplicación.
* `src/routers`: Contiene la configuración de las rutas de la aplicación.
* `src/store`: Contiene los stores de Zustand para la gestión del estado global.
* `src/supabase`: Contiene la configuración del cliente de Supabase y las funciones CRUD para interactuar con la base de datos.
* `src/styles`: Contiene los temas de estilo, breakpoints y variables globales.
* `src/utils`: Contiene utilidades y datos estáticos.

## Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone [https://github.com/tu-usuario/inventarios-pro-main.git](https://github.com/tu-usuario/inventarios-pro-main.git)
    cd inventarios-pro-main
    ```
2.  **Instala las dependencias:**

    ```bash
    npm install
    ```
3.  **Configura las variables de entorno:**

    Crea un archivo `.env` en la raíz del proyecto y agrega las credenciales de tu proyecto de Supabase:

    ```env
    VITE_APP_SUPABASE_URL=TU_URL_DE_SUPABASE
    VITE_APP_SUPABASE_ANON_KEY=TU_LLAVE_ANONIMA_DE_SUPABASE
    ```
    Puedes encontrar estas credenciales en el panel de control de tu proyecto de Supabase, en la sección "API".

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

* `npm run dev`: Inicia la aplicación en modo de desarrollo.
* `npm run build`: Compila la aplicación para producción.
* `npm run lint`: Ejecuta el linter para revisar el código.
* `npm run preview`: Sirve la compilación de producción localmente.