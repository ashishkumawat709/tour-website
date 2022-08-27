const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const tourSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    cpassword:{type:String, required:true},
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
})

tourSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY)  
        this.tokens = this.tokens.concat({token:token})  
        await this.save();  
        return token
    } catch (error) {
        res.send(error)
        console.log(error);       
    }
}

tourSchema.pre("save", async function(next){
    if(this.isModified("password")){
        console.log(`password original is ${this.password}`)
        this.password = await bcrypt.hash(this.password, 10)
        this.cpassword = await bcrypt.hash(this.cpassword, 10)
        console.log(`password hashed is ${this.password}`)
    }
    next()
})


const Register = new mongoose.model('Register', tourSchema)

module.exports = Register