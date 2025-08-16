from flask import request, make_response, g
from ..services.user_service import UserService
from ..schemas.user_schema import UserRegisterSchema, UserLoginSchema, UserResponseSchema
from marshmallow import ValidationError
from src.shared.utils.jwt_util import JWTUtil

user_service = UserService()
register_schema = UserRegisterSchema()
login_schema = UserLoginSchema()
response_schema = UserResponseSchema()

class UserController:
    @staticmethod
    def register():
        try:
            payload = request.json or {}
            data = register_schema.load(payload)
            user = user_service.register(
                email=data['email'],
                password=data['password'],
                first_name=data['first_name'],
                last_name=data.get('last_name')
            )
            token = JWTUtil.generate({'sub': user.id, 'email': user.email})
            body = response_schema.dump(user)
            resp = make_response({'user': body, 'message': 'Registro exitoso'})
            resp.set_cookie('access_token', token, httponly=True, secure=False, samesite='Lax')
            return resp, 201
        except ValidationError as e:
            return {'error': 'Validación', 'details': e.messages}, 400
        except ValueError as ve:
            return {'error': str(ve)}, 400
        except Exception:
            return {'error': 'Error interno'}, 500

    @staticmethod
    def login():
        try:
            payload = request.json or {}
            data = login_schema.load(payload)
            user = user_service.login(data['email'], data['password'])
            if not user:
                return {'error': 'Credenciales inválidas'}, 401
            token = JWTUtil.generate({'sub': user.id, 'email': user.email})
            body = response_schema.dump(user)
            resp = make_response({'user': body, 'message': 'Login exitoso'})
            resp.set_cookie('access_token', token, httponly=True, secure=False, samesite='Lax')
            return resp, 200
        except ValidationError as e:
            return {'error': 'Validación', 'details': e.messages}, 400
        except Exception:
            return {'error': 'Error interno'}, 500

    @staticmethod
    def logout():
        resp = make_response({'message': 'Logout exitoso'})
        resp.set_cookie('access_token', '', httponly=True, secure=False, samesite='Lax', expires=0, max_age=0)
        return resp, 200

    @staticmethod
    def me():
        user = getattr(g, 'current_user', None)
        if not user:
            return {'error': 'No autenticado'}, 401
        body = response_schema.dump(user)
        return {'user': body}, 200
