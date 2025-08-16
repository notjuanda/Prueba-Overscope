import os
from flask import Flask, send_from_directory, current_app
from config import config
from src.shared.database.db import db
from flask_cors import CORS

from src.modules.users.models.user import User
from src.modules.category.models.category import Category
from src.modules.products.models.product import Product
from src.modules.users.routes.user_routes import user_bp
from src.modules.category.routes.category_routes import category_bp
from src.modules.products.routes.product_routes import product_bp

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    app.url_map.strict_slashes = False

    db.init_app(app)
    CORS(app, resources={r"/*": {"origins": ["http://localhost:4200", "http://127.0.0.1:4200"]}}, supports_credentials=True)
    app.register_blueprint(user_bp)
    app.register_blueprint(category_bp)
    app.register_blueprint(product_bp)

    @app.route('/uploads/<path:filename>')
    def serve_upload(filename: str):
        base = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        return send_from_directory(base, filename)

    return app

app = create_app(os.getenv('FLASK_ENV', 'development'))

with app.app_context():
    base = app.config.get('UPLOAD_FOLDER')
    sub = app.config.get('PRODUCT_IMAGE_SUBFOLDER')
    if base and sub:
        os.makedirs(os.path.join(base, sub), exist_ok=True)
    db.create_all()
    print('Database tables created successfully!')

if __name__ == '__main__':
    print('Starting Flask app...')
    app.run(debug=app.config['DEBUG'])
