const model = require("./model")
const utils = require("./getRequestData")
const tags = model.tags
const images = model.images
const logger = require('tracer').colorConsole();
const sharp = require("sharp");

let notFound = {
    status: 404,
    message: ""
}

const allFunctionsObj = {
    getMetadata: (image) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (image.url) {
                    let meta = await sharp(image.url)
                        .metadata()
                    resolve(meta)
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.mesage)
            }
        })
    },
    rotate: (image, angle) => {
        let arr = image.url.split(".")
        let url = arr[0]//url with comas
        let newUrl = url + "-rotate.jpg"
        return new Promise(async (resolve, reject) => {
            try {
                if (image.url) {
                    let meta = await sharp(image.url)
                        .rotate(angle)
                        .toFile(newUrl);
                    resolve(meta)
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.mesage)
            }
        })
    },
    resize: (image, width, height) => {
        let arr = image.url.split(".")
        let url = arr[0]//url with comas
        let newUrl = url + "-resize.jpg"
        return new Promise(async (resolve, reject) => {
            try {
                if (image.url) {
                    let meta = await sharp(image.url)
                        .resize({
                            width: width,
                            height: height
                        })
                        .toFile(newUrl);
                    resolve(meta)
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.mesage)
            }
        })
    },
    reformat: (image, format) => {
        let arr = image.url.split(".")
        let url = arr[0]//url with comas
        let newUrl = url + "-reformat." + format
        return new Promise(async (resolve, reject) => {
            try {
                if (image.url) {
                    let meta = await sharp(image.url)
                        .toFormat(format)
                        .toFile(newUrl);
                    resolve(meta)
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.mesage)
            }
        })
    },
    crop: (image, width, height, left, top) => {
        let arr = image.url.split(".")
        let url = arr[0]//url with comas
        let newUrl = url + "-crop.jpg"
        return new Promise(async (resolve, reject) => {
            try {
                if (image.url) {
                    let meta = await sharp(image.url)
                        .extract({ width: width, height: height, left: left, top: top })
                        .toFile(newUrl);
                    resolve(meta)
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.mesage)
            }
        })
    },
    grayscale: (image) => {
        let arr = image.url.split(".")
        let url = arr[0]//url with comas
        let newUrl = url + "-grayscale.jpg"
        return new Promise(async (resolve, reject) => {
            try {
                if (image.url) {
                    let meta = await sharp(image.url)
                        .grayscale()
                        .toFile(newUrl);
                    resolve(meta)
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.mesage)
            }
        })
    },
    flip: (image) => {
        let arr = image.url.split(".")
        let url = arr[0]//url with comas
        let newUrl = url + "-flip.jpg"
        return new Promise(async (resolve, reject) => {
            try {
                if (image.url) {
                    let meta = await sharp(image.url)
                        .flip()
                        .toFile(newUrl);
                    resolve(meta)
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.mesage)
            }
        })
    },
    flop: (image) => {
        let arr = image.url.split(".")
        let url = arr[0]//url with comas
        let newUrl = url + "-flop.jpg"
        return new Promise(async (resolve, reject) => {
            try {
                if (image.url) {
                    let meta = await sharp(image.url)
                        .flop()
                        .toFile(newUrl);
                    resolve(meta)
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.mesage)
            }
        })
    },
    negate: (image) => {
        let arr = image.url.split(".")
        let url = arr[0]//url with comas
        let newUrl = url + "-negate.jpg"
        return new Promise(async (resolve, reject) => {
            try {
                if (image.url) {
                    let meta = await sharp(image.url)
                        .negate()
                        .toFile(newUrl);
                    resolve(meta)
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.mesage)
            }
        })
    },
    tint: (image, r, g, b) => {
        let arr = image.url.split(".")
        let url = arr[0]//url with comas
        let newUrl = url + "-tint.jpg"
        return new Promise(async (resolve, reject) => {
            try {
                if (image.url) {
                    let meta = await sharp(image.url)
                        .tint({ r: r, g: g, b: b })
                        .toFile(newUrl);
                    resolve(meta)
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.mesage)
            }
        })
    },
    fileNotFound: (req, res, id) => {
        notFound.message = "image with id: " + id + " was not found"
        res.end(JSON.stringify(notFound, null, 5))
    },
}
module.exports = allFunctionsObj