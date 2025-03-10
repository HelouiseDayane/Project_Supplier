import graphene
from app.graphql.queries import SupplierType
from app.models.models import Supplier
from app.extensions import db
import os
import base64
from werkzeug.utils import secure_filename
from flask import current_app
from graphene_file_upload.scalars import Upload

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image(file):
    upload_folder = 'uploads/logos'
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    filename = secure_filename(file.filename)
    image_path = os.path.join(upload_folder, filename)
    file.save(image_path)
    
    return filename  

class CreateSupplier(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        cnpj = graphene.String(required=True)
        state = graphene.String(required=True)
        custoKwh = graphene.Float(required=True)
        limiteMinimoKwh = graphene.Float(required=True)
        avaliacaoMedia = graphene.Float(required=True)
        numClients = graphene.Int(required=False)
        logo = Upload(required=False)  

    supplier = graphene.Field(SupplierType)

    def mutate(self, info, name, cnpj, state, custoKwh, limiteMinimoKwh, avaliacaoMedia, numClients=0, logo=None):
        erros = {}

        if not name:
            erros["name"] = "Campo name obrigatório"
        if not cnpj:
            erros["cnpj"] = "Campo cnpj obrigatório"
        if not state:
            erros["state"] = "Campo state obrigatório"
        if custoKwh is None:
            erros["custoKwh"] = "Campo custoKwh obrigatório"
        if limiteMinimoKwh is None:
            erros["limiteMinimoKwh"] = "Campo limiteMinimoKwh obrigatório"
        if avaliacaoMedia is None:
            erros["avaliacaoMedia"] = "Campo avaliacaoMedia obrigatório"

        if erros:
            raise Exception(erros)

        supplier_existente = Supplier.query.filter_by(cnpj=cnpj).first()
        if supplier_existente:
            raise Exception("Supplier com esse CNPJ já cadastrado!")

        filename = None
        if logo:
            if allowed_file(logo.filename):  
                filename = save_image(logo)  
            else:
                raise Exception("Tipo de arquivo não permitido!")

        supplier = Supplier(
            name=name,
            cnpj=cnpj,
            state=state,
            cost_per_kwh=custoKwh,
            min_kwh_limit=limiteMinimoKwh,
            num_clients=numClients,
            average_rating=avaliacaoMedia,
            logo=filename 
        )

        db.session.add(supplier)
        db.session.commit()

        return CreateSupplier(supplier=supplier)

class UpdateSupplier(graphene.Mutation):
    class Arguments:
        id = graphene.String()
        name = graphene.String()
        cnpj = graphene.String()
        state = graphene.String()
        custoKwh = graphene.Float()
        limiteMinimoKwh = graphene.Float()
        numClients = graphene.Int()
        avaliacaoMedia = graphene.Float()
        logo = Upload(required=False)

    supplier = graphene.Field(SupplierType)

    def mutate(self, info, id, name, cnpj, state, custoKwh, limiteMinimoKwh, numClients, avaliacaoMedia, logo=None):
        try:
            decoded_id = base64.b64decode(id).decode("utf-8")
            _, real_id = decoded_id.split(":")
            real_id = int(real_id)
        except Exception as e:
            raise Exception("ID inválido ou mal formatado!")

        supplier = Supplier.query.get(real_id)
        if not supplier:
            raise Exception("Supplier não encontrado!")

        supplier.name = name
        supplier.cnpj = cnpj
        supplier.state = state
        supplier.cost_per_kwh = custoKwh
        supplier.min_kwh_limit = limiteMinimoKwh
        supplier.num_clients = numClients
        supplier.average_rating = avaliacaoMedia

        if logo:
            upload_folder = current_app.config['UPLOAD_FOLDER']
            filename = secure_filename(logo.filename)
            supplier.logo = filename
            filepath = os.path.join(upload_folder, filename)
            logo.save(filepath)

        db.session.commit()

        return UpdateSupplier(supplier=supplier)

class DeleteSupplier(graphene.Mutation):
    class Arguments:
        id = graphene.Int()

    success = graphene.Boolean()

    def mutate(self, info, id):
        supplier = Supplier.query.get(id)
        if not supplier:
            raise Exception("Supplier não encontrado!")

        db.session.delete(supplier)
        db.session.commit()

        return DeleteSupplier(success=True)

class Mutation(graphene.ObjectType):
    create_supplier = CreateSupplier.Field()
    update_supplier = UpdateSupplier.Field()
    delete_supplier = DeleteSupplier.Field()


class DeleteSupplier(graphene.Mutation):
    class Arguments:
        id = graphene.Int()

    success = graphene.Boolean()

    def mutate(self, info, id):
        supplier = Supplier.query.get(id)
        if not supplier:
            raise Exception("Supplier não encontrado!")

        db.session.delete(supplier)
        db.session.commit()

        return DeleteSupplier(success=True)




class Mutation(graphene.ObjectType):
    create_supplier = CreateSupplier.Field()
    update_supplier = UpdateSupplier.Field()  
    delete_supplier = DeleteSupplier.Field()
