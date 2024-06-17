const profileController = require("./profileController")
const utils = require("./getRequestData")
const { takeCoverage } = require("v8")
const model = require("./model")
const images = model.images
const users = model.users
const DelTokens = model.DeletedTokens
const logger = require('tracer').colorConsole();
const sharp = require("sharp");

const router = async (req, res) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // czytam dane z nagłowka 
        let token = req.headers.authorization.split(" ")[1]
        let tokenDeleted = false
        console.log(token)
        DelTokens.map(function (delToken) {
            logger.log(delToken, token)
            if (delToken == token) {
                tokenDeleted = true
            }
        })
        if (tokenDeleted == false) {
            if (req.url == "/api/profile" && req.method == "GET") {//pobranie danych usera
                let info = await profileController.verifyToken(token)
                let user = info.decoded
                let userData = {
                    name: user.name,
                    lastname: user.lastName,
                    email: user.email
                }
                res.end(JSON.stringify(info, null, 5))
            }
            else if (req.url == "/api/profile" && req.method == "PATCH") {
                let body = await utils.getRequestData(req)
                body = JSON.parse(body)
                let info = await profileController.verifyToken(token)
                let myUser
                users.map(function (user) {
                    if (user.email = info.decoded.email) {
                        user.name = body.name
                        user.lastName = body.lastName
                        myUser = user
                    }
                })
                res.end(JSON.stringify(myUser, null, 5))
            }
            else if (req.url == "/api/profile" && req.method == "POST") {
                let info = await profileController.verifyToken(token)
                let id = (info.decoded.id).toString()
                profileController.addPhoto(req, res, id)
            }
        }
        else {
            res.end("bledny token lub token wygasl")
        }
    }
    else {
        res.end("bledny token lub token wygasl")
    }
}

module.exports = router