from ..models.user import User
from src.shared.database.db import db
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Optional

class UserService:

    def register(self, email: str, password: str, first_name: str, last_name: str | None = None) -> User:
        if User.query.filter_by(email=email).first():
            raise ValueError("Email ya registrado")
        user = User(
            email=email,
            password=generate_password_hash(password),
            first_name=first_name,
            last_name=last_name
        )
        db.session.add(user)
        db.session.commit()
        db.session.refresh(user)
        return user

    def login(self, email: str, password: str) -> Optional[User]:
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            return user
        return None
