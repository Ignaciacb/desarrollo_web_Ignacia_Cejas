
function mostrar(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
}
let fotosCount = 1;
function agregarFoto(){
  if(fotosCount>=5){ 
    alert("Máximo 5 fotos permitidas"); 
    return; 
  }
  fotosCount++;
  let div=document.getElementById("fotos");
  let input=document.createElement("input");
  input.type="file"; 
  input.name="foto"+fotosCount;
  div.appendChild(document.createElement("br"));
  div.appendChild(input);
}

function finalizar(){
  document.getElementById("confirmacion").style.display="none";
  document.getElementById("gracias").style.display="block";
}

function cancelar(){
  document.getElementById("confirmacion").style.display="none";
  document.getElementById("avisoForm").style.display="block";
}

function verDetalle(id){
  mostrar("detalle");
  let data = {
    1:{nombre: "Kitty, Luna y Pecas",fecha_publicacion:"2025-08-26 14:51",fecha_entrega:"2025-08-26",comuna:"Santiago",sector:"Beauchef", cantidadtipoedad: "3 gatitos, 2 meses", nombre_contacto:"Alejandra Pena", fotos:["https://st3.depositphotos.com/16283778/33024/i/450/depositphotos_330241708-stock-photo-two-little-striped-kittens-blue.jpg","https://img.freepik.com/fotos-premium/tres-lindos-gatitos-prado_416511-2846.jpg" ]},
    2:{nombre: "Lepu",fecha_publicacion:"2025-08-26 14:51",fecha_entrega:"2025-08-26",comuna:"Valparaíso",sector:"Cerro alegre", cantidadtipoedad: "1 gato, 8 años", nombre_contacto: "Carlos Delgado",fotos:["https://clinicaveterinariapica.com/wp-content/uploads/2023/10/gato-anciano.jpg"]},
    3:{nombre: "Rocky",fecha_publicacion:"2025-08-26 14:51",fecha_entrega:"2025-08-26",comuna:"Concepción",sector:"Talcahuano", cantidadtipoedad: "1 perro, 5 meses", nombre_contacto: "Hernan Ramos",fotos:["https://clinicalaveterinaria.it/wp-content/uploads/2024/12/Cane-cucciolo.jpg"]},
    4:{nombre: "Mila y Molly",fecha_publicacion:"2025-08-26 14:51",fecha_entrega:"2025-08-26",comuna:"Temuco",sector:"El Carmen", cantidadtipoedad: "2 perros, 1 mes", nombre_contacto: "Elisa Figueroa",fotos:["https://lenda.net/wp-content/uploads/2024/08/001.jpg"]},
    5:{nombre: "Chispita",fecha_publicacion:"2025-08-26 14:51",fecha_entrega:"2025-08-26",comuna:"La Serena",sector:"Avenida del mar", cantidadtipoedad: "1 perro, 3 años", nombre_contacto: "Gloria Flores",fotos:["https://media.biobiochile.cl/wp-content/uploads/2017/09/pug-645x350.jpg"]}
  };
  let r = data[id];
  let html = "<p><strong>Nombre:</strong> "+r.nombre+"</p>"+
             "<p><strong>Fecha publicacion:</strong> "+r.fecha_publicacion+"</p>"+
             "<p><strong>Fecha entrega:</strong> "+r.fecha_entrega+"</p>"+
             "<p><strong>Comuna:</strong> "+r.comuna+"</p>"+
             "<p><strong>Sector:</strong> "+r.sector+"</p>"+
             "<p><strong>Cantidad/Tipo/Edad:</strong> "+r.cantidadtipoedad+"</p>"+
             "<p><strong>Nombre de contacto:</strong> "+r.nombre_contacto+"</p>"
             
             
  r.fotos.forEach(f => {
    html += '<img src="' + f + '" class="foto-mini" alt="Foto de ' + r.cantidadtipoedad + ' (' + r.nombre + ')" onclick="ampliarFoto(\'' + f + '\')">';
  });
  document.getElementById("contenidoDetalle").innerHTML = html;
}

function mostrarInputContacto() {
  var div = document.getElementById("Contacto");
  div.style.display = "block";
}

function setMinFechaEntrega() {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const hour = String(new Date().getHours()+3).padStart(2, '0');
  const min = String(new Date().getMinutes()).padStart(2, '0');
  const localDatetime = `${year}-${month}-${day}T${hour}:${min}`;
  
  const input = document.getElementById('fechaEntrega');
  input.min = localDatetime;
  input.value = localDatetime;
}

window.addEventListener('DOMContentLoaded', setMinFechaEntrega);

function ampliarFoto(url){
  document.getElementById("fotoGrande").src = url.replace("320/240","800/600");
  document.getElementById("overlay").style.display="flex";
}

function cerrarFoto(){
  document.getElementById("overlay").style.display="none";
}
 
