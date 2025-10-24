from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import math

db = SQLAlchemy()

DB_NAME = "tarea2"
DB_USERNAME = "cc5002" 
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Clases
class Region(db.Model):
    __tablename__ = 'region'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    comunas = relationship("Comuna", back_populates="region")

class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    region_id = Column(Integer, ForeignKey('region.id'), nullable=False)
    region = relationship("Region", back_populates="comunas")
    avisos_adopcion = relationship("AvisoAdopcion", back_populates="comuna")

class AvisoAdopcion(db.Model):
    __tablename__ = 'aviso_adopcion'
    id = Column(Integer, primary_key=True, autoincrement=True)
    # Mapear a columnas existentes en la BD
    nombre_contacto = Column('nombre', String(200), nullable=False)
    email_contacto = Column('email', String(100), nullable=False)
    telefono_contacto = Column('celular', String(20), nullable=True)
    sector = Column(String(100), nullable=True)
    tipo_animal = Column('tipo', String(50), nullable=False)
    cantidad = Column(Integer, nullable=False)
    edad = Column(Integer, nullable=False)
    unidad_edad = Column('unidad_medida', String(1), nullable=False)
    descripcion = Column(Text, nullable=True)
    fecha_entrega = Column(DateTime, nullable=False)
    fecha_publicacion = Column('fecha_ingreso', DateTime, default=datetime.utcnow)
    comuna_id = Column(Integer, ForeignKey('comuna.id'), nullable=False)
    
    comuna = relationship("Comuna", back_populates="avisos_adopcion")
    fotos = relationship("Foto", back_populates="aviso_adopcion", cascade="all, delete")
    contactan_por = relationship("ContactanPor", back_populates="aviso_adopcion", cascade="all, delete")
    comentarios = relationship("Comentario", back_populates="aviso_adopcion", cascade="all, delete")

class Foto(db.Model):
    __tablename__ = 'foto'
    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(500), nullable=False)
    nombre_archivo = Column(String(500), nullable=False)
    aviso_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False)
    
    aviso_adopcion = relationship("AvisoAdopcion", back_populates="fotos")

class ContactanPor(db.Model):
    __tablename__ = 'contactar_por'
    id = Column(Integer, primary_key=True, autoincrement=True)
    metodo_contacto = Column('nombre', String(100), nullable=False)
    valor_contacto = Column('identificador', String(255), nullable=False)
    aviso_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False)
    
    aviso_adopcion = relationship("AvisoAdopcion", back_populates="contactan_por")

class Comentario(db.Model):
    __tablename__ = 'comentario'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(80), nullable=False)
    texto = Column(String(300), nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    aviso_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False)
    
    aviso_adopcion = relationship("AvisoAdopcion", back_populates="comentarios")

def get_regiones():
    return Region.query.all()

def get_comunas_by_region(region_id):
    return Comuna.query.filter_by(region_id=region_id).all()

def get_comuna_by_id(comuna_id):
    return Comuna.query.filter_by(id=comuna_id).first()

def get_adoption_notices(page_size):
    return AvisoAdopcion.query.order_by(AvisoAdopcion.fecha_publicacion.desc()).limit(page_size).all()

def get_paginated_adoptions(page=1, per_page=5):
    offset = (page - 1) * per_page
    
    avisos = AvisoAdopcion.query.order_by(AvisoAdopcion.fecha_publicacion.desc()).offset(offset).limit(per_page).all()
    total_avisos = AvisoAdopcion.query.count()
    total_paginas = math.ceil(total_avisos / per_page) if total_avisos > 0 else 1
    
    return {
        'avisos': avisos,
        'total_paginas': total_paginas,
        'pagina_actual': page
    }

def get_adoption_notice_by_id(aviso_id):
    return AvisoAdopcion.query.filter_by(id=aviso_id).first()

def create_adoption_notice(nombre_contacto, email_contacto, tipo_animal, cantidad, edad, unidad_edad, fecha_entrega, comuna_id, telefono_contacto=None, sector=None, descripcion=None):
    try:
        unidad_bd = 'a' if unidad_edad in ['años', 'a'] else 'm'
        new_aviso = AvisoAdopcion(
            nombre_contacto=nombre_contacto,
            email_contacto=email_contacto,
            telefono_contacto=telefono_contacto,
            sector=sector,
            tipo_animal=tipo_animal,
            cantidad=cantidad,
            edad=edad,
            unidad_edad=unidad_bd,
            descripcion=descripcion,
            fecha_entrega=fecha_entrega,
            comuna_id=comuna_id
        )
        db.session.add(new_aviso)
        db.session.commit()
        aviso_id = new_aviso.id
        return True, aviso_id
    except Exception as e:
        db.session.rollback()
        return False, f"Error al crear aviso: {str(e)}"

def add_pet_photo(aviso_id, ruta_archivo):
    try:
        new_foto = Foto(ruta_archivo=ruta_archivo, nombre_archivo=ruta_archivo, aviso_id=aviso_id)
        db.session.add(new_foto)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        return False

def add_contact_method(aviso_id, metodo_contacto, valor_contacto):
    try:
        new_contacto = ContactanPor(
            metodo_contacto=metodo_contacto, 
            valor_contacto=valor_contacto, 
            aviso_id=aviso_id
        )
        db.session.add(new_contacto)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        return False

def get_pet_photos(aviso_id):
    return Foto.query.filter_by(aviso_id=aviso_id).all()

def get_contact_methods(aviso_id):
    return ContactanPor.query.filter_by(aviso_id=aviso_id).all()

def get_main_pet_photo(aviso_id):
    foto = Foto.query.filter_by(aviso_id=aviso_id).first()
    return foto.ruta_archivo if foto else None

def get_daily_adoption_stats():
    from sqlalchemy import func
    from datetime import datetime, timedelta
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    daily_stats = db.session.query(
        func.date(AvisoAdopcion.fecha_publicacion).label('date'),
        func.count(AvisoAdopcion.id).label('count')
    ).filter(
        AvisoAdopcion.fecha_publicacion >= start_date
    ).group_by(
        func.date(AvisoAdopcion.fecha_publicacion)
    ).order_by(
        func.date(AvisoAdopcion.fecha_publicacion)
    ).all()
    
    result = {}
    for stat in daily_stats:
        result[stat.date.strftime('%Y-%m-%d')] = stat.count
    
    return result

def get_pet_type_distribution():
    from sqlalchemy import func
    
    pet_stats = db.session.query(
        AvisoAdopcion.tipo_animal,
        func.count(AvisoAdopcion.id).label('count')
    ).group_by(
        AvisoAdopcion.tipo_animal
    ).all()
    
    result = {}
    for stat in pet_stats:
        result[stat.tipo_animal] = stat.count
    
    return result

def get_monthly_pet_type_stats():
    from sqlalchemy import func, extract
    from datetime import datetime, timedelta
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)
    
    monthly_stats = db.session.query(
        extract('year', AvisoAdopcion.fecha_publicacion).label('year'),
        extract('month', AvisoAdopcion.fecha_publicacion).label('month'),
        AvisoAdopcion.tipo_animal,
        func.count(AvisoAdopcion.id).label('count')
    ).filter(
        AvisoAdopcion.fecha_publicacion >= start_date
    ).group_by(
        extract('year', AvisoAdopcion.fecha_publicacion),
        extract('month', AvisoAdopcion.fecha_publicacion),
        AvisoAdopcion.tipo_animal
    ).order_by(
        extract('year', AvisoAdopcion.fecha_publicacion),
        extract('month', AvisoAdopcion.fecha_publicacion)
    ).all()
    
    result = {}
    for stat in monthly_stats:
        month_key = f"{int(stat.year)}-{int(stat.month):02d}"
        if month_key not in result:
            result[month_key] = {'perro': 0, 'gato': 0}
        result[month_key][stat.tipo_animal] = stat.count
    
    return result





def get_comentarios_by_aviso(aviso_id):
    return Comentario.query.filter_by(aviso_id=aviso_id).order_by(Comentario.fecha.desc()).all()

def add_comentario(nombre, texto, aviso_id):
    try:
        comentario = Comentario(
            nombre=nombre,
            texto=texto,
            aviso_id=aviso_id
        )
        db.session.add(comentario)
        db.session.commit()
        return True, comentario.id
    except Exception as e:
        db.session.rollback()
        return False, str(e)
