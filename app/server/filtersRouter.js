const filtersController = require("./filtersController")
const utils = require("./getRequestData")
const { takeCoverage } = require("v8")
const model = require("./model")
const images = model.images
const logger = require('tracer').colorConsole();
const sharp = require("sharp");


const router = async (req, res) => {
    if (req.url.match(/\/api\/filters\/metadata\/([0-9]+)/) && req.method == "GET") {//get metadata
        logger.log("get metadata")
        let arr = req.url.split("/")
        let id = parseInt(arr[arr.length - 1])
        let image
        images.map(function (elem, i) {
            if (elem.id == id) {
                image = elem
            }
        })
        if (image != null) {
            let data = await filtersController.getMetadata(image)
            res.end(JSON.stringify(data, null, 5))
            image = null
        }
        else {
            filtersController.fileNotFound(req, res, id)
        }
    }
    else if (req.url == "/api/filters" && req.method == "PATCH") {//get all
        let body = await utils.getRequestData(req)
        body = JSON.parse(body)
        let id = body.id
        let image
        let alreadySent = false
        images.map(function (elem, i) {
            if (elem.id == id) {
                image = elem
            }
        })
        if (image != null) {
            let filter = body.filter.name
            switch (filter) {
                case "rotate":
                    data = await filtersController.rotate(image, body.filter.angle)
                    break
                case "resize":
                    data = await filtersController.resize(image, body.filter.width, body.filter.height)
                    break
                case "reformat":
                    data = await filtersController.reformat(image, body.filter.format)
                    break
                case "crop":
                    data = await filtersController.crop(image, body.filter.width, body.filter.height, body.filter.left, body.filter.top)
                    break
                case "grayscale":
                    data = await filtersController.grayscale(image)
                    break
                case "flip":
                    data = await filtersController.flip(image)
                    break
                case "flop":
                    data = await filtersController.flop(image)
                    break
                case "negate":
                    data = await filtersController.negate(image)
                    break
                case "tint":
                    data = await filtersController.tint(image, body.filter.r, body.filter.g, body.filter.b)
                    break
                default:
                    data = "filter with name " + filter + " was not found"
                    let notFound = {
                        status: 404,
                        message: data
                    }
                    alreadySent = true
                    res.end(JSON.stringify(notFound, null, 5))
                    break
            }
            if (alreadySent == false) {
                const date = new Date()
                let arr = image.url.split(".")
                let url = arr[0]//url with comas
                let newUrl
                if (filter == "reformat") {
                    newUrl = url + "-reformat." + body.filter.format
                }
                else {
                    newUrl = url + "-" + filter + ".jpg"
                }
                let filterData = {
                    status: filter,
                    timestamp: date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds(),
                    url: newUrl
                }
                image.history.push(filterData)
                res.end(JSON.stringify(image, null, 5))
                image = null
            }
        }
        else {
            filtersController.fileNotFound(req, res, id)
        }
    }
}

module.exports = router