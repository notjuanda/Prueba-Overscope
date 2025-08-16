from flask import request, make_response
from ..services.product_service import ProductService
from ..schemas.product_schema import ProductCreateSchema, ProductUpdateSchema, ProductResponseSchema
from src.shared.utils.product_image_util import ProductImageUtil
from marshmallow import ValidationError

service = ProductService()
create_schema = ProductCreateSchema()
update_schema = ProductUpdateSchema()
resp_schema = ProductResponseSchema()

class ProductController:
    @staticmethod
    def create():
        try:
            if not request.content_type or not request.content_type.startswith('multipart/form-data'):
                return {'error': 'Content-Type debe ser multipart/form-data'}, 415
            form = request.form.to_dict()
            image_file = request.files.get('imagen')
            data = create_schema.load(form)
            image_path = ProductImageUtil.save(image_file)
            product = service.create_product(
                nombre=data['nombre'],
                precio=data['precio'],
                categoria_id=data['categoria_id'],
                descripcion=data.get('descripcion'),
                imagen=image_path
            )
            return {'product': resp_schema.dump(product)}, 201
        except ValidationError as e:
            return {'error': 'Validación', 'details': e.messages}, 400
        except ValueError as ve:
            return {'error': str(ve)}, 400
        except Exception:
            return {'error': 'Error interno'}, 500

    @staticmethod
    def list_all():
        products = service.list_products()
        return {'products': [resp_schema.dump(p) for p in products]}, 200

    @staticmethod
    def get(product_id: int):
        try:
            product = service.get_product(product_id)
            return {'product': resp_schema.dump(product)}, 200
        except ValueError as ve:
            return {'error': str(ve)}, 404
        except Exception:
            return {'error': 'Error interno'}, 500

    @staticmethod
    def update(product_id: int):
        try:
            if not request.content_type or not request.content_type.startswith('multipart/form-data'):
                return {'error': 'Content-Type debe ser multipart/form-data'}, 415
            form = request.form.to_dict()
            image_file = request.files.get('imagen')
            data = update_schema.load(form)
            product = service.get_product(product_id)
            new_image_path = None
            if image_file and image_file.filename:
                from src.shared.utils.product_image_util import ProductImageUtil as PIU
                if product.imagen:
                    PIU.delete(product.imagen)
                new_image_path = PIU.save(image_file)
            product = service.update_product(
                product_id=product_id,
                nombre=data.get('nombre'),
                precio=data.get('precio'),
                categoria_id=data.get('categoria_id'),
                descripcion=data.get('descripcion'),
                imagen=new_image_path if new_image_path is not None else None
            )
            return {'product': resp_schema.dump(product)}, 200
        except ValidationError as e:
            return {'error': 'Validación', 'details': e.messages}, 400
        except ValueError as ve:
            msg = str(ve)
            code = 404 if 'no encontrada' in msg.lower() or 'no encontrado' in msg.lower() else 400
            return {'error': msg}, code
        except Exception:
            return {'error': 'Error interno'}, 500

    @staticmethod
    def delete(product_id: int):
        try:
            product = service.get_product(product_id)
            if product.imagen:
                from src.shared.utils.product_image_util import ProductImageUtil as PIU
                PIU.delete(product.imagen)
            service.delete_product(product_id)
            return {'message': 'Producto eliminado'}, 200
        except ValueError as ve:
            return {'error': str(ve)}, 404
        except Exception:
            return {'error': 'Error interno'}, 500

    @staticmethod
    def list_by_category(categoria_id: int):
        try:
            products = service.list_by_category(categoria_id)
            return {'products': [resp_schema.dump(p) for p in products]}, 200
        except ValueError as ve:
            return {'error': str(ve)}, 404
        except Exception:
            return {'error': 'Error interno'}, 500
