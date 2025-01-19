const express=require('express')
const app=express()
const userModel=require("./models/user") //Getting the schema from user model
const bcrypt=require('bcryptjs')

const path=require('path')
const cookieParser = require('cookie-parser')

app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())

app.get('/',(req,res)=>{    
    // res.send('Welcome!');
    res.render("index")
})

// Creating the user, and hashing the password using bcryptjs
app.post('/create', (req,res)=>{ 
    let {username, email, password,age}=req.body;

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password, salt, async(err,hash)=>{
            let createdUer=await userModel.create({
                username,
                email,
                password: hash,
                age
            })
        
            res.send(createdUer)
        })      
    })
})

app.listen(3000)
//Daily push