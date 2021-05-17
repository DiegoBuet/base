import React from 'react';
import {db} from '../firebase';
import Calendario from './Calendario';

function App(props) {
  
  const [tareas, setTareas] = React.useState([])
  const [tarea, setTarea] = React.useState('')
  const [modoEdicion, setModoEdicion] = React.useState(false)
  const [id, setId] = React.useState('')




  React.useEffect(() => {



    const obtenerDatos = async () => {

      try {

        
        const data = await db.collection(props.user.uid).get()
        const arrayData = data.docs.map( doc => ({id: doc.id, ...doc.data()}))
        console.log(arrayData)
        setTareas(arrayData)

      } catch (error) {
        console.log(error)
      }
    }

    obtenerDatos()

  }, [])
  
  const agregar = async (e) => {
    e.preventDefault()
    if(!tarea.trim()){
      console.log('está vacio')
      return
    }
    try {

        const nuevaTarea = {
        nombre: tarea,
        fecha: Date.now()
      }
      const data = await db.collection(props.user.uid).add(nuevaTarea)

      setTareas([
        ...tareas,
        {...nuevaTarea, id: data.id}
      ])

      setTarea('')

    } catch (error) {
      console.log(error)
    }
    console.log(tarea)
  }

  const eliminar = async (id) => {
    try{

      await db.collection(props.user.uid).doc(id).delete()

      const arrayFiltrado = tareas.filter(item => item.id !== id)
      setTareas(arrayFiltrado)

    } catch (error) {
      console.log(error)
    }
  }

  const activarEdicion = (item) => {
    setModoEdicion(true)
    setTarea(item.nombre)
    setId(item.id)
  }

  const editar = async (e) => {
    e.preventDefault()
    if(!tarea.trim()){
      console.log('vacio')
      return
    }
    try {
      
      await db.collection(props.user.uid).doc(id).update({
        nombre: tarea
      })
      const arrayEditado = tareas.map(item => (
        item.id === id ? {id: item.id, fecha: item.fecha, nombre: tarea} : item
      ))
      setTareas(arrayEditado)
      setModoEdicion(false)
    setTarea('')
    setId('')

    } catch (error) {
      console.log(error)
      
    }
  }

  return (
    <div className="container">
     
      <div className="row">
        <div className="col mb-2">
        
          <h3>
            {
              modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
            }
          </h3>
          <form onSubmit={ modoEdicion ? editar : agregar}>
            <input
            type="text"
            placeholder="Ingrese tarea"
            capture="form-control"
            onChange={e => setTarea(e.target.value)}
            value={tarea}
            />
            <br/>
            <button className={
              modoEdicion ? 'btn btn-warning col-4 mt-2' : 'btn btn-dark mt-2 col-4'
            }
            type="submit"
            >
              {
                modoEdicion ? 'Editar' : 'Agregar'
              }
            </button>
          </form>
        </div>
          <ul className="list-group">
            {
              tareas.map(item =>(
                <li className="list-group-item" key={item.id}>
                  {item.nombre}                 
                  <button 
                  className="btn btn-danger float-end"
                  onClick={() => eliminar (item.id)}
                  >Eliminar</button>
                  <button 
                  className="btn btn-warning float-end me-2"
                  onClick={() => activarEdicion(item)}
                  >Editar</button>
                   <button 
                  className="btn btn-info float-end me-2"
                  
                  >Mover</button>

                </li>
              ))
            }
          </ul>        
      </div>
      <Calendario/>

    </div>
  );
}

export default App;