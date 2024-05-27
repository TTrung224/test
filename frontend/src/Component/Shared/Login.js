import React, { useContext, useState } from 'react';
import { AuthContext } from '../../Context/LoginSessionContext';
import '../componentStyle.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Login(){
    const { loginFunc } = useContext(AuthContext)
    const [formData, setFormData] = useState({emailOrPhone: "", pwd: ""})
    const navigate = useNavigate()

    const submitHandler = async event => {
        event.preventDefault();
        try{
            const userData = await loginFunc(formData)
            if(userData.success){
                navigate("/")
            }else{
                alert(userData.data)
            }
        } catch(error){
            alert("something went wrong, please try again")
        }
    }

    return(
        <div className='login-form'>           
            <h2>Login</h2>
            <br/>
            <form className='login-form' id="login" onSubmit={submitHandler}>
                <div className='signup-left'>
                    <label htmlFor="email">Email or Phone</label>
                    <input type='text' id="email" placeholder='Enter email/phone number' required onChange={(e)=>setFormData({...formData, emailOrPhone: e.target.value})}/>
                    <label c="password">Password</label>
                    <input type='password' id='password' placeholder='Enter password' required onChange={(e)=>setFormData({...formData, pwd: e.target.value})}/>
                    <button type='submit'>Login</button>
                    <p>Dont have an account? <Link to='/signup'>Sign up</Link> here  </p>
                </div>           
            </form>
        </div>
    )
}