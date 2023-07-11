const mongoose              = require('mongoose');

const userSchema = new mongoose.Schema({
    vorname: String,
    nachname: String,
    geburtsdatum : String,
    adresse: String,
    plz: Number,
    stadt: String,
    email: { type: String, unique: true, required: true },
    nutzername: String,
    passwort: { type: String, required: true, minLength: 8 }
});

const User = mongoose.model('User', userSchema);

module.exports = User;