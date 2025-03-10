import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.app import create_app 
from app.extensions import db
from app.models.models import Supplier  
from faker import Faker
import random

fake = Faker('pt-BR')

def generate_cnpj():
    cnpj_base = str(random.randint(100000000000, 999999999999))
    return cnpj_base

def create_fake_fornecedores(n):
    fornecedores = []
    for _ in range(n):
        fornecedor = Supplier(
            name=fake.company(),
            logo=fake.image_url(),
            state=fake.state(),
            cost_per_kwh=random.uniform(0.15, 0.80),  
            min_kwh_limit=round(fake.random_int(min=1000, max=100000) * 0.1, 2),
            num_clients=random.randint(0, 1000),  
            average_rating=random.uniform(1.0, 5.0),  
            cnpj=generate_cnpj(), 
        )
        fornecedores.append(fornecedor)
    
    db.session.bulk_save_objects(fornecedores)
    db.session.commit()


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        create_fake_fornecedores(150)  
        print("150 fornecedores foram criados com sucesso!")
