from ..models.category import Category
from src.shared.database.db import db
from typing import List

class CategoryService:

    def create_category(self, nombre: str) -> Category:
        if Category.query.filter_by(nombre=nombre).first():
            raise ValueError("Categoría ya existe")
        category = Category(nombre=nombre)
        db.session.add(category)
        db.session.commit()
        db.session.refresh(category)
        return category

    def get_category(self, category_id: int) -> Category:
        category = Category.query.get(category_id)
        if not category:
            raise ValueError("Categoría no encontrada")
        return category

    def update_category(self, category_id: int, nombre: str) -> Category:
        category = self.get_category(category_id)
        if nombre != category.nombre and Category.query.filter_by(nombre=nombre).first():
            raise ValueError("Nombre ya en uso")
        category.nombre = nombre
        db.session.commit()
        return category

    def delete_category(self, category_id: int) -> None:
        category = self.get_category(category_id)
        db.session.delete(category)
        db.session.commit()

    def list_categories(self) -> List[Category]:
        return Category.query.order_by(Category.id.asc()).all()
