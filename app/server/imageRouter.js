const jsonController = require("./jsonController")
const fileController = require("./fileController")
const tagsController = require("./tagsController")
const utils = require("./getRequestData")
const { takeCoverage } = require("v8")
const model = require("./model")
const images = model.images
const logger = require('tracer').colorConsole();

const router = async (req, res) => {
    if (req.url == "/api/images" && req.method == "GET") {//get all
        jsonController.getAll(req, res)
    }
    else if (req.url.match(/\/api\/images\/([A-Za-z]+)/) && req.method == "GET") {//update
        jsonController.getByAlbumName(req, res)
    }
    else if (req.url.match(/\/api\/images\/([0-9]+)/) && req.method == "GET") {//get by id
        jsonController.getOne(req, res)
    }
    else if (req.url == "/api/images" && req.method == "POST") {//post
        fileController.add(req, res)
    }
    else if (req.url.match(/\/api\/images\/([0-9]+)/) && req.method == "DELETE") {//delete
        fileController.delete(req, res)
    }
    else if (req.url.match(/\/api\/images\/([0-9]+)/) && req.method == "PATCH") {//update
        let body = await utils.getRequestData(req)
        body = JSON.parse(body)
        jsonController.update(req, res, body)
    }
}

module.exports = router