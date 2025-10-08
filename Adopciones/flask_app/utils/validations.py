import re
import filetype
from datetime import datetime, timedelta

def validate_contact_name(value):
    return value and len(value.strip()) >= 3 and len(value) <= 200

def validate_email(value):
    return value and "@" in value and len(value) <= 100

def validate_phone(value):
    if not value:
        return True  # Opcional
    pattern = r'^\+569\d{8}$'
    return bool(re.match(pattern, value))

def validate_sector(value):
    if not value:
        return True  # Opcional
    return len(value) <= 100

def validate_animal_type(value):
    allowed_types = ["perro", "gato"]
    return value in allowed_types

def validate_quantity(value):
    try:
        return int(value) >= 1
    except (ValueError, TypeError):
        return False

def validate_age(value):
    try:
        return int(value) >= 1
    except (ValueError, TypeError):
        return False

def validate_age_unit(value):
    return value in ["meses", "años"]

def validate_delivery_date(value):
    if not value:
        return False
    try:
        delivery_date = datetime.fromisoformat(value.replace('Z', '+00:00'))
        min_date = datetime.now() + timedelta(hours=2)  
        return delivery_date >= min_date
    except ValueError:
        return False

def validate_description(value):
    if not value:
        return True  # Opcional
    return len(value.strip()) > 0

def validate_commune_id(value):
    return value and value.isdigit()

def validate_contact_methods(methods, values):
    if not methods:
        return True  # Opcional
    
    if len(methods) > 5:
        return False
    
    allowed_methods = ["whatsapp", "telegram", "X", "instagram", "tiktok", "otra"]
    for method in methods:
        if method not in allowed_methods:
            return False
    
    for method, value in zip(methods, values):
        if not value or len(value.strip()) < 4 or len(value.strip()) > 50:
            return False
    
    return True

def validate_pet_images(pet_images):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
    ALLOWED_MIMETYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}

    if pet_images is None or len(pet_images) == 0:
        return False

    if len(pet_images) > 5:
        return False

    for i, image in enumerate(pet_images):
        if not image or image.filename == "":
            return False

        mimetype_ok = hasattr(image, 'mimetype') and image.mimetype in ALLOWED_MIMETYPES

        ext = image.filename.rsplit('.', 1)[-1].lower() if '.' in image.filename else ''
        ext_ok = ext in ALLOWED_EXTENSIONS

        if not (mimetype_ok and ext_ok):
            return False

    return True

def validate_adoption_notice(contact_name, email, animal_type, quantity, age, age_unit, delivery_date, commune_id, pet_images):
    
    return (validate_contact_name(contact_name) and
            validate_email(email) and
            validate_animal_type(animal_type) and
            validate_quantity(quantity) and
            validate_age(age) and
            validate_age_unit(age_unit) and
            validate_delivery_date(delivery_date) and
            validate_commune_id(commune_id) and
            validate_pet_images(pet_images))

