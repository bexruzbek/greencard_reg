const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  birthday: {
    type: String,
    required: true
  },
  birthplace: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  education: {
    type: String,
    required: true
  },
  familystatus: {
    type: String,
    required: true
  },
  couple: {     // er xotin
    type: String,
  },
  childrenCount: {
    type: Number
  },
  children: {
    type: String
  },
  passportSeria: {
    type: String,
    required: true
  },
  passportExpireDate:{
    type: String,
    required: true
  },
  passportCountryIssuence: {
    type: String
  },
  zipcode: {
    type: Number,
    required: true
  },
  countryLive: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true
  },
  pasport: {
    type: String,
    required: true
  },
  yourStatus: {
    type: String,
    enum: ['No faol', 'Aktiv'],
    default: 'No faol'
  },
  yourCode: {
    type: String
  }
});

RegistrationSchema.pre('save', function(next){
  this.yourCode = Date.now().toString();
  next();
});

module.exports = mongoose.model('Registration', RegistrationSchema);
