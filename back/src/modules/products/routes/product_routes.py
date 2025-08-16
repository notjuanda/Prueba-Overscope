from flask import Blueprint
from ..controllers.product_controller import ProductController
from src.shared.middleware.auth import login_required

product_bp = Blueprint('products', __name__, url_prefix='/products')

product_bp.add_url_rule('/category/<int:categoria_id>', view_func=login_required(ProductController.list_by_category), methods=['GET'])
product_bp.add_url_rule('/', view_func=login_required(ProductController.create), methods=['POST'])
product_bp.add_url_rule('/', view_func=login_required(ProductController.list_all), methods=['GET'])
product_bp.add_url_rule('/<int:product_id>', view_func=login_required(ProductController.get), methods=['GET'])
product_bp.add_url_rule('/<int:product_id>', view_func=login_required(ProductController.update), methods=['PUT'])
product_bp.add_url_rule('/<int:product_id>', view_func=login_required(ProductController.delete), methods=['DELETE'])
