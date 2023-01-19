const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Por favor coloque el Name'],
     },

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

   admin: {
      type: Boolean,
      default: true
     },

   inversion: {
      type: Number,
     },
  

})

module.exports  = mongoose.model('User', UserSchema)