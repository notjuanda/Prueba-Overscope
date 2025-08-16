# Backend Overscope

API REST en Flask con autenticación JWT vía cookie HttpOnly, manejo de categorías, productos (con subida de imágenes) y usuarios (registro / login / logout).

## Tecnologías
- Python 3.13+
- Flask
- Flask-SQLAlchemy
- MySQL (u otro motor compatible con SQLAlchemy)
- Marshmallow (validación)
- PyJWT (tokens JWT)
- PyMySQL (driver MySQL)

## Estructura de carpetas (resumen)
```
app.py
config.py
requirements.txt
src/
  shared/
    database/db.py          # Inicializa SQLAlchemy
    middleware/auth.py      # Decorador login_required
    utils/jwt_util.py       # Generación / verificación JWT
    utils/product_image_util.py # Manejo imágenes productos
  modules/
    users/
      models/user.py
      services/user_service.py
      schemas/user_schema.py
      controllers/user_controller.py
      routes/user_routes.py
    category/
      ... (model, service, schemas, controller, routes)
    products/
      ... (model, service, schemas, controller, routes)
uploads/
  products/                 # Archivos de imágenes guardados
```

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

Ejemplo `.env`
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
