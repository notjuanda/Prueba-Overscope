from functools import wraps
from flask import request, g, jsonify
from src.shared.utils.jwt_util import JWTUtil
from src.modules.users.models.user import User


def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = request.cookies.get('access_token')
        if not token:
            return {'error': 'No autenticado'}, 401
        data = JWTUtil.verify(token)
        if not data:
            return {'error': 'Token inválido o expirado'}, 401
        user_id = data.get('sub')
        user = User.query.get(user_id)
        if not user:
            return {'error': 'Usuario no encontrado'}, 401
        g.current_user = user
        return fn(*args, **kwargs)
    return wrapper

