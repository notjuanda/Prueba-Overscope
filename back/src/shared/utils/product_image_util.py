import os
import uuid
from typing import Optional
from flask import current_app
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage

ALLOWED_IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}

class ProductImageUtil:
    @staticmethod
    def _base_dir() -> str:
        base = current_app.config.get("UPLOAD_FOLDER")
        sub = current_app.config.get("PRODUCT_IMAGE_SUBFOLDER")
        return os.path.join(base, sub)

    @staticmethod
    def allowed(filename: str) -> bool:
        if not filename or "." not in filename:
            return False
        ext = filename.rsplit(".", 1)[1].lower()
        return ext in ALLOWED_IMAGE_EXTENSIONS

    @staticmethod
    def save(file: Optional[FileStorage]) -> Optional[str]:
        if file is None or file.filename == "":
            return None
        if not ProductImageUtil.allowed(file.filename):
            raise ValueError("Extensión de imagen no permitida")
        target_dir = ProductImageUtil._base_dir()
        os.makedirs(target_dir, exist_ok=True)
        ext = file.filename.rsplit(".", 1)[1].lower()
        unique_name = f"{uuid.uuid4().hex}.{ext}"
        safe_name = secure_filename(unique_name)
        abs_path = os.path.join(target_dir, safe_name)
        file.save(abs_path)
        rel_path = os.path.join(current_app.config.get("PRODUCT_IMAGE_SUBFOLDER"), safe_name).replace("\\", "/")
        return rel_path

    @staticmethod
    def delete(rel_path: Optional[str]) -> None:
        if not rel_path:
            return
        base = current_app.config.get("UPLOAD_FOLDER")
        abs_path = os.path.join(base, rel_path)
        if os.path.isfile(abs_path):
            try:
                os.remove(abs_path)
            except OSError:
                pass

