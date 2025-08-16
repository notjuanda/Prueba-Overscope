import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Configuración base. Requiere JWT_SECRET en entorno."""
    JWT_SECRET = os.environ.get('JWT_SECRET')
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'connect_args': {
            'charset': 'utf8mb4'
        }
    }
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
    PRODUCT_IMAGE_SUBFOLDER = os.environ.get('PRODUCT_IMAGE_SUBFOLDER', 'products')
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', str(100 * 1024 * 1024)))
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', '').replace('mysql://', 'mysql+pymysql://')

class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL', '').replace('mysql://', 'mysql+pymysql://')

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', '').replace('mysql://', 'mysql+pymysql://')

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
