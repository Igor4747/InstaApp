const userController = require("./userController")
const profileController = require("./profileController")
const utils = require("./getRequestData")
const { takeCoverage } = require("v8")
const model = require("./model")
const images = model.images
const users = model.users
const DelTokens = model.DeletedTokens
const logger = require('tracer').colorConsole();
const sharp = require("sharp");
const { decode } = require("punycode")

const router = async (req, res) => {
    if (req.url == "/api/user/register" && req.method == "POST") {//register usera
        let body = await utils.getRequestData(req)
        body = JSON.parse(body)
        let emailAlreadyUsed = false
        if (body.name && body.lastName && body.email && body.password) {
            if (body.name.length > 0 && body.lastName.length > 0 && body.email.length > 0 && body.password.length > 0) {
                users.map(function (user) {
                    if (user.email == body.email) {
                        emailAlreadyUsed = true
                    }
                })
                if (emailAlreadyUsed == false) {
                    userController.register(body, res)
                }
                else {
                    res.end(JSON.stringify("email already used"))
                }
            }
            else {
                res.end(JSON.stringify("brak wszystkich potrzebnych danych"))
            }
        }
        else {
            res.end(JSON.stringify("brak wszystkich potrzebnych danych"))
        }
    }
    else if (req.url.match(/\/api\/user\/confirm\/([A-Za-z]+)/) && req.method == "GET") {
        let arr = req.url.split("/")
        let token = arr[arr.length - 1]
        userController.confirm(token, res)
    }
    else if (req.url == "/api/user/login" && req.method == "POST") {//login usera
        let body = await utils.getRequestData(req)
        body = JSON.parse(body)
        let userExists = false
        users.map(function (user) {
            if (user.email == body.email) {//wybrany user istnieje
                userExists = true
                if (user.confirmed == true) {
                    userController.checkPassword(user, body.password, res)
                }
                else {
                    res.end(JSON.stringify("Aby się zalogowac, powtierdz rejestracje"))
                }
            }
        })
        if (userExists == false) {//wybrany user nie istnieje
            res.end(JSON.stringify("wybrany user nie istnieje"))
        }
    }
    else if (req.url == "/api/user/logout" && req.method == "GET") {//logout usera
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // czytam dane z nagłowka
            let token = req.headers.authorization.split(" ")[1]
            let info = await profileController.verifyToken(token)
            if (info.ok == true) {
                DelTokens.push(token)
                res.end(JSON.stringify(DelTokens, null, 5))
            }
            else {
                res.end("bledny token lub token wygasl")
            }
        }
        else {
            res.end("bledny token lub token wygasl")
        }
    }
    else if (req.url == "/api/user" && req.method == "GET") {//pobranie danych o wszystkich uzytkownikach
        res.end(JSON.stringify(users, null, 5))
    }
}

module.exports = router