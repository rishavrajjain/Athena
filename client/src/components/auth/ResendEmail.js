import React,{useState} from 'react';
import './auth.css'
import { toast } from 'react-toastify';
import Navbar from '../layout/Navbar';
import axios from 'axios';



export default function ResendEmail(props) {

  const [user, setUser] = useState({
    email: ''
  });

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const submit = async (e)=>{
    e.preventDefault();

    const {email}=user;

    try{
      if(email === ''){
        toast.error('Email  cannot be empty', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      }
  
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/user/resendVerificationEmail`,{
        email:email
      })
      
      
        toast.success('Mail sent successfullty', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
          props.history.push('/');
      
     

      
    }catch(err){
      console.log(err);
      
        toast.error('Something went wrong ! Sorry :(', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      
      
    }

    


  }
    return (
        <div >
        <Navbar/>
        <section id="login-page">
        
        
        
        <div className="container login-page" >
        <div className="row" style={{margin:10}}>
        
        <div class="form">
        <div class="form-toggle"></div>
        <div class="form-panel one">
          <div class="form-header">
            <h1>Resend Verfication EMail</h1>
          </div>
          <div class="form-content">
            <form>
              <div class="form-group"><label for="email">Email</label><input onChange={onChange} type="text" id="email" name="email" required="required" /></div>
              
              
              <div class="form-group"><button onClick={submit}>Log In</button></div>
            </form>
          </div>
        </div>
        <div class="form-panel two">
          
        </div>
        </div>
        
      </div>
        
       
        
        </div>
        </section>
        </div>
    )
}
