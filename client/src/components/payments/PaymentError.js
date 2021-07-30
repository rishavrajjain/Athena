import React, { useEffect, useState } from 'react'
import './payment.css';

import Navbar from '../layout/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PaymentError(props) {

    

    
    return (
        <div >
        <Navbar/>
        <section id="login-page">
        
        
        
        <div className="container login-page" >
        <div className="row">
            
                
                <div class="form">
                    
                    <div class="form-panel one">
                    <div class="form-header">
                            <h1> Order Failed :(</h1>
                            <h6>Please try again</h6>
                        </div>
                    <img src="https://i.postimg.cc/Mpn5YbSB/hero-img.png" class="img-fluid animated" alt=""/>
                        
                        <div class="form-content">
                        <div class="form-header">
                            
                        </div>
                           
                        </div>
                    </div>
            
                </div>
            
            

        
            
        
        
      </div>
      
        
       
        
        </div>
        </section>
        </div>
    )
}
