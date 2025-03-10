import graphene
from app.models.models import Supplier
from graphene_sqlalchemy import SQLAlchemyObjectType

class SupplierType(SQLAlchemyObjectType):
    class Meta:
        model = Supplier
        interfaces = (graphene.relay.Node,)

class Query(graphene.ObjectType):
    fornecedor = graphene.Field(SupplierType, id=graphene.Int())
    fornecedores = graphene.List(SupplierType)

    def resolve_fornecedor(self, info, id):
        return Supplier.query.get(id)

    def resolve_fornecedores(self, info):
        return Supplier.query.all()
