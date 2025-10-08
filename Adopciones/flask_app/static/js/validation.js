const validateSector = (sector) => {
  if (!sector) return true;
  return sector.trim().length <= 100;
}

const validateName = (name) => {
  if (!name) return false;
  return name.trim().length >= 3 && name.trim().length <= 200;
}

const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return email.length <= 100 && emailRegex.test(email);
}

const validatePhone = (phone) => {
  if (!phone || phone === '' || phone === '+569') return true;
  return /^\+569\d{8}$/.test(phone);
}

const validateFiles = (files) => {
  if (!files || files.length === 0) return false;
  if (files.length < 1 || files.length > 5) return false;
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  for (let i = 0; i < files.length; i++) {
    if (!allowedTypes.includes(files[i].type)) {
      return false;
    }
  }
  return true;
}

// Revisa que exista un valor seleccionado o no
const validateSelect = (value) => {
  return value && value !== '';
}

const validateNumber = (value, min = 1) => {
  const num = parseInt(value);
  return !isNaN(num) && num >= min && num === parseFloat(value);
}

const validateDeliveryDate = (dateString) => {
  if (!dateString) return false;
  const deliveryDate = new Date(dateString);
  const minDate = new Date(Date.now() + 60 * 60 * 1000);
  return deliveryDate >= minDate;
}

const validateDescription = (description) => {
  if (!description) return true;
  return description.trim().length <= 1000;
}

const validateContactMethod = (method, value) => {
  if (!method) return true;
  if (method && !value) return false;
  const trimmed = value ? value.trim() : '';
  return trimmed.length >= 4 && trimmed.length <= 50;
}

const validateContactValue = (value) => {
  if (!value) return true;
  const trimmed = value.trim();
  return trimmed.length >= 4 && trimmed.length <= 50;
}

function validateForm() {
  const form = document.getElementById("avisoForm");
  if (!form) {
    return false;
  }
  
  const data = {
    nombre_contacto: form["nombre_contacto"].value,
    email_contacto: form["email_contacto"].value,
    telefono_contacto: form["telefono_contacto"].value,
    sector: form["sector"].value,
    region_id: form["region_id"].value,
    comuna_id: form["comuna_id"].value,
    tipo_animal: form["tipo_animal"].value,
    cantidad: form["cantidad"].value,
    edad: form["edad"].value,
    unidad_edad: form["unidad_edad"].value,
    fecha_entrega: form["fecha_entrega"].value,
    descripcion: form["descripcion"].value,
    fotos_mascota: form["fotos_mascota"].files,
    metodo_contacto: form["metodo_contacto"].value,
    valor_contacto: form["valor_contacto"].value
  };

  const errors = [];
  
  const addError = (field) => errors.push(field);

  if (!validateName(data.nombre_contacto)) addError("Nombre de contacto");
  if (!validateEmail(data.email_contacto)) addError("Email");
  if (!validatePhone(data.telefono_contacto)) addError("Teléfono");
  if (!validateSector(data.sector)) addError("Sector");
  if (!validateSelect(data.region_id)) addError("Región");
  if (!validateSelect(data.comuna_id)) addError("Comuna");
  if (!validateSelect(data.tipo_animal)) addError("Tipo de animal");
  if (!validateNumber(data.cantidad)) addError("Cantidad");
  if (!validateNumber(data.edad)) addError("Edad");
  if (!validateSelect(data.unidad_edad)) addError("Unidad de edad");
  if (!validateDeliveryDate(data.fecha_entrega)) addError("Fecha de entrega");
  if (!validateDescription(data.descripcion)) addError("Descripción");
  if (!validateFiles(data.fotos_mascota)) addError("Fotos de la mascota");
  if (!validateContactMethod(data.metodo_contacto, data.valor_contacto)) addError("Método de contacto adicional");
  if (!validateContactValue(data.valor_contacto)) addError("ID/URL de contacto");

  if (errors.length > 0) {
    alert("Los siguientes campos son inválidos:\n• " + errors.join("\n• "));
    return false;
  }
  
  showConfirmationDialog();
  return true;
}


function showConfirmationDialog() {
    // Ocultar el formulario
  const myForm = document.getElementById("avisoForm");
    myForm.style.display = "none";

  const confirmationDiv = document.createElement("div");
  confirmationDiv.id = "confirmation-dialog";
  confirmationDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 30px;
    border: 2px solid #4CAF50;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    z-index: 1000;
    text-align: center;
    max-width: 500px;
    width: 90%;
  `;

  const message = document.createElement("p");
  message.innerHTML = "¿Está seguro que desea agregar este aviso de adopción?";
  message.style.cssText = `
    font-size: 18px;
    margin-bottom: 20px;
    color: #333;
  `;

  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = `
    display: flex;
    gap: 15px;
    justify-content: center;
  `;

  const confirmButton = document.createElement("button");
  confirmButton.innerText = "Sí, estoy seguro";
  confirmButton.className = "boton";
  confirmButton.style.cssText = `
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  `;
  confirmButton.addEventListener("click", () => {
    // Enviar el formulario
    myForm.submit();
  });

  const cancelButton = document.createElement("button");
  cancelButton.innerText = "No, quiero volver";
  cancelButton.className = "boton-sec";
  cancelButton.style.cssText = `
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  `;
  cancelButton.addEventListener("click", () => {
      // Mostrar el formulario nuevamente
      myForm.style.display = "block";
    confirmationDiv.remove();
  });

  buttonContainer.appendChild(confirmButton);
  buttonContainer.appendChild(cancelButton);
  confirmationDiv.appendChild(message);
  confirmationDiv.appendChild(buttonContainer);

  document.body.appendChild(confirmationDiv);
};


document.addEventListener('DOMContentLoaded', function() {
  
  const fechaEntrega = document.getElementById('fecha_entrega');
  if (fechaEntrega) {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    fechaEntrega.min = now.toISOString().slice(0, 16);
  }

  const regionSelect = document.getElementById('region_id');
  if (regionSelect) {
    regionSelect.addEventListener('change', function() {
      if (typeof cargarComunas === 'function') {
        cargarComunas(this.value);
      }
    });
  }
  
  
});