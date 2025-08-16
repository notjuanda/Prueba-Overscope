# Backend Overscope

## Variables de entorno
Crea un archivo `.env` en la raíz. Se usan variables desglosadas para la BD y luego se arma `DATABASE_URL` (python-dotenv expande `${VAR}`):

| Variable | Obligatoria | Descripción | Ejemplo |
|----------|-------------|-------------|---------|
| FLASK_ENV | No | Entorno (`development` / `production`) | `development` |
| JWT_SECRET | Sí | Clave secreta JWT HS256 | `clavesupersecreta@123flask` |
| DB_HOST | Sí | Host MySQL | `localhost` |
| DB_PORT | Sí | Puerto MySQL | `3306` |
| DB_USER | Sí | Usuario MySQL | `root` |
| DB_PASSWORD | Sí | Password MySQL | `root` |
| DB_NAME | Sí | Nombre BD | `prueba` |
| DATABASE_URL | Sí | URL construida (no poner comillas) | `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}` |
| PORT | No | Puerto externo (referencia) | `5000` |
| HOST | No | Host externo (referencia) | `localhost` |

```
FLASK_ENV=development

JWT_SECRET=clavesupersecreta@123flask

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=prueba

DATABASE_URL=mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

UPLOAD_FOLDER=uploads
PRODUCT_IMAGE_SUBFOLDER=products
MAX_CONTENT_LENGTH=5242880

PORT=5000
HOST=localhost
```

API REST en Flask con autenticación JWT vía cookie HttpOnly, manejo de categorías, productos (con subida de imágenes) y usuarios (registro / login / logout).

## Tecnologías
- Python 3.13+
- Flask
- Flask-SQLAlchemy
- MySQL (u otro motor compatible con SQLAlchemy)
- Marshmallow (validación)
- PyJWT (tokens JWT)
- PyMySQL (driver MySQL)

## Instalación y ejecución
1. Entorno virtual:
```
python -m venv .venv
```
2. Activar:
```
.venv\Scripts\activate   # Windows
source .venv/bin/activate  # Linux/Mac
```
3. Dependencias:
```
pip install -r requirements.txt
```
4. Configurar `.env`.
5. Run:
```
python -m flask run
```
Notas: 
- El punto de entrada de la app es `app.py`. 
- Las tablas se crean automaticamente usando `db.create_all()`.

## Autenticación
- Registro/Login generan JWT con claims `sub`, `email`, `iat`, `exp`.
- Cookie `access_token` HttpOnly (usar `secure=True` en prod HTTPS).
- `login_required` valida token de cookie.
- Logout invalida cookie.

## Usuarios
| Endpoint | Método | Auth | Descripción |
|----------|--------|------|-------------|
| /users/register | POST | No | Registrar usuario |
| /users/login | POST | No | Login |
| /users/logout | POST | Sí | Logout |

## Categorías (requiere login)
CRUD completo en `/categories`.

## Productos (requiere login)
CRUD en `/products`, subida de imagen multipart, campo `imagen`.

- Extensiones: jpg, jpeg, png, webp
- Ruta guardada en BD: relativa `products/<archivo>`

## Errores comunes
400 validación, 401 auth, 404 no encontrado, 415 tipo contenido, 500 interno.

Listo.

# Sistema de Gestión de Productos - Frontend

ejecutar al inciar: npm install


Sistema de administración de productos y categorías desarrollado con Angular 20 que implementa arquitectura limpia con autenticación JWT.

## Características

- **Autenticación completa**: Login y registro de usuarios con JWT
- **Gestión de productos**: CRUD completo
- **Gestión de categorías**: Sistema de categorización para productos
- **Filtrado por categorías**: Filtro dinámico de productos por categoría
- **Interfaz responsive**: Diseño adaptativo para desktop y móvil
- **Navegación intuitiva**: Header responsive con menú móvil
- **Arquitectura limpia**: Separación por capas
- **Interceptor HTTP**: Manejo automático de credenciales
- **Modales modernas**: Interfaces de usuario limpias y funcionales

## 🛠️ Tecnologías

- **Angular 20.1.6**: Framework principal con sintaxis moderna
- **TypeScript**: Lenguaje de programación
- **TailwindCSS**: Framework de estilos
- **Signals**: Manejo de estado reactivo
- **Standalone Components**: Arquitectura moderna de Angular
- **HTTP Client**: Comunicación con API REST

## Prerrequisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene incluido con Node.js)
- **Angular CLI** (se instalará automáticamente)

Verificar instalaciones:
```bash
node --version
npm --version
```

## Instalación

1. **Clonar el repositorio** (si aplica):
```bash
git clone <url-del-repositorio>
cd frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
El proyecto incluye configuración para desarrollo en `src/environments/environment.ts`. Verificar que la URL del backend sea correcta:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

## Ejecución del Proyecto

### Modo Desarrollo

Para iniciar el servidor de desarrollo:
```bash
npm start
# o
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`

### Modo Producción

Para construir el proyecto para producción:
```bash
npm run build
# o
ng build --configuration production
```

Los archivos compilados se generarán en la carpeta `dist/`

## Estructura del Proyecto

```
src/
├── app/
│   ├── auth/                    # Módulo de autenticación
│   │   ├── data/               # Implementaciones de repositorios
│   │   ├── domain/             # Modelos, contratos y casos de uso
│   │   └── presentation/       # Componentes de UI (login, register)
│   ├── category/               # Módulo de categorías
│   │   ├── data/               # Repositorio de categorías
│   │   ├── domain/             # Lógica de negocio
│   │   └── presentation/       # Componentes de UI
│   ├── product/                # Módulo de productos
│   │   ├── data/               # Repositorio de productos
│   │   ├── domain/             # Lógica de negocio
│   │   └── presentation/       # Componentes de UI
│   ├── core/                   # Funcionalidades compartidas
│   │   ├── components/         # Componentes reutilizables
│   │   ├── guards/             # Guards de rutas
│   │   ├── interceptors/       # Interceptores HTTP
│   │   └── services/           # Servicios compartidos
│   └── environments/           # Configuraciones de entorno
```

## Autenticación

El sistema incluye:
- **Registro de usuarios**: Formulario con validaciones
- **Inicio de sesión**: Autenticación con JWT
- **Protección de rutas**: Guards para páginas privadas
- **Interceptor automático**: Manejo de tokens en requests
- **Logout seguro**: Limpieza de sesión

### Credenciales de Prueba
No hay datos de prueba, pero se puede registrar directo un usuario nuevo en la interfaz
```

## Funcionalidades Principales

### Gestión de Productos
- ✅ Listar todos los productos en grid responsive
- ✅ Crear nuevos productos con modal
- ✅ Editar productos existentes
- ✅ Eliminar productos con confirmación
- ✅ Filtrar productos por categoría
- ✅ Validaciones de formularios

### Gestión de Categorías
- ✅ Listar categorías en grid
- ✅ Crear nuevas categorías
- ✅ Editar categorías existentes
- ✅ Eliminar categorías con confirmación
- ✅ Validaciones de formularios

### Navegación
- ✅ Header responsive con menú móvil
- ✅ Navegación entre productos y categorías
- ✅ Estados activos en navegación
- ✅ Logout desde header

## 🛠Scripts Disponibles

```bash
npm start          # Inicia servidor de desarrollo

Los demás scripts no hay necesidad de correrlos
```

## API Integration

El frontend se conecta a una API REST que debe implementar los siguientes endpoints:

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Categorías
- `GET /api/categories` - Listar categorías
- `GET /api/categories/:id` - Obtener categoría
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Error de CORS
Si tienes problemas de CORS, asegúrate de que tu frontend corre en el puerto 4200, ese es el puerto que tiene contemplado el back

### Error de Conexión API
Verifica que:
1. El backend esté ejecutándose
2. La URL en `environment.ts` sea correcta
3. Los endpoints de la API estén disponibles



