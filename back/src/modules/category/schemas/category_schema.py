from marshmallow import Schema, fields, validate

class CategoryCreateSchema(Schema):
    nombre = fields.Str(required=True, validate=validate.Length(min=1, max=100))

class CategoryUpdateSchema(Schema):
    nombre = fields.Str(required=True, validate=validate.Length(min=1, max=100))

class CategoryResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    nombre = fields.Str(dump_only=True)

