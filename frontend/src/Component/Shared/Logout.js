import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../../Context/LoginSessionContext';
import '../componentStyle.css';
import Navbar from './Navbar';

export default function Logout(){
    const { logoutFunc } = useContext(AuthContext)

    useEffect(() => {
        logout();
        // eslint-disable-next-line
    }, []);

    async function logout() {
        await logoutFunc();
    }

    return(
        <div>
            <Navbar/>
            <div className='logout-message'>
                <h3>Thank you and see you again!</h3>
            </div>
        </div>
    )
}