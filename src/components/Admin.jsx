import React from 'react'
import {auth} from '../firebase'
import {withRouter} from 'react-router-dom'
import Firestore from './Firestore'

const Admin = (props) => {

    const [user, setUser] = React.useState(null)

    React.useEffect(() => {

        if(auth.currentUser) {
            console.log('existe un usuario')
            setUser(auth.currentUser)
        } else {
            console.log('No existe el usuario')
            props.history.push('/login')
        }

    }, [])

    return (
        <div>
            <h2>Trello</h2>
            {
                user && (
                    <Firestore user={user}/>
                )
            }
        </div>
    )
}

export default withRouter(Admin)
