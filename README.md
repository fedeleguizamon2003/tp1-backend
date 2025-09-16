# TP1 — Backend básico con Node 

**Alumno:** Federico Eulogio Leguizamón López  
**Materia:** Taller de Programación 2

## Objetivo
Implementar un servidor Node **sin Express** que:
- Reciba conceptos (nombre + desarrollo) mediante formulario.
- Guarde en **arreglos en memoria** y los muestre en una vista con **CSS**.
- Exponga endpoints **REST** en JSON: `GET`, `GET/:id`, `DELETE`, `DELETE/:id`.
- Use **Git** con al menos dos ramas (producción y test).

## Cómo correr
```bash
npm start ``

Abrir en el navegador: http://localhost:3000

Endpoints REST
GET /api/conceptos → lista todos los conceptos.

GET /api/conceptos/:id → obtiene un concepto por su id.

DELETE /api/conceptos → elimina todos los conceptos.

DELETE /api/conceptos/:id → elimina un concepto en particular.

1** Formulario vacio: 
![Formulario vacio](FormuVacio.png)

2** Creacion de un concepto: 
![Concepto creado](crear.png)

3** Listado de conceptos: 
![Lista completa](lista.png)

4** Eliminar por ID:
![Eliminar](ID1.png)
![Eliminado](ID2.png)

5** Eliminar todos:
![Todos](DELETE.png)

 Conclusiones

Aprendizaje: comprendí cómo funciona un backend básico en Node usando módulos nativos (http, url, fs), manejo de formularios y rutas REST.

Dificultades y resolución:

Al principio ejecuté npm start fuera de la carpeta y no encontraba package.json. Lo resolví usando pwd y cd para entrar a la carpeta correcta (tp1-backend).

También tuve problemas con Git al intentar subir la rama test porque no había commits iniciales. Lo solucioné configurando mi identidad (git config con nombre y mail), creando el primer commit y luego haciendo el push.

Extra: entendí cómo usar Git con ramas (test y main) y cómo subir a GitHub.