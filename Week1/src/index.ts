import express from "express";
import bodyParser from "body-parser";
import {videoRouter} from "./router/video-router";

const app = express();
const port = process.env.PORT || 5000;
const parserMiddleWare = bodyParser();

// Middleware
app.use(parserMiddleWare); // -- bodyParser
app.use(videoRouter); // -- Routing

app.listen(port, () => {
    console.log(`App started at ${port} port!`)
})