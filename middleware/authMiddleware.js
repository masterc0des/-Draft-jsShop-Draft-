const jwt                   = require('jsonwebtoken');
const mongoose              = require('mongoose');
const User                  = require('../models/User');

const checkUser = (req, res, next) => {

    const token = req.cookies.jwt;

    if (token) {
        
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {

            if (err) {

                console.log(err.message);
                res.locals.user = null;
                res.locals.email = null;
                next();

            }
            else {

                let user = await User.findById(decodedToken.userID);

                res.locals.user = user;
                res.locals.email = decodedToken.email;

                next();
            }
        });
    }
    else {
        res.locals.user = null;
        next();
    }
}


module.exports = { /*authenticateToken,*/ checkUser };

/*
function authenticateToken(req, res, next) {

    var token = req.cookies.jwt;

    if (token) {
        
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {

            if (err) {

                console.log(err.message);
                res.redirect('/login');
                next();

            }
            // Read content from JWT:
            // In the JWT the ID of the user is serialized
            // and corresponds to the ID of the user in DB.
            // So, for example, take the unserialized username
            // and replace "Log-In" with the username.
            else {

                
                

                next();
            }
        });
    }
    else {
        //res.redirect('/login');
    }
}
*/