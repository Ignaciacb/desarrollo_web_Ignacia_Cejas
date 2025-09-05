const validateSector = (sector) => {
  if (!sector) return true;
  let lengthValid = sector.trim().length <= 100; //trim saca los espacios vacios 
  
  return lengthValid;
}

const validateName = (name) => {
  if(!name) return false;
  let lengthValid = name.trim().length >= 3 && name.trim().length <= 200; //trim saca los espacios vacios y tiene que ser de largo minimo 3 y maximo 200
  
  return lengthValid;
}

const validateEmail = (email) => {
  if (!email) return false;
  let lengthValid = email.length <= 100;

  // validamos el formato
  let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  let formatValid = re.test(email);

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && formatValid;
};

const validateNumero = (numero) => {
  if (!numero) return true; // hay que hacer esto cuando el campo es opcional
  // validación de longitud
  let lengthValid = numero.length >= 12;

  // validación de formato
  let re = /^[0-9]+$/;
  let formatValid = re.test(numero);

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && formatValid;
};

const validateFiles = (files) => {
  if (!files) return false;

  // validación del número de archivos
  let lengthValid = 1 <= files.length && files.length <= 5; //cantidad de archivos entre 1 y 3

  // validación del tipo de archivo
  let typeValid = true;

  for (const file of files) {
    // el tipo de archivo debe ser "image/<foo>" o "application/pdf"
    let fileFamily = file.type.split("/")[0];
    typeValid &&= fileFamily == "image";
  }

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && typeValid;
};

//revisa que exista un valor seleccionado o no
const validateSelect = (select) => {
  if(!select) return false;
  return true
}
const validateForm = () => {
  console.log("Iniciando validación del formulario...");
  
  // obtener elementos del DOM usando el ID del formulario.
  let myForm = document.getElementById("avisoForm");
  let name = myForm["nombre"].value;
  let email = myForm["email"].value;
  let numero = myForm["numero"].value;
  let files = myForm["fotos"].files;
  let region = myForm["region"].value;
  let comuna = myForm["comuna"].value;
  let sector = myForm["sector"].value;
  let tipo = myForm["tipo"].value;
  let cantidad = myForm["cantidad"].value;
  let edad = myForm["edad"].value;
  let unidadMedida = myForm["unidadmedida"].value;
  let fechaEntrega = myForm["fechaEntrega"].value;

  console.log("Valores obtenidos:", {name, email, numero, region, comuna, sector, tipo, cantidad, edad, unidadMedida, fechaEntrega, files: files.length});

  // variables auxiliares de validación y función.
  let invalidInputs = [];
  let isValid = true;
  const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid &&= false;
  };

  // lógica de validación 
  // si es que no se valida el nombre, invalidamos el nombre
  if (!validateName(name)) {
    setInvalidInput("Nombre");
  }
  if (!validateEmail(email)) {
    setInvalidInput("Email");
  }
  if (!validateNumero(numero)) {
    setInvalidInput("Número");
  }
  if (!validateSector(sector)) {
    setInvalidInput("Sector");
  }
  if (!validateSelect(region)) {
    setInvalidInput("Región");
  }
  if (!validateSelect(comuna)) {
    setInvalidInput("Comuna");
  }
  if (!validateSelect(tipo)) {
    setInvalidInput("Tipo de mascota");
  }
  if (!cantidad || cantidad <= 0) {
    setInvalidInput("Cantidad");
  }
  if (!edad || edad < 0) {
    setInvalidInput("Edad");
  }
  if (!validateSelect(unidadMedida)) {
    setInvalidInput("Unidad de medida");
  }
  if (!fechaEntrega) {
    setInvalidInput("Fecha de entrega");
  }
  if (!validateFiles(files)) {
    setInvalidInput("Fotos");
  }

  // Mostrar resultado de validación
  if (!isValid) {
    // Mostrar errores en una alerta
    let errorMessage = "Los siguientes campos son inválidos:\n";
    for (let input of invalidInputs) {
      errorMessage += "• " + input + "\n";
    }
    alert(errorMessage);
    return false;
  } else {
    // Ocultar el formulario
    myForm.style.display = "none";

    // establecer mensaje de éxito
    validationMessageElem.innerText = "¿Está seguro que desea agregar este aviso de adopción?";
    validationListElem.textContent = "";

    // aplicar estilos de éxito
    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";

    // Agregar botones para enviar el formulario o volver
    let submitButton = document.createElement("button");
    submitButton.innerText = "Sí, estoy seguro";
    submitButton.style.marginRight = "10px";
    submitButton.addEventListener("click", () => {
      // myForm.submit();
      validationBox.hidden = true;
      // Muestra el mensaje de gracias
      // Mostrar mensaje y botón para volver
      const agradecimiento = document.createElement("div");

      const mensaje = document.createElement("p");
      mensaje.innerHTML = "Hemos recibido la información de adopción, muchas gracias y suerte!";
      agradecimiento.appendChild(mensaje);

      const volverBtn = document.createElement("button");
      volverBtn.innerText = "Volver a la portada";
      volverBtn.className = "boton";
      volverBtn.addEventListener("click", () => {
        // Mostrar la portada y ocultar el mensaje
        agradecimiento.remove();
        document.getElementById("portada").classList.add("visible");
      });
      agradecimiento.appendChild(volverBtn);

      // Ocultar otras secciones y mostrar el mensaje en pantalla
      document.querySelectorAll("section").forEach(s => s.classList.remove("visible"));
      document.body.appendChild(agradecimiento);

    });

    let backButton = document.createElement("button");
    backButton.innerText = "No, no estoy seguro, quiero volver al formulario";
    backButton.addEventListener("click", () => {
      // Mostrar el formulario nuevamente
      myForm.style.display = "block";
      validationBox.hidden = true;
    });

    validationListElem.appendChild(submitButton);
    validationListElem.appendChild(backButton);

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  }
};


let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", validateForm);

