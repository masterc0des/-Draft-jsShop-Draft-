require('dotenv').config();
const mongoose              = require('mongoose');
const bcryptjs              = require('bcryptjs');
const jwt                   = require('jsonwebtoken');
const User                  = require('../models/User');

/*
    When a user navigates to:

    GET /register
    GET /login
    GET /logout
    POST /login
    POST /register

    The server "app.js" calls hese routes automatically, since
    we added "app.use(authRoutes);".
*/

module.exports.signup_get = (req, res) => { res.render('register'); }

module.exports.login_get = (req, res) => { res.render('login'); }

module.exports.logout_get = (req, res) => {

    res.cookie('jwt', "", { httpOnly: true, maxAge: 1} );
    
    res.send("<p style='font-size: 17px; font-family: sans-serif; font-weight: 500;'>Sie haben sich erfolgreich ausgeloggt!<br><br><br>Sie werden umgehend weitergeleitet...</p> <script type='text/javascript'> function Redirect() { window.location = 'http://192.168.178.50/'} setTimeout('Redirect()', 7000);</script>");

}

module.exports.signup_post = (req, res) => { 
    
    var email = req.body.email;

    User.findOne( { email: email }, async (err, result) => {

        if (err) {

            throw err;

        }
        else {

            if (result != null) {

                res.send("<p style='font-size: 17px; font-family: sans-serif; font-weight: 500;'>Ein Nutzer mit dieser E-Mail existiert bereits!<br><br><br>Sie werden umgehend weitergeleitet...</p> <script type='text/javascript'> function Redirect() { window.location = 'http://192.168.178.50/'} setTimeout('Redirect()', 15000);</script>");
            }
            else {

                const salt = await bcryptjs.genSalt();
                const hashedPassword = await bcryptjs.hash(req.body.password, salt);

                const user = new User({
                    vorname: req.body.vorname,
                    nachname: req.body.nachname,
                    geburtsdatum: req.body.geburtsdatum,
                    adresse: req.body.adresse,
                    plz: req.body.postleitzahl,
                    stadt: req.body.stadt,
                    email: req.body.email,
                    nutzername: req.body.username,
                    passwort: hashedPassword
                });

                user.save( (err) => {

                    if (err) throw err;

                });

                res.send("<p style='font-size: 17px; font-family: sans-serif; font-weight: 500;'>Sie haben sich erfolgreich regristriert!<br><br><br>Sie werden umgehend weitergeleitet...</p> <script type='text/javascript'> function Redirect() { window.location = 'http://192.168.178.50/'} setTimeout('Redirect()', 15000);</script>");
            }
        }
    });
}

module.exports.login_post = (req, res) => { 
    
    var email = req.body.email;

    User.findOne( { email: email } , async (err, resultDB) => {
        
        if (err) {
            throw err;
        }
        else {

            bcryptjs.compare(req.body.password, resultDB.passwort, (err, result) => {
                if (err) {

                    throw err;

                }
                else if (result == true) {

                    const user = { username: resultDB.nutzername, email: resultDB.email, userID : resultDB._id };

                    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

                    res.cookie('jwt', token, { httpOnly: true, maxAge: 86400000});
                    
                    res.send("<p style='font-size: 17px; font-family: sans-serif; font-weight: 500;'>Sie haben sich erfolgreich eingeloggt!<br><br><br>Sie werden umgehend weitergeleitet...</p> <script type='text/javascript'> function Redirect() { window.location = 'http://192.168.178.50/'} setTimeout('Redirect()', 7000);</script>");

                }
                else if (result == false) {

                    res.send("<p style='font-size: 17px; font-family: sans-serif; font-weight: 500;'>Falsches Passwort!<br><br><br>Sie werden umgehend weitergeleitet...</p> <script type='text/javascript'> function Redirect() { window.location = 'http://192.168.178.50/'} setTimeout('Redirect()', 15000);</script>");

                }
            });
        }
    }); 
}

module.exports.updateacc_post = async (req, res) => { 

        var email = req.body.email;

        // Passwort wird geändert, obwohl nichts in der Textbox eingetippt wurde.
        // Vermutlich wird der "null Wert" gehasht und gespeichert.

        const salt = await bcryptjs.genSalt();
        const newHashedPassword = await bcryptjs.hash(req.body.password, salt);

        User.findOne( { email: email } , async (err, resultDB) => {
        
            if (err) {
                throw err;
            }
            else {

                const filter = { "_id" : resultDB._id };
                const update = {
        
                    "vorname" : req.body.vorname,
                    "nachname": req.body.nachname,
                    "geburtsdatum": req.body.geburtsdatum,
                    "adresse" : req.body.adresse,
                    "postleitzahl": req.body.postleitzahl,
                    "stadt": req.body.stadt,
                    "email": req.body.email,
                    "nutzername": req.body.nutzername,
                    "passwort": newHashedPassword
                };
                
                await User.findOneAndUpdate(filter, update, { new: true });
            }
        });
        
    res.send("<script type='text/javascript'> function Redirect() { window.location = 'http://192.168.178.50/myaccount'} setTimeout('Redirect()', 100);</script>");
}