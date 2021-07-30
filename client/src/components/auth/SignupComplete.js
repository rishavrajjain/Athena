import React from 'react'
import './auth.css';

import Navbar from '../layout/Navbar';

export default function SignupComplete(props) {
    return (
        <div >
        <Navbar/>
        <section id="login-page">
        
        
        
        <div className="container login-page" >
        <div className="row">
            
                
                <div class="form">
                    
                    <div class="form-panel one">
                    <div class="form-header">
                            <h1> Signup Succesfull 🚀</h1>
                            <h6>Please check your mail 📧.Verify your mail to Signin.Please check your spam if not recieved</h6>
                        </div>
                    <img src="https://i.postimg.cc/Mpn5YbSB/hero-img.png" class="img-fluid animated" alt=""/>
                        
                        <div class="form-content">
                        <div class="form-header">
                            
                        </div>
                            <form>
                                <div class="form-group"><button onClick={()=>props.history.push('/login')} >Log In</button></div>
                            </form>
                        </div>
                    </div>
            
                </div>
            
            

        
            
        
        
      </div>
      
        
       
        
        </div>
        </section>
        </div>
    )
}
