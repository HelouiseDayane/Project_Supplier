import sys
import os
import json
import pytest
import base64
from faker import Faker
import json
import io
from werkzeug.datastructures import FileStorage
import base64
import json


sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.app import create_app
from app.models.models import Supplier 
from flask import current_app

app = create_app()
fake = Faker('pt-BR')


def generate_cnpj():
    return f"{fake.random_number(digits=2)}.{fake.random_number(digits=3)}.{fake.random_number(digits=3)}/" \
           f"{fake.random_number(digits=4)}-{fake.random_number(digits=2)}"

def create_supplier(client, name='Fornecedor Teste', cnpj=None, state='SP', custoKwh=0.5, 
                    limiteMinimoKwh=100.0, numClients=200, avaliacaoMedia=4.5):
    if cnpj is None:
        cnpj = generate_cnpj()  

    url = '/graphql'

    create_supplier_query = """
        mutation CreateSupplier($name: String!, $cnpj: String!, $state: String!, $custoKwh: Float!,
                                $limiteMinimoKwh: Float!, $numClients: Int!, $avaliacaoMedia: Float!) {
            createSupplier(
                name: $name,
                cnpj: $cnpj,
                state: $state,
                custoKwh: $custoKwh,
                limiteMinimoKwh: $limiteMinimoKwh,
                numClients: $numClients,
                avaliacaoMedia: $avaliacaoMedia
            ) {
                supplier {
                    id
                    name
                    cnpj
                    state
                }
            }
        }
    """

    create_supplier_data = {
        'query': create_supplier_query,
        'variables': {
            'name': name,
            'cnpj': cnpj,
            'state': state,
            'custoKwh': custoKwh,
            'limiteMinimoKwh': limiteMinimoKwh,
            'numClients': numClients,
            'avaliacaoMedia': avaliacaoMedia
        }
    }

    create_response = client.post(url, json=create_supplier_data)
    create_response_data = json.loads(create_response.data)

    assert 'data' in create_response_data, f"Erro ao criar fornecedor: {create_response_data}"
    assert 'createSupplier' in create_response_data['data'], f"Erro: {create_response_data['data']}"
    assert 'supplier' in create_response_data['data']['createSupplier'], f"Erro: {create_response_data['data']['createSupplier']}"

    return create_response_data['data']['createSupplier']['supplier']['id']

def test_supplier_operations():
    with app.test_client() as client:
        url = '/graphql'
    
        supplier_id = create_supplier(client)
    
        name = fake.company()
        cnpj = generate_cnpj()
        state = fake.state()
        
        costPerKwh = round(fake.random_int(min=2000, max=1000000) * 0.1, 2)  
        
        limiteMinimoKwh = round(fake.random_number(digits=5) * 0.1, 2)
        numClients = fake.random_int(min=1, max=500)
        
  
        mediaAvaliacao = round(fake.random_number(digits=1) * 0.1, 1)  
        
        update_query = """
        mutation UpdateSupplier($id: String!, $name: String!, $cnpj: String!, $state: String!, $costPerKwh: Float!,
                                $limiteMinimoKwh: Float!, $numClients: Int!, $mediaAvaliacao: Float!) {
            updateSupplier(
                id: $id,
                name: $name,
                cnpj: $cnpj,
                state: $state,
                custoKwh: $costPerKwh,  # Passando como float
                limiteMinimoKwh: $limiteMinimoKwh,
                numClients: $numClients,
                avaliacaoMedia: $mediaAvaliacao  # Passando como float
            ) {
                supplier {
                    id
                    name
                    cnpj
                    state
                    costPerKwh  # Este campo deve ser float
                    minKwhLimit
                    numClients
                    averageRating
                }
            }
        }
        """
    
        update_data = {
            'query': update_query,
            'variables': {
                'id': supplier_id,
                'name': name,
                'cnpj': cnpj,
                'state': state,
                'costPerKwh': costPerKwh, 
                'limiteMinimoKwh': limiteMinimoKwh,
                'numClients': numClients,
                'mediaAvaliacao': mediaAvaliacao 
            }
        }
    
        update_response = client.post(url, json=update_data)
        update_response_data = json.loads(update_response.data)
    
        assert 'data' in update_response_data, f"Erro na resposta: {update_response_data}"
