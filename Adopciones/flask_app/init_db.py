import os
import sys
from sqlalchemy import create_engine, text

# Agregar el directorio actual al path para poder importar db
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db import db, DATABASE_URL

def init_db():
    try:
        # Crear engine usando la configuración de db.py
        engine = create_engine(DATABASE_URL)
        
        # Crear todas las tablas
        db.metadata.create_all(engine)

        # Verificar si ya hay datos de regiones
        with engine.connect() as conn:
            result = conn.execute(text("SELECT COUNT(*) FROM region"))
            existing_regions = result.scalar()
            
            if existing_regions == 0:
                # Cargar datos de regiones y comunas desde SQL
                sql_file_path = os.path.join(os.path.dirname(__file__), "region-comuna.sql")
                
                if os.path.exists(sql_file_path):
                    with open(sql_file_path, "r", encoding="utf-8") as f:
                        sql_script = f.read()
                    
                    # Ejecutar el script SQL usando SQLAlchemy
                    statements = sql_script.split(';')
                    successful = 0
                    
                    for i, statement in enumerate(statements):
                        if statement.strip():
                            try:
                                conn.execute(text(statement.strip()))
                                successful += 1
                            except Exception as e:
                                pass
                    
                    conn.commit()
                
    except Exception as e:
        pass

if __name__ == "__main__":
    init_db()