"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const app = express_1.default();
app.use(body_parser_1.default.json());
app.post("/conv/init/user", (req, res) => {
    const mockUser = {
        data: {
            actionsFromWatson: req.body.data.actionsFromWatson,
            businessContext: {
                secretName: "ofir",
            },
            conversationID: req.body.data.conversationID,
            initiator: req.body.data.initiator,
            isFirst: req.body.data.isFirst,
            watsonContext: {
                name: "of",
            },
            watsonID: req.body.data.watsonID,
        },
        message: req.body.message,
        project: req.body.project,
        sessionID: req.body.sessionID,
        status: req.body.status,
        userID: req.body.userID,
    };
    res.status(200).json(mockUser);
});
app.get("/conv/init/bot/operation1", (req, res) => {
    const mockUsers = [
        {
            data: {
                actionsFromWatson: [],
                businessContext: {},
                conversationID: "",
                initiator: "bot",
                isFirst: true,
                watsonContext: {
                    name: "ofir",
                },
                watsonID: "",
            },
            message: "init",
            project: "mock",
            sessionID: "",
            status: "success",
            userID: "1234567",
        }, {
            data: {
                actionsFromWatson: [],
                businessContext: {},
                conversationID: "",
                initiator: "bot",
                isFirst: true,
                watsonContext: {
                    name: "adam",
                },
                watsonID: "",
            },
            message: "init",
            project: "mock",
            sessionID: "",
            status: "success",
            userID: "1234589",
        },
    ];
    res.status(200).json(mockUsers);
});
app.post("/perform/action1", (req, res) => {
    return res.status(200).send({ message: "success" });
});
app.listen(process.env.PORT || 3200, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});
