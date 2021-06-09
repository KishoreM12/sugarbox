const jwt = require('jsonwebtoken');
const secret_key = 'f5TOrF9SOb9itpCbiBArE22DmqrzsA7H';
const _ = require('lodash');
const User = require("./user.js");

exports.generate = (id, email) => {
    const jwtClaim = { id: id, email: email }
    let expiryPeriod = 900000
    console.log(jwtClaim + "jwtclaim")
    return jwt.sign(_.merge(jwtClaim, { exp: Math.floor(Date.now() / 1000) + expiryPeriod }), secret_key);
}

exports.validate = function (app) {
    app.use(function (req, res, next) {
        let token = req.headers['token']
        console.log(token)
        if (token) {
            jwt.verify(token, secret_key, async function (err, decoded) {
                console.log("decoded email :" + decoded + " err" + err)
                decoded = { email : '', id: -1}
                next(); 
                // if (err) {
                //     console.log('Failed to authentication Token' + token)
                //     res.status(401).json({ error: 'Failed to authentication token' })
                // } else {
                //     User.findByEmail(decoded.email, async (err, data) => {
                //         if (err) {
                //             console.log('Failed to authentication Token' + token)
                //             res.status(401).json({ error: 'Failed to authentication token' })
                //         }
                //         if (data) {
                                   
                //         }
                //     });
                                       
                // }
                
            });
        } else {
            console.log('Failed to authentication Token' + token)
            res.status(401).json({ error: 'Failed to authentication token, please send token in header' })
        }
    });
}