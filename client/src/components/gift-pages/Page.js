import axios from 'axios';
import React,{useEffect, useState} from 'react'
import './pages.css'
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import Navbar from '../layout/Navbar';
import { Link } from 'react-router-dom';


export default function Page(props) {
    const [page,setPage]=useState(null);
    const id = props.match.params.id;

    const [content,setContent]=useState("");
    const [contentTitle,setContentTitle]=useState("");
    const [isLoading,setIsLoading]=useState(false);
    const [loading,setLoading]=useState(false);
    

    const [details,setDetails]=useState({
        name:'',
        email:''

    })

    const [catalog,setCatalog]=useState([]);
    const [amounts,setAmounts]=useState([]);


    const [giftCard,setGiftCard]=useState();

    const onChange = e => setDetails({ ...details, [e.target.name]: e.target.value });

    const submit = (e)=>{
        e.preventDefault();

        const {name,email}=details;

       

        if(name ===''  || email === ''){
            toast.error('Please fill all the details', {
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

        const body = {
            name,
            email,
        }
        setLoading(true);

        axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/createBuyer/${id}`,body).then((res)=>{
            console.log(res);
            window.location.href = res.data.data.redirect_url
        }).catch(err=>{
            console.log(err);
            toast.error('Something went wrong', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
                setLoading(false);
        })
    }

    

    useEffect(()=>{
        const getData = async()=>{
            try{
                const result = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/catalog`);
                console.log(result)
                setCatalog(result.data.data.d);
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/page/${id}`);
                setContent(res.data.data.content);
            
                setContentTitle(res.data.data.title);
                setIsLoading(false);
            }catch(err){
                toast.error('Something went wrong.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                    setIsLoading(false);
            }
        }

        getData();
            

    
        
    },[])

    const [amount,setAmount]=useState();
    const changeAmount = (e)=>{
        console.log(e.target.value)
        setAmount(Number(e.target.value) + 0.99);
    }
    return isLoading ?(
        <div class="d-flex justify-content-center" style={{ marginTop: '5rem' }}>

            <div class="col-sm-6 text-center"><p>Loading ...</p>
                <div class="loader4"></div>

            </div>

        </div>
    ):(
        <LoadingOverlay
            active={loading}
            spinner
            text='Loading ...'
            >
            <Navbar/>
        
    
    <div class="container" style={{marginTop:'5rem'}}>
    <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <center><h3>{contentTitle}</h3></center>
            <div className="content" dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>

        <div className="col-xl-12  col-lg-12 col-md-12 col-sm-12">
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
                                            <Link to={`${id}/gift-card/send/${company.code}`} className="btn" style={{width:'18rem',backgroundColor:'#5a5af3',color:'white'}}>Buy</Link>
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

        </LoadingOverlay>
    )
}
