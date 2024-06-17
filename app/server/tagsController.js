const model = require("./model")
const utils = require("./getRequestData")
const tags = model.tags
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
    tag: []
}
let alreadyExists = {
    status: 200,
    message: ""
}
let noTags = {
    status: "404",
    message: ""
}

const allFunctionsObj = {
    getAllRaw: (req, res) => {
        logger.log("get all raw")
        let tagsRaw = []
        tags.map(function (obj, i) {
            tagsRaw.push(obj.name)
        })
        res.end(JSON.stringify(tagsRaw, null, 5))
    },
    getAll: (req, res) => {
        logger.log("get all")
        res.end(JSON.stringify(tags, null, 5))
    },
    getOne: (req, res) => {
        logger.log("get by id")
        let arr = req.url.split("/")
        let id = parseInt(arr[arr.length - 1])
        tag = null
        tags.map(function (elem, i) {
            if (elem.id == id) {
                tag = elem
            }
        })
        if (tag != null) {
            res.end(JSON.stringify(tag, null, 5))
            tag = null
        }
        else {
            notFound.message = "tag with id: " + id + " was not found"
            res.end(JSON.stringify(notFound, null, 5))
        }
    },
    getTags: (req, res) => {

    },
    addOne: (req, res, body) => {
        let tagExists = false//flaga sprawdzajaca czy taki tag juz istnieje
        newTag = JSON.parse(body)
        tags.map(function (elem) {
            if (elem.name == newTag.name) {
                tagExists = true
                alreadyExists.message = ("istnieje juz tag z nazwa:" + newTag.name).toString()
                res.end(JSON.stringify(alreadyExists, null, 5))
            }
        })
        if (tagExists == false) {
            newTag.id = parseInt(tags.length + 1)
            tags.push(newTag)
            let message = {
                status: 201,
                image: newTag
            }
            logger.log("tag created")
            res.end(JSON.stringify(message, null, 5))
        }
    },
    updateWithOne: (req, res, body) => {
        let data = JSON.parse(body)
        let imageID = data.id
        let newTag = data.tag
        let imageNotFound = true//flaga sprawdzajaca czy istnieje image z podanym id
        images.map(function (elem) {
            if (elem.id == imageID) {
                imageNotFound = false
                if (!elem.tags) {
                    elem.tags = []
                }
                elem.tags.push(newTag)
                res.end(JSON.stringify(elem, null, 5))
            }
        })
        if (imageNotFound == true) {
            notFound.message = "photo with id: " + imageID + " was not found"
            res.end(JSON.stringify(notFound, null, 5))
        }
    },
    updateWithMany: (req, res, body) => {
        let data = JSON.parse(body)
        let imageID = data.id
        let newTags = data.tags
        let imageNotFound = true//flaga sprawdzajaca czy istnieje image z podanym id
        images.map(function (elem) {
            if (elem.id == imageID) {
                imageNotFound = false
                if (!elem.tags) {
                    elem.tags = []
                }
                newTags.map(function (tag) {
                    elem.tags.push(tag)
                })
                res.end(JSON.stringify(elem, null, 5))
            }
        })
        if (imageNotFound == true) {
            notFound.message = "photo with id: " + imageID + " was not found"
            res.end(JSON.stringify(notFound, null, 5))
        }
    },
    getTagsOfImage: (req, res) => {
        let arr = req.url.split("/")
        let imageID = arr[arr.length - 1]
        let imageNotFound = true//flaga sprawdzajaca czy istnieje image z podanym id
        images.map(function (image) {
            if (image.id = imageID) {
                imageNotFound = false
                let messegeObj = {
                    id: imageID,
                    tags: image.tags
                }
                if (image.tags) {
                    res.end(JSON.stringify(messegeObj, null, 5))
                }
                else {
                    noTags.message = "photo with id " + imageID + " does not have any tags"
                    res.end(JSON.stringify(noTags, null, 5))
                }
            }
        })
        if (imageNotFound == true) {
            notFound.message = "photo with id: " + imageID + " was not found"
            res.end(JSON.stringify(notFound, null, 5))
        }
    },
    fileNotFound: (req, res, id) => {
        notFound.message = "tag with id: " + id + " was not found"
        res.end(JSON.stringify(notFound, null, 5))
    }
}
module.exports = allFunctionsObj