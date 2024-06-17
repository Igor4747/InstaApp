const tagsController = require("./tagsController")
const utils = require("./getRequestData")
const { takeCoverage } = require("v8")
const model = require("./model")
const tags = model.tags
const logger = require('tracer').colorConsole();

const router = async (req, res) => {
    if (req.url == "/api/tags" && req.method == "GET") {//get all
        tagsController.getAll(req, res)
    }
    else if (req.url == "/api/tags/raw" && req.method == "GET") {//get all
        tagsController.getAllRaw(req, res)
    }
    else if (req.url.match(/\/api\/tags\/([0-9]+)/) && req.method == "GET") {//get by id
        tagsController.getOne(req, res)
    }
    else if (req.method == "GET" && req.url.match(/\/api\/photos\/tags\/([0-9]+)/)) {//get tag of photo
        tagsController.getTags(req, res)
    }

    else if (req.url == "/api/tags" && req.method == "POST") {//post
        let body = await utils.getRequestData(req)
        tagsController.addOne(req, res, body)
    }
    else if (req.url == "/api/images/tags" && req.method == "PATCH") {//update
        let body = await utils.getRequestData(req)
        tagsController.updateWithOne(req, res, body)
    }
    else if (req.url == "/api/images/tags/mass" && req.method == "PATCH") {//update
        let body = await utils.getRequestData(req)
        tagsController.updateWithMany(req, res, body)
    }
    else if (req.url.match(/\/api\/images\/tags\/([0-9]+)/) && req.method == "GET") {//get tags of specific image
        tagsController.getTagsOfImage(req, res)
    }
}

module.exports = router

