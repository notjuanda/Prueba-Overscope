from ..models.product import Product
from src.shared.database.db import db
from typing import List
from ...category.models.category import Category

class ProductService:
    def create_product(self, nombre: str, precio: float, categoria_id: int, descripcion: str | None = None, imagen: str | None = None) -> Product:
        if precio < 0:
            raise ValueError("Precio no puede ser negativo")
        if not Category.query.get(categoria_id):
            raise ValueError("Categoría no encontrada")
        product = Product(nombre=nombre, precio=precio, categoria_id=categoria_id, descripcion=descripcion, imagen=imagen)
        db.session.add(product)
        db.session.commit()
        db.session.refresh(product)
        return product

    def get_product(self, product_id: int) -> Product:
        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Producto no encontrado")
        return product

    def update_product(self, product_id: int, nombre: str | None = None, precio: float | None = None, categoria_id: int | None = None, descripcion: str | None = None, imagen: str | None = None) -> Product:
        product = self.get_product(product_id)
        if nombre is not None:
            product.nombre = nombre
        if precio is not None:
            if precio < 0:
                raise ValueError("Precio no puede ser negativo")
            product.precio = precio
        if categoria_id is not None:
            if not Category.query.get(categoria_id):
                raise ValueError("Categoría no encontrada")
            product.categoria_id = categoria_id
        if descripcion is not None:
            product.descripcion = descripcion
        if imagen is not None:
            product.imagen = imagen
        db.session.commit()
        db.session.refresh(product)
        return product

    def delete_product(self, product_id: int) -> None:
        product = self.get_product(product_id)
        db.session.delete(product)
        db.session.commit()

    def list_products(self) -> List[Product]:
        return Product.query.order_by(Product.id.asc()).all()

    def list_by_category(self, categoria_id: int) -> List[Product]:
        if not Category.query.get(categoria_id):
            raise ValueError("Categoría no encontrada")
        return Product.query.filter_by(categoria_id=categoria_id).order_by(Product.id.asc()).all()
