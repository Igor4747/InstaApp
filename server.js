const { read } = require('fs');
const http = require('http');
const imageRouter = require("./app/server/imageRouter")
const tagsRouter = require("./app/server/tagsRouter")
const filtersRouter = require("./app/server/filtersRouter")
const getFileRouter = require("./app/server/getFileRouter")
const userRouter = require("./app/server/userRouter")
const profileRouter = require("./app/server/profileRouter")

require('dotenv').config();

http
    .createServer(async (req, res) => {

        //pozowlenie reactowi na obsluge serwera

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', '*');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        //tags

        if (req.url.search("/api/tags") != -1) {
            await tagsRouter(req, res)
        }

        else if (req.url.search("/api/images/tags") != -1) {
            console.log("tags")
            await tagsRouter(req, res)
        }

        //images

        else if (req.url.search("/api/images") != -1) {
            await imageRouter(req, res)
        }

        //filters

        else if (req.url.search("api/filters") != -1) {
            await filtersRouter(req, res)
        }

        //getfile 

        else if (req.url.search("api/getfile") != -1) {
            await getFileRouter(req, res)
        }

        //users router

        else if (req.url.search("/api/user") != -1) {
            await userRouter(req, res)
        }

        //profiles router

        else if (req.url.search("/api/profile") != -1) {
            await profileRouter(req, res)
        }

    })
    .listen(process.env.APP_PORT, () => console.log(`listen on ${process.env.APP_PORT}`))
