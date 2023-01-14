const dbConnect = require('./db/dbConnect');
const jwt = require("jsonwebtoken");
const User = require('././db/userModel');
const bcrypt = require('bcrypt');
const express = require('express')
const app = express();
const cors = require('cors')
const auth = require('./auth')

const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

dbConnect()

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });

app.listen(PORT, ()=>{
    console.log(`listening on ${PORT}`)
    console.log('s')
})



app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then((hashedPassword)=>{
        const user = new User({
            name: req.body.name,
            email:req.body.email,
            password:hashedPassword
        })
        user.save()
        .then((result) => {
            res.status(201).send({
                message: 'User Created successfully',
                result,
            })
        })
        .catch((e) => {
            res.status(500).send({
                message: 'Error creating user',
                e,
            })
        })
    })
    
    .catch((e)=>{
        res.status(500).send({
            message:'Password was not hashed successfully',
            e,
        })
    })
})


app.post('/login', (req, res) => {
    console.log('ENTRO')
    const {email, name} = req.body
    console.log(email)
    User.findOne({email})
    .then((user)=>{
        bcrypt.compare(req.body.password, user.password)
        .then(passwordCheck => {
            if(!passwordCheck){
                return res.status(400).send({
                    message:'Password does not macht',
                    error
                })
            }
            const token = jwt.sign(
                {
                    userId:user._id,
                    userEmail: user.email
                },
                "RANDOM-TOKEN",
                {expiresIn: '24h'}
            )
            res.status(200).send({
                message:'Login successful',
                email:user.email,
                name: name,
                token
            })
        }) 
        .catch((error) => {
            res.status(400).send({
                message:'Passwords does not match',
                error
            })
        })
    })
    .catch((error)=>{
        res.status(404).send({
            message: 'Email not found',
            error
        })
    })
})

// free endpoint
app.get("/free-endpoint", (request, response) => {
    response.json({ message: "You are free to access me anytime" });
  });
  
  // authentication endpoint
  app.get("/auth-endpoint",auth,(request, response) => {
    response.json({ message: "You are authorized to access me" });
  });

module.exports = app;