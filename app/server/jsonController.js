const model = require("./model")
const images = model.images
const logger = require('tracer').colorConsole();


let notFound = {
    status: 404,
    message: ""
}
let deleteMessage = {
    status: 202,
    message: ""
}
let updateMessage = {
    status: 200,
    image: []
}

const allFunctionsObj = {
    add: (fields, files, res, newPath) => {
        let newImage = {
            "id": Math.floor(Math.random() * 100000),
            "album": fields.album,
            "originalName": files.file.name,
            "url": newPath,
            "lastChange": "original",
            "history": [
                {
                    "status": "original",
                    "lastModifiedDate": files.file.lastModifiedDate
                }
            ]
        }
        images.push(newImage)
        let message = {
            status: 201,
            image: newImage
        }
        logger.log("image sent")
        res.end(JSON.stringify(message, null, 5))
    },
    delete: (req, res, id, index) => {
        images.splice(index, index + 1)
        deleteMessage.message = "usunieto image z id: " + id
        res.end(JSON.stringify(deleteMessage))
    },
    update: (req, res, body) => {
        logger.log("update")
        let arr = req.url.split("/")
        let id = parseInt(arr[arr.length - 1])
        let image = null
        images.map(function (elem, i) {
            if (elem.id == id) {
                image = elem
            }
        })
        if (image != null) {
            history = image.history
            let index = history.length
            const date = new Date()
            console.log(body)
            history.push({
                status: body.status,
                value: body.value,
                timestamp: date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate() + "_" + date.getHours() + ":" + date.getMinutes()
            })
            image.history = history
            res.end(JSON.stringify(image, null, 5))
            image = null
        }
        else {
            notFound.message = "image with id: " + id + " was not found"
            res.end(JSON.stringify(notFound))
        }
    },
    getAll: (req, res) => {
        logger.log("get all")
        res.end(JSON.stringify(images, null, 5))
    },
    getOne: (req, res) => {
        logger.log("get by id")
        let arr = req.url.split("/")
        let id = parseInt(arr[arr.length - 1])
        image = null
        images.map(function (elem, i) {
            if (elem.id == id) {
                image = elem
            }
        })
        if (image != null) {
            res.end(JSON.stringify(image, null, 5))
            image = null
        }
        else {
            notFound.message = "image with id: " + id + " was not found"
            res.end(JSON.stringify(notFound, null, 5))
        }
    },
    getByAlbumName: (req, res) => {
        let arr = req.url.split("/")
        let albumName = arr[arr.length - 1]
        let imagesArr = []
        images.map(function (elem, i) {
            if (elem.album == albumName) {
                imagesArr.push(elem)
            }
        })
        if (imagesArr.length > 0) {
            res.end(JSON.stringify(imagesArr, null, 5))
            imagesArr = []
        }
        else {
            notFound.message = "album with name: " + albumName + " was not found"
            res.end(JSON.stringify(notFound, null, 5))
        }
    },
    fileNotFound: (req, res, id) => {
        notFound.message = "image with id: " + id + " was not found"
        res.end(JSON.stringify(notFound, null, 5))
    }
}
module.exports = allFunctionsObj