const jwt = require('jsonwebtoken');
const path = require('path');
const User = require(path.resolve('./model/user.js'));
const jwtKey = 'my_secret_key';

const auth = async (req, res, next) => {
    try {
        const token = req.header("authorization");
        var decode;
        jwt.verify(token, jwtKey, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not Valid'
                })
            } else {
                decode = decoded;
            }
        });
        if (decode.role === 'Admin') {
            const user = await User.findOne({ 'tokens.token': token, 'role': { $in: [decode.role] } });
            if (!user) {
                res.status(400).send({
                    message: 'userData Not Found'
                })
            }
            req.token = token;
            req.user = user
            next();
        } else {
            res.status(400).send({
                message: 'you are not authorized to get the data'
            });
        }
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate!' })
    }
}

module.exports = auth;