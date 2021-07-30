const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const helmet=require('helmet');
require('./db/connection');
const userRoutes=require('./routes/user');
const pageRoutes = require('./routes/pages');
const cardRoutes = require('./routes/cards');


const app=express();
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use(helmet());

app.use('/api/user',userRoutes);
app.use('/api',pageRoutes);
app.use('/api',cardRoutes);

app.get('/',(req,res)=>{
    res.status(200).send('Gift Easy Backend')
})


const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log('Listening on port '+port);
})





