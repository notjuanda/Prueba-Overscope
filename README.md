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
4. Run:
```
python -m flask run
```
Notas: 
- El punto de entrada de la app es `app.py`. 
- Las tablas se crean automaticamente usando `db.create_all()`.
  
## Categorías (requiere login)
CRUD completo en `/categories`.

## Productos (requiere login)
CRUD en `/products`, subida de imagen multipart, campo `imagen`.

- Extensiones: jpg, jpeg, png, webp
- Ruta guardada en BD: relativa `products/<archivo>`

## Errores comunes
400 validación, 401 auth, 404 no encontrado, 415 tipo contenido, 500 interno.

# Frontend

ejecutar para instalar dependencias: npm install

## Tecnologías

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

1. **Configurar variables de entorno**:
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

### Credenciales de Prueba
No hay datos de prueba, pero se puede registrar directo un usuario nuevo en la interfaz
```

### Error de CORS
Si tienes problemas de CORS, asegúrate de que tu frontend corre en el puerto 4200, ese es el puerto que tiene contemplado el back

### Error de Conexión API
Verifica que:
1. El backend esté ejecutándose
2. La URL en `environment.ts` sea correcta
3. Los endpoints de la API estén disponibles



