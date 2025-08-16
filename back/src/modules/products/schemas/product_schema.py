from marshmallow import Schema, fields, validate

class ProductCreateSchema(Schema):
    nombre = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    precio = fields.Float(required=True)
    categoria_id = fields.Int(required=True)
    descripcion = fields.Str(required=False, allow_none=True)

class ProductUpdateSchema(Schema):
    nombre = fields.Str(required=False, validate=validate.Length(min=1, max=100))
    precio = fields.Float(required=False)
    categoria_id = fields.Int(required=False)
    descripcion = fields.Str(required=False, allow_none=True)

class ProductResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    nombre = fields.Str(dump_only=True)
    descripcion = fields.Str(dump_only=True)
    precio = fields.Float(dump_only=True)
    imagen = fields.Str(dump_only=True)
    categoria_id = fields.Int(dump_only=True)

