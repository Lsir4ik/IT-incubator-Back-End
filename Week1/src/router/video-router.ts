import {Request, Response, Router} from "express";

// Data Typing
type Video = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean, // default value
    minAgeRestriction: number | null,
    createdAt: string, // $date-time
    publicationDate: string, // $date-time, default value
    availableResolutions: Array<string>
} // переделать на классах?
const resolutions: Array<string> = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]; // нужен ли enum, и, если да, то как проходить валидцию?
const videos: Array<Video> = [];

// Routing
export const videoRouter = Router();

// GET
videoRouter.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(videos);
});
videoRouter.get('/videos/:id', (req: Request, res: Response) => {
    let video = videos.find(b => b.id === +req.params.id);
    if(video) {
        res.status(200).send(video);
    } else {
        res.status(404); // Надо ли вставлять send?
    }

});
// PUT
videoRouter.put('/videos/:id', (req:Request, res:Response) => {
    let video = videos.find(el => el.id === +req.params.id);
    if (video) {
        const apiErrorResult = {
            errorsMessages: {
                message: "",
                field: ""
            }
        }
        if (!(req.body.title.length < 41)) {
            apiErrorResult.errorsMessages.message = "Please type title with maximum length 40";
            apiErrorResult.errorsMessages.field = "title";
            res.status(400).send(apiErrorResult);
            return;
        } else if (!(req.body.author.length < 21)) {
            apiErrorResult.errorsMessages.message = "Please type author with maximum length 20";
            apiErrorResult.errorsMessages.field = "author";
            res.status(400).send(apiErrorResult);
            return;
        } else if (!(resolutions.includes(req.body.availableResolutions))) {
            apiErrorResult.errorsMessages.message = "Resolutions should be in (P144, P240, P360, P480, P720, P1080, P1440, P2160)";
            apiErrorResult.errorsMessages.field = "availableResolutions";
            res.status(400).send(apiErrorResult);
            return;
        } else if (!(typeof(req.body.canBeDownloaded) === "boolean")){
            apiErrorResult.errorsMessages.message = "A field 'canBeDownloaded' should be boolean value";
            apiErrorResult.errorsMessages.field = "canBeDownloaded";
            res.status(400).send(apiErrorResult);
            return;
        } else if (!(req.body.minAgeRestriction < 19 && req.body.minAgeRestriction > 0)) {
            apiErrorResult.errorsMessages.message = "Restriction age should be in [1, 18]";
            apiErrorResult.errorsMessages.field = "minAgeRestriction";
            res.status(400).send(apiErrorResult);
            return;
        } else if (!(req.body.publicationDate)) {
            apiErrorResult.errorsMessages.message = "Please type correct publication date";
            apiErrorResult.errorsMessages.field = "publicationDate";
            res.status(400).send(apiErrorResult);
            return;
        } else { // Можно ли применить деструктуризацию?
            video.title = req.body.title;
            video.author = req.body.author;
            video.availableResolutions = req.body.availableResolutions;
            video.canBeDownloaded = req.body.canBeDownloaded;
            video.minAgeRestriction = req.body.minAgeRestriction;
            video.publicationDate = req.body.publicationDate;
        }
    } else {
        res.status(404);
    }
});
// POST
videoRouter.post('/videos', (req:Request, res:Response) => {
    const apiErrorResult = {
        errorsMessages: {
            message: "",
            field: ""
        }
    }
    if (!(req.body.title.length < 41)) {
        apiErrorResult.errorsMessages.message = "Please type title with maximum length 40";
        apiErrorResult.errorsMessages.field = "title";
        res.status(400).send(apiErrorResult);
        return;
    } else if (!(req.body.author.length < 21)) {
        apiErrorResult.errorsMessages.message = "Please type author with maximum length 20";
        apiErrorResult.errorsMessages.field = "author";
        res.status(400).send(apiErrorResult);
        return;
    } else if (!(resolutions.includes(req.body.availableResolutions))) {
        apiErrorResult.errorsMessages.message = "Resolutions should be in (P144, P240, P360, P480, P720, P1080, P1440, P2160)";
        apiErrorResult.errorsMessages.field = "availableResolutions";
        res.status(400).send(apiErrorResult);
        return;
    } else {
        const newVideo: Video = {
            id: +new Date(),
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: false, // default value
            minAgeRestriction: null, // default value
            createdAt: new Date().toISOString(), // $date-time
            publicationDate: new Date().toISOString(), // $date-time, default value +1 from createdAt
            availableResolutions: req.body.availableResolutions
        }
        videos.push(newVideo);
        res.status(201).send(newVideo);
    }
})
// DELETE
videoRouter.delete('/videos/:id', (req:Request, res:Response) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.status(204);
            return;
        } else {
            res.status(404);
        }
    }
})
