from flask import Blueprint
from ..controllers.category_controller import CategoryController
from src.shared.middleware.auth import login_required

category_bp = Blueprint('categories', __name__, url_prefix='/categories')

category_bp.add_url_rule('/', view_func=login_required(CategoryController.create), methods=['POST'])
category_bp.add_url_rule('/', view_func=login_required(CategoryController.list_all), methods=['GET'])
category_bp.add_url_rule('/<int:category_id>', view_func=login_required(CategoryController.get), methods=['GET'])
category_bp.add_url_rule('/<int:category_id>', view_func=login_required(CategoryController.update), methods=['PUT'])
category_bp.add_url_rule('/<int:category_id>', view_func=login_required(CategoryController.delete), methods=['DELETE'])
