const model = require("./model")
const users = model.users
const logger = require('tracer').colorConsole();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const allFunctionsObj = {
    register: async (body, res) => {
        let encryptedPassword = await encryptPass(body.password)
        let newUser = {
            "id": Math.floor(Math.random() * 100000),
            "name": body.name,
            "lastName": body.lastName,
            "email": body.email,
            "confirmed": false,
            "password": encryptedPassword
        }
        users.push(newUser)
        let token = await createToken(newUser)
        let activateAccountInfo = "Skopiuj poniższy link do przeglądarki w celu potwierdzenia konta <p style='font-size: x-small'> http://localhost:3000/api/user/confirm/" + token + "</p>Uwaga: link jest ważny przez godzinę"
        res.end(JSON.stringify(activateAccountInfo, null, 5))
    },
    confirm: async (token, res) => {
        let decoded = await verifyToken(token)
        logger.log(decoded)
        if (decoded.ok == true) {
            users.map(function (user) {
                // logger.log(decoded.decoded.id, user.id)
                // logger.log("user", user)
                if (user.id == decoded.decoded.id) {
                    user.confirmed = true
                    console.log(user)
                    res.end(JSON.stringify("Konto " + user.email + " zostalo powtierdzone", null, 5))
                }
            })
        }
        else {
            res.writeHead(401, { "Content-Type": "application/json" }); // invalid token
            res.end("nie udalo sie")
        }
    },
    checkPassword: async (user, password, res) => {
        let decryptedPassword = await decryptPass(password, user.password)
        if (decryptedPassword == true) {
            let token = await createToken(user)
            logger.log(token)
            let messege = {
                token: token,
                user: user
            }
            res.end(JSON.stringify(messege, null, 5))
        }
        else {
            res.end(JSON.stringify("podaj poprawne haslo"))
        }
    }
}

const encryptPass = async (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let encryptedPassword = await bcrypt.hash(password, 10);
            resolve(encryptedPassword);
        }
        catch (err) {
            reject(err.mesage)
        }
    })
}

const decryptPass = async (userpass, encrypted) => {
    return new Promise(async (resolve, reject) => {
        try {
            let decrypted = await bcrypt.compare(userpass, encrypted)
            resolve(decrypted);
        }
        catch (err) {
            resolve(err.mesage)
        }
    })
}

const createToken = async (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let token = await jwt.sign(
                user,
                process.env.SECRET_KEY,
                {
                    expiresIn: "1h" // "1m", "1d", "24h"
                }
            );
            resolve(token)
        }
        catch (err) {
            reject(err.mesage)
        }
    })
}

const verifyToken = async (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            let decoded = await jwt.verify(token, process.env.SECRET_KEY)
            logger.log({ decoded: decoded })
            resolve({ decoded, ok: true });
        }
        catch (ex) {
            logger.log({ message: ex.message })
            resolve({ messege: ex.message, ok: false });
        }
    })
}

module.exports = allFunctionsObj
