
function mostrar(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
}

let fotosCount = 1;
function agregarFoto() {
  if (fotosCount >= 5) {
    alert("Máximo 5 fotos permitidas");
    return;
  }
  fotosCount++;
  const div = document.getElementById("fotos");
  if (div) {
    const input = document.createElement("input");
    input.type = "file";
    input.name = "foto" + fotosCount;
    div.appendChild(document.createElement("br"));
    div.appendChild(input);
  }
}

function finalizar(){
  const confirmacion = document.getElementById("confirmacion");
  const gracias = document.getElementById("gracias");
  if (confirmacion) confirmacion.style.display="none";
  if (gracias) gracias.style.display="block";
}

function cancelar(){
  const confirmacion = document.getElementById("confirmacion");
  const avisoForm = document.getElementById("avisoForm");
  if (confirmacion) confirmacion.style.display="none";
  if (avisoForm) avisoForm.style.display="block";
}

function verDetalle(id){
  mostrar("detalle");
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
  const contenidoDetalle = document.getElementById("contenidoDetalle");
  if (contenidoDetalle) {
    contenidoDetalle.innerHTML = html;
  }
}

function mostrarInputContacto() {
  const contactoSelect = document.getElementById('metodo_contacto');
  const contactoAdicional = document.getElementById('contacto_adicional');
  
  if (contactoAdicional) {
    contactoAdicional.style.display = contactoSelect.value ? 'block' : 'none';
  }
}

function setMinFechaEntrega() {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const hour = String(new Date().getHours()+3).padStart(2, '0');
  const min = String(new Date().getMinutes()).padStart(2, '0');
  const localDatetime = `${year}-${month}-${day}T${hour}:${min}`;
  
  const input = document.getElementById('fecha_entrega');
  if (input) {
    input.min = localDatetime;
    input.value = localDatetime;
  }
}

window.addEventListener('DOMContentLoaded', setMinFechaEntrega);

function ampliarFoto(url){
  const fotoGrande = document.getElementById("fotoGrande");
  const overlay = document.getElementById("overlay");
  if (fotoGrande) fotoGrande.src = url.replace("320/240","800/600");
  if (overlay) overlay.style.display="flex";
}

function cerrarFoto(){
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.style.display="none";
}

function cargarComunas(regionId) {
  const comunaSelect = document.getElementById('comuna_id');
  
  // Usar datos globales de comunas 
  const comunasData = window.comunasData || {};
  
  if (regionId && comunasData[regionId]) {
    comunaSelect.innerHTML = '<option value="">Seleccione comuna</option>';
    comunasData[regionId].forEach(comuna => {
      const option = document.createElement('option');
      option.value = comuna.id;
      option.textContent = comuna.nombre;
      comunaSelect.appendChild(option);
    });
  } else {
    comunaSelect.innerHTML = '<option value="">Seleccione comuna</option>';
  }
}
 
