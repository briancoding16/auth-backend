const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
   email: {
    type: String,
    required: [true, 'Por favor coloque el Email'],
    unique: [true, 'El email ya existe'],
   },

   password: {
    type: String,
    required: [true, 'Por favor un password'],
    unique: false
   },

})

module.exports  = mongoose.model('User', UserSchema)