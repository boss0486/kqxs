var { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();
// JK4:allen
class SecurrityLib {
    generateGuiId() {
            return uuidv4();
        }
        //
    generateToken = (_uuid) => {
        var token = jwt.sign({ uuid: _uuid }, process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
        return token;
    };
    static getUuidByLoginToken = (token) => {
        return jwt.decode(token, process.env.TOKEN_SECRET);
    };
    static hashPassword = async function(password) {
        var salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    };
    static checkPassword = async function(password, _hash) {
        return bcrypt.compareSync(password, _hash); // true ||  false
    };
    static verifyToken = async function(token) {
        try {
            return await jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (error) {
            return false;
        }
    };


}
module.exports = SecurrityLib;