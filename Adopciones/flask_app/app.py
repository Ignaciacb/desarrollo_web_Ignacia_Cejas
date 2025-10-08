from flask import Flask, request, render_template, redirect, url_for, session, flash, jsonify
from utils.validations import validate_adoption_notice, validate_pet_images, validate_contact_methods, validate_phone, validate_sector
from db import db, DATABASE_URL, get_regiones, get_comunas_by_region, get_comuna_by_id, get_adoption_notices, get_paginated_adoptions, get_adoption_notice_by_id, create_adoption_notice, add_pet_photo, add_contact_method, get_pet_photos, get_contact_methods, get_main_pet_photo
from init_db import init_db as init_database
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os
import uuid
from datetime import datetime, timedelta

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)
app.secret_key = "secret_key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000

# Configuración de la base de datos desde db.py
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la base de datos con la app
db.init_app(app)


# --- Ruta Principal ---
@app.route("/", methods=["GET"])
def index():
    # Obtener últimos 5 avisos para la portada
    avisos_portada = get_adoption_notices(page_size=5)
    data_portada = []
    
    for aviso in avisos_portada:
        comuna = get_comuna_by_id(aviso.comuna_id)
        foto_principal = get_main_pet_photo(aviso.id)
        foto_ruta = url_for('static', filename=f"uploads/{foto_principal}") if foto_principal else url_for('static', filename="images/default-pet.jpg")

        unidad_edad_texto = "años" if aviso.unidad_edad == "a" else "meses"
        cantidad_tipo_edad = f"{aviso.cantidad} {aviso.tipo_animal} {aviso.edad} {unidad_edad_texto}"
        
        data_portada.append({
            "fecha_publicacion": aviso.fecha_publicacion.strftime("%Y-%m-%d %H:%M"),
            "comuna": comuna.nombre if comuna else "",
            "sector": aviso.sector or "",
            "cantidad_tipo_edad": cantidad_tipo_edad,
            "path_image": foto_ruta,
            "aviso_id": aviso.id
        })
    
    
    # Obtener regiones para el formulario
    regiones = get_regiones()
    fecha_minima = (datetime.now() + timedelta(hours=3)).strftime("%Y-%m-%dT%H:%M")
    
    # Cargar todas las comunas agrupadas por región
    comunas_por_region = {}
    for region in regiones:
        comunas = get_comunas_by_region(region.id)
        comunas_por_region[region.id] = [{"id": c.id, "nombre": c.nombre} for c in comunas]
    
    return render_template(
        "auth/index.html",
        data=data_portada,
        regiones=regiones,
        fecha_minima=fecha_minima,
        comunas_por_region=comunas_por_region,
    )

@app.route("/agregar-aviso", methods=["GET", "POST"])
def agregar_aviso():
    if request.method == "GET":
        regiones = get_regiones()
        # Cargar todas las comunas agrupadas por región
        comunas_por_region = {}
        for region in regiones:
            comunas = get_comunas_by_region(region.id)
            comunas_por_region[region.id] = [{"id": c.id, "nombre": c.nombre} for c in comunas]
        
        return render_template("auth/agregar_aviso.html", regiones=regiones, comunas_por_region=comunas_por_region, error=None)

    # Obtener datos del formulario
    nombre_contacto = request.form.get("nombre_contacto")
    email_contacto = request.form.get("email_contacto")
    telefono_contacto = request.form.get("telefono_contacto")
    sector = request.form.get("sector")
    
    # Información de ubicación
    region_id = request.form.get("region_id")
    comuna_id = request.form.get("comuna_id")
    
    # Información de la mascota
    tipo_animal = request.form.get("tipo_animal")
    cantidad = request.form.get("cantidad")
    edad = request.form.get("edad")
    unidad_edad = request.form.get("unidad_edad")
    descripcion = request.form.get("descripcion")
    fecha_entrega = request.form.get("fecha_entrega")
    
    # Archivos y contactos adicionales
    fotos_mascota = request.files.getlist("fotos_mascota")
    metodo_contacto = request.form.get("metodo_contacto")
    num_contacto = request.form.get("num_contacto")

    error = ""
    
    if validate_adoption_notice(
        contact_name=nombre_contacto,
        email=email_contacto,
        animal_type=tipo_animal,
        quantity=cantidad,
        age=edad,
        age_unit=unidad_edad,
        delivery_date=fecha_entrega,
        commune_id=comuna_id,
        pet_images=fotos_mascota,
    ):
        if validate_phone(telefono_contacto) and validate_sector(sector):
            
            # Crear el aviso de adopción
            status, msg = create_adoption_notice(
                nombre_contacto=nombre_contacto,
                email_contacto=email_contacto,
                telefono_contacto=telefono_contacto,
                sector=sector,
                tipo_animal=tipo_animal,
                cantidad=int(cantidad),
                edad=int(edad),
                unidad_edad=unidad_edad,
                descripcion=descripcion,
                fecha_entrega=datetime.fromisoformat(fecha_entrega.replace('Z', '+00:00')),
                comuna_id=int(comuna_id)
            )
            
            if status:
                aviso_id = msg

                for foto in fotos_mascota:
                    if foto and foto.filename and validate_pet_images([foto]):
                        _filename_hash = hashlib.sha256(
                            secure_filename(foto.filename).encode("utf-8")
                        ).hexdigest()
                        _extension = filetype.guess(foto).extension
                        img_filename = f"{_filename_hash}_{str(uuid.uuid4())}.{_extension}"

                        # Guardar archivo
                        foto.save(os.path.join(app.config["UPLOAD_FOLDER"], img_filename))
                        
                        # Guardar en base de datos
                        add_pet_photo(aviso_id, img_filename)

                if metodo_contacto and num_contacto:
                    add_contact_method(aviso_id, metodo_contacto, num_contacto)

                flash("Hemos recibido la información de adopción, muchas gracias y suerte!", "success")
                return redirect(url_for("exito"))

            else:
                error += msg
        else:
            error += "Datos de contacto no válidos."
    else:
        error += "Uno de los campos obligatorios no es válido."

    # En caso de error, volver a mostrar el formulario con mensajes
    regiones = get_regiones()
    return render_template("auth/agregar_aviso.html", regiones=regiones, error=error)

# --- Listado de Avisos con paginación ---
@app.route("/listado-adopciones")
def listado_adopciones():
    try:
        page = int(request.args.get("page", 1))
    except ValueError:
        page = 1

    paginated = get_paginated_adoptions(page=page, per_page=5)
    avisos = paginated["avisos"]
    total_paginas = paginated["total_paginas"]
    pagina_actual = paginated["pagina_actual"]

    data_listado = []
    for aviso in avisos:
        comuna = get_comuna_by_id(aviso.comuna_id)
        # Convertir unidad de edad para mostrar
        unidad_edad_texto = "años" if aviso.unidad_edad == "a" else "meses"
        cantidad_tipo_edad = f"{aviso.cantidad} {aviso.tipo_animal} {aviso.edad} {unidad_edad_texto}"
        total_fotos = len(get_pet_photos(aviso.id))
        data_listado.append({
            "fecha_publicacion": aviso.fecha_publicacion.strftime("%Y-%m-%d %H:%M"),
            "fecha_entrega": aviso.fecha_entrega.strftime("%Y-%m-%d %H:%M"),
            "comuna": comuna.nombre if comuna else "",
            "sector": aviso.sector or "",
            "cantidad_tipo_edad": cantidad_tipo_edad,
            "nombre_contacto": aviso.nombre_contacto,
            "total_fotos": total_fotos,
            "aviso_id": aviso.id,
        })

    has_prev = pagina_actual > 1
    has_next = pagina_actual < total_paginas
    
    # Cargar todas las comunas
    regiones = get_regiones()
    comunas_por_region = {}
    for region in regiones:
        comunas = get_comunas_by_region(region.id)
        comunas_por_region[region.id] = [{"id": c.id, "nombre": c.nombre} for c in comunas]

    return render_template(
        "auth/lista.html",
        data=data_listado,
        pagina_actual=pagina_actual,
        total_paginas=total_paginas,
        has_prev=has_prev,
        has_next=has_next,
        comunas_por_region=comunas_por_region,
    )


@app.route("/detalle-aviso/<int:aviso_id>")
def detalle_aviso(aviso_id):
    aviso = get_adoption_notice_by_id(aviso_id)
    if not aviso:
        return render_template("auth/detalles.html", detalle=None, fotos=[])

    comuna = get_comuna_by_id(aviso.comuna_id)
    region_nombre = comuna.region.nombre if comuna and comuna.region else ""
    comuna_nombre = comuna.nombre if comuna else ""

    fotos = [
        url_for("static", filename=f"uploads/{f.ruta_archivo}")
        for f in get_pet_photos(aviso.id)
    ]
    contactos = get_contact_methods(aviso.id)

    unidad_edad_texto = "años" if aviso.unidad_edad == "a" else "meses"
    
    # Obtener método de contacto 
    metodo_contacto = ""
    num_contacto = ""
    if contactos:
        metodo_contacto = contactos[0].metodo_contacto
        num_contacto = contactos[0].num_contacto
    
    detalle = {
        "nombre_contacto": aviso.nombre_contacto,
        "email_contacto": aviso.email_contacto,
        "telefono_contacto": aviso.telefono_contacto,
        "metodo_contacto": metodo_contacto,
        "num_contacto": num_contacto,
        "region": region_nombre,
        "comuna": comuna_nombre,
        "sector": aviso.sector,
        "tipo_animal": aviso.tipo_animal,
        "cantidad": aviso.cantidad,
        "edad": aviso.edad,
        "unidad_edad": unidad_edad_texto,
        "fecha_entrega": aviso.fecha_entrega.strftime("%Y-%m-%d %H:%M"),
        "descripcion": aviso.descripcion,
        "fotos": fotos,
        "metodos_contacto_adicionales": contactos,
    }

    return render_template("auth/detalles.html", detalle=detalle, fotos=fotos)

@app.route("/estadisticas")
def estadisticas():
    return render_template("auth/estadisticas.html")

@app.route("/exito")
def exito():
    return render_template("auth/exito.html")

if __name__ == "__main__":
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    
    app.run(debug=False)