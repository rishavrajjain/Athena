import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../layout/Navbar';
import './dashboard.css';
import { Link } from 'react-router-dom';

export default function Dashboard() {

    const [catalog,setCatalog]=useState([]);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const getData = async()=>{
            try{
                const result = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/catalog`);
                console.log(result)
                setCatalog(result.data.data.d);
                setLoading(false);
            }catch(err){
                console.log(err);
                setLoading(false);
            }
            
        }

        getData();
    },[])
    return (
        <div>
            <Navbar/>

            <div className="container" style={{marginTop:'5rem'}}>

            <div className="row" style={{marginTop:'1rem'}}>
            <div className="col">
                <center><h4 style={{textAlign:'center'}}>Send Gift cards to your loved ones</h4></center>
            </div>
            </div>

                <div className="row" style={{marginTop:'1rem'}}>
                
                    <div className="col">
                    {
                        catalog.map((company)=>{
                            return(
                                <div class="card mb-3" >
                                    <div class="row no-gutters">
                                        <div class="col-md-4">
                                        <img src={company.logo} class="card-img" alt="..."/>
                                        </div>
                                        <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">{company.caption}</h5>
                                            <p class="card-text">{company.desc}</p>
                                            <Link to={`/gift-card/send/${company.code}`} className="btn" style={{width:'18rem',backgroundColor:'#5a5af3',color:'white'}}>Buy</Link>
                                        </div>
                                    </div>
                                    </div>
                                    </div>
                            )
                        })
                    }
                        
                    
                    
                    </div>
                </div>
            
            
            </div>
            
        </div>
    )
}
