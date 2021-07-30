import React, { useEffect,useState } from 'react';
import './giftcard.css'
import { toast } from 'react-toastify';
import Navbar from '../layout/Navbar';


import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';

export default function SendGiftCard(props) {
    const [catalog,setCatalog]=useState([]);
    const [loading,setLoading]=useState(true);
    const [amounts,setAmounts]=useState([]);

    const id = props.match.params.id;

    const [giftCard,setGiftCard]=useState();

    const [user, setUser] = useState({
        name:'',
        email: '',
    
      });
    
      const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

    useEffect(()=>{
        const getData = async()=>{
            try{
                const result = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/catalog`);
                console.log(result)

                await Promise.all(result.data.data.d.map((company)=>{
                    if(company.code === id){
                        setGiftCard(company);
                        setAmounts(company.value.split(","))
                    }
                }))
                
                setCatalog(result.data.data.d);
                setLoading(false);
            }catch(err){
                console.log(err);
                setLoading(false);
            }
            
        }

        getData();
    },[])

    const sendGiftCard = async(e)=>{
        e.preventDefault();
        const token= localStorage.getItem('auth-token');
        const config = {
            headers: { 'Authorization': `Bearer ${token}`,
            'Content-type':'application/json'
        }
        };
        const {name,email}=user;
        if(email === '' ||  name === ''){
            toast.error('All fields are required.Please fill all', {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              });
              return;
          }

        try{
            const result = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/send-gift-card/init`,{
                name,
                email,
                code:id,
                amount:amount
            },config)
            window.location.href = result.data.data.redirect_url
            console.log(result)
        }catch(err){
            console.log(err);
        }
    }

    const [amount,setAmount]=useState();
    const changeAmount = (e)=>{
        console.log(e.target.value)
        setAmount(Number(e.target.value) + 0.99);
    }
    return loading ? (<div>Loading</div>):(
        
    <div >
    <Navbar/>
    <section id="login-page">
    
    
    
    <div className="container login-page" >
    <div className="row" style={{margin:10}}>
    
    <div class="form">
    <div class="form-toggle"></div>
    <div class="form-panel one">
      <div class="form-header">
        <h1>Send Gift Card</h1>
      </div>
      
      <div class="form-content">
      
        <form>
        
        <div className="form-group">
        <img src={giftCard.logo} className="img-fluid"></img>
            <p style={{marginTop:'1rem'}}>{giftCard.desc}</p>
        
        </div>
        
        <div class="form-group"><label for="name">Name</label><input onChange={onChange} type="text" id="name" name="name" required="required" /></div>
          <div class="form-group"><label for="email">Email</label><input onChange={onChange} type="text" id="email" name="email" required="required" /></div>

          <div className="form-group">
            <label>Amount - Fees 0.99</label>
            <select className="form-control" onChange={changeAmount} name="amount">
            {
                amounts.map((amt)=>{
                    return(
                        <option value={amt}>{amt}</option>
                    )
                })
            }
            
            </select>
          
          
          </div>

          <div className="form-group">
                <label>Total Amount - {amount} USD</label>
          
          </div>
        
         
          
          
          
          
          
          

          
            
            
            
            

            
          
          
          
          
          
          
          
          
          
          <div class="form-group"><button onClick={sendGiftCard} >Send Gift Card</button></div>
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
