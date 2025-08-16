from src.shared.database.db import db

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), unique=True, nullable=False)
    productos = db.relationship('Product', backref='categoria', lazy=True)

    def __repr__(self):
        return f'<Category {self.nombre}>'
