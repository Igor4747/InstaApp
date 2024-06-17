const model = require("./model")
const formidable = require('formidable');
const path = require('path')
const users = model.users
const uploadPath = './upload/'
const logger = require('tracer').colorConsole();
const bcrypt = require('bcryptjs');
const fs = require('fs')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const allFunctionsObj = {
    verifyToken: async (token) => {
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
    },
    addPhoto: (req, res, id) => {
        let form = formidable({});

        form.keepExtensions = true // zapis z rozszerzeniem pliku

        form.uploadDir = uploadPath// folder do zapisu zdjęcia

        form.parse(req, function (err, fields, files) {
            const dirPath = path.join(uploadPath, fields.album, "profile-image")
            let url = files.file.path
            if (!fs.existsSync(dirPath)) {
                fs.mkdir(dirPath, (err) => {
                    if (err) throw err
                    var oldPath = url
                    let arr = oldPath.split("/")
                    let name = arr[arr.length - 1]
                    var newPath = path.join(dirPath, name)
                    fs.rename(oldPath, newPath, function (err) {
                        if (err) throw err
                        res.end(JSON.stringify("dodano zdjecie"))
                    })
                })
            }
            else {
                var oldPath = url
                let arr = oldPath.split("/")
                let name = arr[arr.length - 1]
                var newPath = path.join(dirPath, name)
                fs.rename(oldPath, newPath, function (err) {
                    if (err) throw err
                    res.end(JSON.stringify("dodano zdjecie"))
                })
            }
        });
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
