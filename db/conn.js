const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/TourRegistration')
.then(()=>{
    console.log('connected with db');
})
.catch((error)=>{
    console.log(error);
})

module.exports = mongoose