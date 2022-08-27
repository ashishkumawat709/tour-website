const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 5000
const mongoose = require('./db/conn')
const Register = require('./models/register')
const hbs = require('hbs')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv').config()


const viewpath = path.join(__dirname,'./templates/views')
const partialspath = path.join(__dirname,'./templates/partials')
app.set('view engine', 'hbs')
app.set('views', viewpath)
hbs.registerPartials(partialspath)
app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.get('/', (req,res)=>{
    res.render('index')
})

app.get('/register', (req,res)=>{
    res.render('register')
})

app.post('/register', async(req,res)=>{
try {
    const password = req.body.password
    const cpassword = req.body.cpassword

    if(password ===  cpassword){
        const registerUser = new Register({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword,
        })

        const token = await registerUser.generateAuthToken()

        const result = await registerUser.save()
        res.status(201).render('index')
        console.log(result);
    }else{
        res.send('passwords not match')
    }
} catch (error) {
    res.status(400).send(error)
}
})

app.get('/login', (req,res)=>{
    res.render('login')
})

app.post('/login', async(req,res)=>{
    try {
        const email = req.body.email
        const password = req.body.password

        const result = await Register.findOne({email:email})
        const token = await result.generateAuthToken()

  const isMatch = await bcrypt.compare(password, result.password)
    if(isMatch){
        res.status(201).render('index')
    }else{
        res.send('invalid user credentials')
    }
    } catch (error) {
        res.status(400).send('not registerd user')
    }
})

app.listen(port,()=>{
    console.log('listenign 5000');
})

