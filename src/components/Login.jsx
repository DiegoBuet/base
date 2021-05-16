import React from 'react'
import {auth, db} from '../firebase'
import {withRouter} from 'react-router-dom'

function Login(props) {

    const [email, setEmail] = React.useState('prueba@prueba.com')
    const [pass, setPass] = React.useState('123123')
    const [error, setError] = React.useState(null)
    const [esRegistro, setEsRegistro] = React.useState(true)
 
    const procesarDatos = e => {
        e.preventDefault()
        if(!email.trim()){
            
            setError('Ingrese Email')
            return
        }
        if(!pass.trim()){
            
            setError('Ingrese Password')
            return
        }
        if(pass.length < 6){
            
            setError('Password mayor a 6 caractéres')
            return
        }
        setError(null)
        console.log('Pasando todas las validaciones!')

        if(esRegistro){
            registrar()
        } else {
            login()
        }
    }

    const login = React.useCallback(async()=>{
        try {
            const res = await auth.signInWithEmailAndPassword(email, pass)
            console.log(res.user)
            setEmail('')
            setPass('')
            setError(null)
            props.history.push('/admin')
            
        } catch (error) {

            console.log(error)
            if(error.code === 'auth/invalid-email'){
                setError('Email no corresponde...')
            }
            if(error.code === 'auth/user-not-found'){
                setError('Email no registrado')
            }
            if(error.code === 'auth/wrong-password'){
                setError('Contraseña incorrecta')
            }
            
        }

    },[email, pass, props.history])

    const registrar = React.useCallback(async() => {

        try {

            const res = await auth.createUserWithEmailAndPassword(email, pass)
            await db.collection('usuarios').doc(res.user.email).set({
                email: res.user.email,
                uid: res.user.uid
            })
            await db.collection(res.user.uid).add({
                name: 'tarea de ejemplo',
                fecha: Date.now()
            })
            setEmail('')
            setPass('')
            setError(null)
            props.history.push('/admin')
            
        } catch (error) {

            console.log(error)
            if(error.code === 'auth/invalid-email'){
                setError('Email no válido')
            }
            if (error.code === "auth/email-already-in-use"){
                setError('Email ya utilizado')
            }
            
        }

    }, [email, pass, props.history])

    return (
        <div className="mt-5">
            <h3 className="text-center">
                {
                    esRegistro ? 'Registro de usuarios' : 'Login de acceso'
                }
            </h3>
            <hr/>
            <div className="row justify-content-center">               
                <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                    <form onSubmit={procesarDatos} className="d-grid gap-2">
                        {
                            error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )
                        }
                        <input 
                        type="email"
                        className="form-control mb-2"
                        placeholder="Ingrese un email"
                        onChange={e => setEmail (e.target.value)}
                        value={email}
                         />
                        <input 
                        type="password"
                        className="form-control mb-2"
                        placeholder="Ingrese un password"
                        onChange={e => setPass (e.target.value)}
                        value={pass}
                         />
                         <button className="btn-dark btn-lg" type="submit"
                         >
                        {
                            esRegistro ? 'Registrarse' : 'Acceder'
                        }
                        </button>
                         <button 
                         className="btn btn-info btn-sm"
                         onClick={() => setEsRegistro(!esRegistro)}
                         type='button'
                         >
                             {
                                 esRegistro ? '¿Ya estás registrado?' : '¿No tienes cuenta?'
                             }
                         </button>
                    </form>
                </div>

            </div>
            
        </div>
    )
}

export default withRouter (Login)
