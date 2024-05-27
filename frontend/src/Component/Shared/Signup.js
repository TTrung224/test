import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../componentStyle.css';
import { axiosSetting } from '../../Context/constants';

export default function Signup(){
    const navigate = useNavigate()

    const [formData, setFormData] = useState({type: "customer", pwd: "", rePwd: "", email: "", phone: "", address: "", fullName: ""})
    const [error,setError] = useState("")

    function changeTypeCustomer(){
        setFormData({...formData, type: "customer"})
    }
    function changeTypeSeller(){
        setFormData({...formData, type: "seller"})
    }

    const submitHandler = async event => {
        event.preventDefault();
        let message = []
        if(formData.pwd !== formData.rePwd){
            message.push("Confirm password must be the same as password")
        } else {
            try{
                const res = await axiosSetting.post("account/signup", formData)
                if(res.status === 201){
                    alert("sign up successully")
                    navigate("/login")
                }
            } catch(error){
                if (error.response.data) alert(error.response.data)
            }
        }

        if(message.length > 0){
            setError(message.join(", "))
        }else {
            setError("")
        }
    }

    return(
        <div className='signup-form-container' onSubmit={submitHandler}>
            <label htmlFor="sign-up" ><h2>Create your Lazada Account</h2></label>
            <br/>
            <form className='signup-form' id="sign-up">
                <div className='account-type-input'>
                    <input type='radio' id='radio1' name='user_type' value="customer" defaultChecked onClick = {()=> changeTypeCustomer()} />
                    <label htmlFor='radio1'>Customer</label>
                    <input type='radio' id='radio2' name='user_type' value="seller" onClick = {()=> changeTypeSeller()}/>
                    <label htmlFor='radio2'>Seller</label>
                </div>
                <div className='signup-inputs'>
                    <div className='signup-left'>
                        <label htmlFor="email">Email</label>
                        <input type='email' id="email" placeholder='Enter yopur email' onChange={(e)=>setFormData({...formData, email: e.target.value})} required/>
                        <label htmlFor="password">Password</label>
                        <input type='password' id='password' placeholder='Enter password' onChange={(e)=>setFormData({...formData, pwd: e.target.value})} required />
                        <label htmlFor="re-pwd">Confirm password</label>
                        <input type='password' id='re-pwd' placeholder='ReEnter your password' onChange={(e)=>setFormData({...formData, rePwd: e.target.value})} required />
                        {error!=="" ? <p className='error-message'>{error}</p> : ""}
                        <button type='submit'>Create account</button>
                    </div>
                
                    {formData.type === "customer"?(
                        <div className='signup-right'> 
                            <label htmlFor="full-name">Full name</label>
                            <input type='text' id='full-name' placeholder='Enter your full name' onChange={(e)=>setFormData({...formData, fullName: e.target.value})}  required/>
                            <label htmlFor='phone-number'>Phone number</label>
                            <input type='number' id="phone-number" placeholder='Enter your phone number' onChange={(e)=>setFormData({...formData, phone: e.target.value})}  required/>
                            <label htmlFor='address'>Address</label>
                            <input type='text' id='address' placeholder='Enter your address' name='address' onChange={(e)=>setFormData({...formData, address: e.target.value})}  required/>
                            <p>Already have an account? <Link to='/login'>Sign in</Link> here </p>
                        </div>
                        
                    ):(
                        <div className='signup-right'> 
                            <label htmlFor="business-name" >Business name</label>
                            <input type='text' id='business-name' placeholder='Enter your business name' onChange={(e)=>setFormData({...formData, fullName: e.target.value})}  required/>
                            <label htmlFor='business-phone-number'>Business phone number</label>
                            <input type='number' id="business-phone-number" placeholder='Enter your business phone number' onChange={(e)=>setFormData({...formData, phone: e.target.value})}  required/>
                            <p>Already have an account? <Link to='/login'>Sign in</Link> here </p>
                        </div>
                    )}
                </div>
                <div className='form-submit'></div>
            </form>
        </div>
        
    )
}