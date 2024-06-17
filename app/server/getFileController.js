const model = require("./model")
const utils = require("./getRequestData")
const tags = model.tags
const images = model.images
const logger = require('tracer').colorConsole();
const fs = require("fs")
const path = require("path")

const allFunctionsObj = {
    getFileByUrl: (url) => {
        return new Promise(async (resolve, reject) => {
            try {
                fs.readFile(url, (err, data) => {
                    if (err) throw err
                    resolve(data)
                })
            }
            catch (err) {
                reject(err.mesage)
            }
        })
    }
}

module.exports = allFunctionsObj
