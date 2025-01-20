const express=require('express')
const app=express()
const userModel=require("./models/user") //Getting the schema from user model
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

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
            let createdUser=await userModel.create({
                username,
                email,
                password: hash,
                age
            })
        
            let token=jwt.sign({email},"shhhh");
            res.cookie("token", token)
            res.send(createdUser)
        })      
    })
})

//Creating login
app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',async (req,res)=>{
    let user=await userModel.findOne({email: req.body.email});
    // console.log(user)
    if(!user) return res.send("Something went wrong!")
    
    // console.log(user.password, req.body.password)
    bcrypt.compare(req.body.password, user.password, (err,result)=>{
        if(result) {
            let token=jwt.sign({email: user.email},"shhhh");
            res.cookie("token", token)
            res.send("You can login");
        }
        else res.send("Something went wrong!")
    })
})

//Creating logout
app.get('/logout',(req,res)=>{
    res.cookie("token","")
    res.redirect('/')
})

app.listen(3000)