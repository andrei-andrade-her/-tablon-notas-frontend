const API_URL = 'https://tablon-notas-backend-px5o.onrender.com/api/notas';

const formulario = document.getElementById('formulario-nota');
const contenedorNotas = document.getElementById('contenedor-notas');
const inputIdEdicion = document.getElementById('input-id-edicion');
const inputNombre = document.getElementById('input-nombre');
const textareaMensaje = document.getElementById('textarea-mensaje');
const btnEnviar = document.getElementById('btn-enviar');
const btnCancelar = document.getElementById('btn-cancelar');
const tituloFormulario = document.getElementById('titulo-formulario');

// 1. READ: Obtener y renderizar las notas
async function obtenerNotas() {
 try {
 const respuesta = await fetch(API_URL);
 const notas = await respuesta.json();
 contenedorNotas.innerHTML = '';
 
 if (notas.length === 0) {
 contenedorNotas.innerHTML = '<p style="color: #666; text-align: center; grid￾column: 1/-1;">No hay notas publicadas aún.</p>';
 return;
 }
 
 notas.forEach(nota => {
 const fecha = new Date(nota.fecha_creacion).toLocaleString();
 const tarjeta = document.createElement('div');
 tarjeta.classList.add('nota-card');
 tarjeta.innerHTML = `
 <div>
 <p class="nota-autor"> ${nota.nombre}</p>
 <p class="nota-mensaje">${nota.mensaje}</p>
 </div>
 <div>
 <div class="acciones">
 <button class="btn-editar" onclick="prepararEdicion(${nota.id}, '${nota.nombre}', '${nota.mensaje}')"> Editar</button>
 <button class="btn-eliminar" onclick="eliminarNota(${nota.id})"> Borrar</button>
 </div>
 <p class="nota-fecha">${fecha}</p>
 </div>
 `;
 contenedorNotas.appendChild(tarjeta);
 });
 } catch (error) {
 console.error('Error al obtener las notas:', error);
 contenedorNotas.innerHTML = '<p style="color: red;">Error al conectar con el servidor.</p>';
 }
}

// 2. CREATE o UPDATE: Procesar el formulario
formulario.addEventListener('submit', async (e) => {
 e.preventDefault();
 
 const id = inputIdEdicion.value;
 const nombre = inputNombre.value.trim();
 const mensaje = textareaMensaje.value.trim();
 
 const esEdicion = id !== ""; // Si hay un ID guardado, estamos editando
 const urlFinal = esEdicion ? `${API_URL}/${id}` : API_URL;
 const metodo = esEdicion ? 'PUT' : 'POST';
 
 try {
   const respuesta = await fetch(urlFinal, {
 method: metodo,
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ nombre, mensaje })
 });

 if (respuesta.ok) {
 limpiarFormulario();
 obtenerNotas();
 } else {
 alert('Error al procesar la solicitud.');
 }
 } catch (error) {
 console.error('Error:', error);
 alert('No se pudo comunicar con el servidor.');
 }
});

// 3. Pasar datos de la tarjeta al formulario para EDITAR
function prepararEdicion(id, nombre, mensaje) {
 inputIdEdicion.value = id;
 inputNombre.value = nombre;
 textareaMensaje.value = mensaje;
 
 tituloFormulario.innerText = " Editando Nota";
 btnEnviar.innerText = "Guardar Cambios";
 btnCancelar.style.display = "block";
}

// Cancelar el estado de edición
btnCancelar.addEventListener('click', limpiarFormulario);

function limpiarFormulario() {
 formulario.reset();
 inputIdEdicion.value = "";
 tituloFormulario.innerText = " Publicar Nueva Nota";
 btnEnviar.innerText = "Publicar Nota";
 btnCancelar.style.display = "none";
}

// 4. DELETE: Eliminar nota
async function eliminarNota(id) {
 if (!confirm('¿Estás seguro de que deseas eliminar esta nota?')) return;
 
 try {
 const respuesta = await fetch(`${API_URL}/${id}`, {
 method: 'DELETE'
 });
 
 if (respuesta.ok) {
 obtenerNotas();
 } else {
 alert('No se pudo eliminar la nota.');
 }
 } catch (error) {
 console.error('Error al eliminar:', error);
 alert('Error de conexión al intentar eliminar.');
 }
}

// Carga inicial
obtenerNotas();