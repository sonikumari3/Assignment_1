const express = require('express');
const mongoose = require('mongoose');

const router = require('./route/route')

const app = express()
app.use(express.json())


mongoose.connect('mongodb+srv://Soni:ASj7w5ibygF7H8hy@cluster0.vjzcsaj.mongodb.net/test',{
    useNewUrlParser:true
})
.then (() => console.log('mongoDB is connected '))
.catch(err => console.log(err))
app.use("/",router)

app.listen(process.env.PORT || 4000,function(){
    console.log("Express app running on PORT "+(process.env.PORT || 3000))
})