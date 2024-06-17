const getFileController = require("./getFileController")
const utils = require("./getRequestData")
const { takeCoverage } = require("v8")
const model = require("./model")
const images = model.images
const logger = require('tracer').colorConsole();

let notFound = {
    status: 404,
    message: ""
}

const router = async (req, res) => {
    if (req.url.match(/\/api\/getfile\/([0-9]+)\/([A-Za-z]+)/) && req.method == "GET") {//get file with filter
        logger.log("get file with filter by id")
        let arr = req.url.split("/")
        let filter = arr[arr.length - 1]
        let id = parseInt(arr[arr.length - 2])
        logger.log(arr)
        logger.log(filter, id)
        let image
        let photoExists = false
        let url
        images.map(function (elem, i) {
            if (elem.id == id) {
                image = elem
            }
        })
        if (image != null) {
            image.history.map(async function (elem) {
                if (elem.status == filter) {
                    photoExists = true
                    url = elem.url
                }
            })
            if (photoExists == false) {
                notFound.message = "photo with id" + id + "does not have filter" + filter
                res.end(JSON.stringify(notFound, null, 5))
            }
            else {
                let photo = await getFileController.getFileByUrl(url)
                res.writeHead(200, { 'Content-Type': 'image/jpeg' })
                res.end(photo)
                image = null
            }
        }
        else {
            notFound.message = "image with id: " + id + " was not found"
            res.end(JSON.stringify(notFound, null, 5))
        }
    }
    else if (req.url.match(/\/api\/getfile\/([0-9]+)/) && req.method == "GET") {//get file
        logger.log("get file by id")
        let arr = req.url.split("/")
        let id = parseInt(arr[arr.length - 1])
        let image
        images.map(function (elem, i) {
            if (elem.id == id) {
                image = elem
            }
        })
        if (image != null) {
            let photo = await getFileController.getFileByUrl(image.url)
            res.writeHead(200, { 'Content-Type': 'image/jpeg' })
            res.end(photo)
            image = null
        }
        else {
            notFound.message = "image with id: " + id + " was not found"
            res.end(JSON.stringify(notFound, null, 5))
        }
    }

}

module.exports = router