from flask import request, make_response
from ..services.category_service import CategoryService
from ..schemas.category_schema import (
    CategoryCreateSchema,
    CategoryUpdateSchema,
    CategoryResponseSchema,
)
from marshmallow import ValidationError

service = CategoryService()
create_schema = CategoryCreateSchema()
update_schema = CategoryUpdateSchema()
resp_schema = CategoryResponseSchema()

class CategoryController:
    @staticmethod
    def create():
        try:
            data = create_schema.load(request.json or {})
            category = service.create_category(data['nombre'])
            return {'category': resp_schema.dump(category)}, 201
        except ValidationError as e:
            return {'error': 'Validación', 'details': e.messages}, 400
        except ValueError as ve:
            return {'error': str(ve)}, 400
        except Exception:
            return {'error': 'Error interno'}, 500

    @staticmethod
    def list_all():
        categories = service.list_categories()
        return {'categories': [resp_schema.dump(c) for c in categories]}, 200

    @staticmethod
    def get(category_id: int):
        try:
            category = service.get_category(category_id)
            return {'category': resp_schema.dump(category)}, 200
        except ValueError as ve:
            return {'error': str(ve)}, 404
        except Exception:
            return {'error': 'Error interno'}, 500

    @staticmethod
    def update(category_id: int):
        try:
            data = update_schema.load(request.json or {})
            category = service.update_category(category_id, data['nombre'])
            return {'category': resp_schema.dump(category)}, 200
        except ValidationError as e:
            return {'error': 'Validación', 'details': e.messages}, 400
        except ValueError as ve:
            msg = str(ve)
            code = 404 if 'no encontrada' in msg.lower() else 400
            return {'error': msg}, code
        except Exception:
            return {'error': 'Error interno'}, 500

    @staticmethod
    def delete(category_id: int):
        try:
            service.delete_category(category_id)
            return {'message': 'Categoría eliminada'}, 200
        except ValueError as ve:
            return {'error': str(ve)}, 404
        except Exception:
            return {'error': 'Error interno'}, 500

