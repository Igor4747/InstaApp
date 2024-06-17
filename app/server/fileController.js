const formidable = require('formidable');
const jsonController = require("./jsonController")
const uploadPath = './upload/'
const fs = require('fs')
const path = require('path')
const logger = require('tracer').colorConsole();
const model = require("./model");
const { url } = require('inspector');
const images = model.images

const allFunctionsObj = {
    add: (req, res) => {

        let form = formidable({});

        form.keepExtensions = true // zapis z rozszerzeniem pliku

        form.uploadDir = uploadPath// folder do zapisu zdjęcia

        form.parse(req, function (err, fields, files) {
            const dirPath = path.join(uploadPath, fields.album)
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
                        jsonController.add(fields, files, res, newPath)
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
                    jsonController.add(fields, files, res, newPath)
                })
            }
        });
    },
    delete: (req, res) => {
        let arr = req.url.split("/")
        let id = parseInt(arr[arr.length - 1])
        let index
        let image = null
        images.map(function (elem, i) {
            if (elem.id == id) {
                image = elem
                index = i
            }
        })
        if (image != null) {
            //miejsce na faktyczne usuniecie pliku
            let arr = image.url.split("/")
            let name = arr[arr.length - 2] + "/" + arr[arr.length - 1]
            logger.log(uploadPath, name)
            const imagePath = path.join(uploadPath, name)
            logger.log(imagePath)
            fs.unlink(imagePath, (err) => {
                if (err) throw err
                console.log("czas 1: " + new Date().getMilliseconds());
                jsonController.delete(req, res, id, index)
                image = null
            })
        }
        else {
            jsonController.fileNotFound(req, res, id)
        }
    },
}
module.exports = allFunctionsObj