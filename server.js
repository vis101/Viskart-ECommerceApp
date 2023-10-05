import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cors from 'cors';
import path from 'path';

//rest object
const app =  express();

//configure env
dotenv.config()

//database config
connectDB();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')));

//routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//rest api
app/use('*', function(req, res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"));
});

//rest api
app.get('/',(req,res)=>{
    res.send("<h1>Welcome to VisKart</h1>");
})

const PORT = process.env.PORT || 8999;

app.listen(PORT, ()=>{
    console.log(`Server Running on port ${PORT}`);
})