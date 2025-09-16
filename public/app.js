async function cargar() {
  const res = await fetch('/api/conceptos');
  const data = await res.json();
  const ul = document.getElementById('lista');
  ul.innerHTML = '';
  if (!data.length) {
    ul.innerHTML = '<li>No hay conceptos todavía.</li>';
    return;
  }
  for (const c of data) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>#${c.id} - ${c.nombre}</strong><br>${c.desarrollo}`;
    ul.appendChild(li);
  }
}

async function borrarTodos() {
  await fetch('/api/conceptos', { method: 'DELETE' });
  await cargar();
}

async function borrarUno() {
  const id = document.getElementById('idBorrar').value;
  if (!id) return alert('Ingresá un ID');
  const r = await fetch(`/api/conceptos/${id}`, { method: 'DELETE' });
  if (r.status === 404) alert('ID no encontrado');
  await cargar();
}

document.getElementById('btnBorrarTodo').addEventListener('click', borrarTodos);
document.getElementById('btnBorrarUno').addEventListener('click', borrarUno);

window.addEventListener('DOMContentLoaded', cargar);
