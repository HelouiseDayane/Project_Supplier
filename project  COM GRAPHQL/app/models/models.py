from app.extensions import db

class Supplier(db.Model):
    __tablename__ = 'suppliers' 

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False) 
    cnpj = db.Column(db.String(20), unique=True, nullable=False) 
    state = db.Column(db.String(50), nullable=False)  
    cost_per_kwh = db.Column(db.Float, nullable=False) 
    min_kwh_limit = db.Column(db.Float, nullable=False)  
    num_clients = db.Column(db.Integer, nullable=False) 
    average_rating = db.Column(db.Float, nullable=False) 
    logo = db.Column(db.String(200), nullable=True) 
    
    def __repr__(self):
        return f'<Supplier {self.name}>'
