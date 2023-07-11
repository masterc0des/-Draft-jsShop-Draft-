require('dotenv').config();
const express               = require('express');
const mongoose              = require('mongoose');
const app                   = express();
const expressLayouts        = require('express-ejs-layouts');
const authRoutes            = require('./routes/authRoutes');
const User                  = require('./models/User');
const { authenticateToken, checkUser } = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/css', express.static('public/css'));
app.use('/images', express.static('public/images'));
app.use('/js', express.static('public/js'));
app.use(expressLayouts);
app.use(authRoutes);
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', [
    'views',
    'public/products'
]);


mongoose.connect('mongodb://127.0.0.1:27017/jsShop', { useNewUrlParser: true, useUnifiedTopology: true } );

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (err) => {

    if (err) throw err;

});


app.get('*', checkUser);

app.get('', (req, res) => {

    res.render('index');

});

app.get('/index',(req, res) => { 
    
    res.render('index'); 

});

app.get('/technik', (req, res) => {

    res.render('technik');

});

app.get('/kontakt', (req, res) => {

    res.render('kontakt');

});

app.get('/products/articleoftheday', (req, res) => {

    res.render('articleoftheday');

});

app.get('/myaccount', (req, res) => { 

    // findById anstatt via E-Mail

    var email = res.locals.email;
    
    User.findOne( { email: email }, async (err, result) => {

        if (err) {
            throw err;
        }
        else {
            res.locals.vorname = result.vorname;
            res.locals.nachname = result.nachname;
            res.locals.geburtsdatum = result.geburtsdatum;
            res.locals.adresse = result.adresse;
            res.locals.plz = result.plz;
            res.locals.stadt = result.stadt;
            res.locals.email = result.email;
            res.locals.nutzername = result.nutzername;

            console.log(result.adresse);
            console.log(res.locals.adresse);
        }

        res.render('myaccount', {
            vorname: res.locals.vorname,
            nachname: res.locals.nachname, 
            geburtsdatum: res.locals.geburtsdatum, 
            adresse: res.locals.adresse, 
            plz: res.locals.plz,
            stadt: res.locals.stadt, 
            email: res.locals.email,
            nutzername: res.locals.nutzername,
        });
    });
});


app.listen(80, (err) => {

    if (err) throw err;

});