from flask import Blueprint
from ..controllers.user_controller import UserController
from src.shared.middleware.auth import login_required

user_bp = Blueprint('users', __name__, url_prefix='/users')

user_bp.add_url_rule('/register', view_func=UserController.register, methods=['POST'])
user_bp.add_url_rule('/login', view_func=UserController.login, methods=['POST'])
user_bp.add_url_rule('/logout', view_func=UserController.logout, methods=['POST'])
user_bp.add_url_rule('/me', view_func=login_required(UserController.me), methods=['GET'])
