import React, { useEffect, useState } from 'react';
import './pages.css';

import Navbar from '../layout/Navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ListPages() {

    const [pages,setPages]=useState([]);
    const [loading,setLoading]=useState(true);
    


    useEffect(()=>{
        const token= localStorage.getItem('auth-token');
        const config = {
            headers: { 'Authorization': `Bearer ${token}`,
            'Content-type':'application/json'
        }
        };
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/pages`,config).then(res=>{
            console.log(res);
            setPages(res.data.data);
            setLoading(false);
        }).catch(err=>{
            console.log(err);
            setLoading(false);
        })
    },[])

    const getDate = (date) => {
        const data = new Date(date);
        return data.toDateString();
    }
    return loading ? (
        <div class="d-flex justify-content-center" style={{ marginTop: '5rem' }}>

            <div class="col-sm-6 text-center"><p>Loading ...</p>
                <div class="loader4"></div>

            </div>

        </div>
    ):(
        <div>
        <Navbar/>
        <section id="featured-services" class="featured-services">
        <div class="section-title-pages">
          <h3><i className="fa fa-file-text-o"></i><span>{'  '}Pages</span></h3>
          
        </div>
        <div class="container" data-aos="fade-up" style={{marginTop:'4rem'}}>

        
  
          <div class="row" style={{marginTop:'2rem'}}>
          <div class="col-md-12 col-lg-12 col-xl-12" >
          <Link to="/page/add" className="btn btn-lg btn-block" style={{backgroundColor:'rgba(86, 58, 250, 0.9)',color:'white',marginBottom:'1.5rem'}}><i className="fa fa-upload"></i>{'  '}Create a Page</Link>
          {
              pages.length ===0 ?<div></div> : pages.map((page)=>{
                  return(
                    
                        <div class="icon-box" data-aos="fade-up" data-aos-delay="100" style={{marginBottom:'1.5rem'}}>
                            <div class="icon"><i class="fa fa-file-text-o"></i></div>
                            <h4 class="title"><Link to={`/page/${page._id}`}>{page.title}</Link></h4>
                            <p class="description">{getDate(page.createdAt)}</p>
                            <div style={{float:'right'}}>
                                <Link to={`/page/edit/${page._id}`} className="btn btn-warning" style={{marginRight:'10px'}}><i className="fa fa-pencil"></i>{' '}Edit</Link>
                                
                            </div>
                        </div>
                    
                  )
              })
          }
          </div>
          
            
  
            
  
            
  
          </div>
  
        </div>
      </section>
        </div>
    )
}
