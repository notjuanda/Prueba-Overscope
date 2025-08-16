import jwt
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from flask import current_app

DEFAULT_ALG = "HS256"

class JWTUtil:
    @staticmethod
    def _secret() -> str:
        secret = current_app.config.get("JWT_SECRET")
        if not secret or not isinstance(secret, str):
            raise RuntimeError("JWT_SECRET no configurado o inválido (cadena vacía)")
        return secret

    @staticmethod
    def generate(payload: Dict[str, Any], expires_minutes: int = 60) -> str:
        secret = JWTUtil._secret()
        data = payload.copy()
        # Forzar 'sub' a string si existe
        if 'sub' in data and not isinstance(data['sub'], str):
            data['sub'] = str(data['sub'])
        now = datetime.now(timezone.utc)
        data["iat"] = int(now.timestamp())
        data["exp"] = int((now + timedelta(minutes=expires_minutes)).timestamp())
        token = jwt.encode(data, secret, algorithm=DEFAULT_ALG)
        return token

    @staticmethod
    def verify(token: str) -> Optional[Dict[str, Any]]:
        try:
            secret = JWTUtil._secret()
            decoded = jwt.decode(token, secret, algorithms=[DEFAULT_ALG])
            return decoded
        except (jwt.ExpiredSignatureError, jwt.InvalidSignatureError, jwt.DecodeError, RuntimeError):
            return None
        except Exception:
            return None
