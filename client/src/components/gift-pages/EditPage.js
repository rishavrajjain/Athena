import React,{ useState,useContext, Fragment, useEffect} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import Navbar from '../layout/Navbar';
import {toast} from 'react-toastify';
import './pages.css';




class MyUploadAdapter {
    constructor( loader ) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file
            .then( file => new Promise( ( resolve, reject ) => {

                const toBase64 = file => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
                
                return toBase64(file).then(cFile=>{

                    const index=cFile.search("base64,")
                    const image=cFile.slice(index+7);
                    const formData=new FormData();
                    console.log(image)
                    formData.append('image',image);
                    return  axios.post(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMAGE_UPLOAD_API_KEY}`,formData).then((d) => {
                        if (d.status) {
                            this.loader.uploaded = true;
                            resolve( {
                                default: d.data.data.url
                            } );
                        } else {
                            reject(`Couldn't upload file: ${ file.name }.`)
                        }
                    }).catch(err=>{
                        console.log(err.message);
                    });
                })
                
            } ) );
    }

   
}

function MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader );
    };
}



const EditPage = (props) => {

    const id = props.match.params.id;
    

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/page/${id}`).then((res)=>{
            setContent(res.data.data.content);
            setContentTitle(res.data.data.title);
        }).catch(err=>{
            toast.error('Something went wrong.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        })
    },[])
    

    const [content,setContent]=useState("");
    const [contentTitle,setContentTitle]=useState("");
    const [isLoading,setIsLoading]=useState(false);
    


    

    const createContent=async ()=>{

        if(contentTitle === ""){
            toast.error('Title Cannot be empty.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            return;
        }

        if(content === ""){
            toast.error('Content Cannot be empty.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            return;
        }
        
        setIsLoading(true);
        const token= localStorage.getItem('auth-token');
        const config = {
            headers: { 'Authorization': `Bearer ${token}`,
            'Content-type':'application/json'
        }
        };
        
        try{
            const res=await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/page/${id}`,{
                title:contentTitle,
                content,

            },config)
            setContent(" ");
            setContentTitle(" ");

           
            setIsLoading(false);
            props.history.push('/pages')
            toast.success('🦄 Page updated successfully !', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            
            
        }catch(err){
            console.log(err)
            toast.error('Error.Something went wrong.Please try again.', {
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

    const onChange=(e)=>{
        setContentTitle(e.target.value)
    }

    return isLoading?(
        <div class="d-flex justify-content-center" style={{ marginTop: '5rem' }}>

            <div class="col-sm-6 text-center"><p>Loading ...</p>
                <div class="loader4"></div>

            </div>

        </div>
    ):(
        <div>
            <Navbar style={{marginBottom:'2rem'}}/>
            <div class="container" style={{marginTop:'5rem'}}>
            <div class="section-title" data-aos="fade-up">
                <p>Edit page</p>
              </div>
            <input type="text" class="form-control" placeholder="Enter Title" value={contentTitle} onChange={onChange} style={{marginBottom:'2rem'}}/>
            
            <div className="row">
            <div className="col">
            <label>Details</label>
            <CKEditor
            id="editor"
            editor={ ClassicEditor }
            data={content}
            config={{
                extraPlugins: [ MyCustomUploadAdapterPlugin ],
                removePlugins: ['MediaEmbed','Table'] 
            }}
            onReady={ editor => {
                // You can store the "editor" and use when it is needed.
                console.log( 'Editor is ready to use!', editor );
            } }
            onChange={ ( event, editor ) => {
                const data = editor.getData();
                setContent(data)
            } }
            onBlur={ ( event, editor ) => {
                console.log( 'Blur.', editor );
            } }
            onFocus={ ( event, editor ) => {
                console.log( 'Focus.', editor );
            } }
        />
        </div>
            
            </div>
            
            
            
        <button className="btn btn-block" style={{marginTop:'2rem',backgroundColor:'rgba(86, 58, 250, 0.9)',color:'white'}} onClick={createContent}>Edit Page</button>
        </div>
        </div>
        
    )
}

export default EditPage;