"use strict";
const { Router } = require("express")
const CustomError = require("./utils/validateError");
const CustomResponse = require("./utils/validateResponse");
const oracleService = require("./oracle.service");
const dalService = require("./dal.service");

/// Type definitions
/**
 * @typedef {Object} Scores
 * @property {string} creator - The agent creator's address or ID
 * @property {number} score - The score of the prediction
 */

/**
 * @typedef {Object} Prediction
 * @property {string} creator - The agent creator's address or ID
 * @property {number} score - The score of the prediction
 */

/**
 * @typedef {Object} Predictions
 * @property {Prediction[]} predictions - An array of Prediction objects
 * @property {string} actual - The actual value to compare against
 */

///

const router = Router()


router.post("/execute", async (req /** @type {Predictions} */, res) => {
    console.log("Executing task");

    try {
        var taskDefinitionId = Number(req.body.taskDefinitionId) || 0;
        console.log(`taskDefinitionId: ${taskDefinitionId}`);

        // parse out the predictions
        /** @type {Prediction[]} */
        const predictions = req.body.predictions;
        const actual = req.body.actual;

        // score predictions
        /** @type {Scores[]} */
        const scores = [];
        for (const pred of predictions) {
            const text = pred.text;
            const score = await oracleService.score(text, actual);
            scores.push({ score: score, creator: pred.agent_creator });
        }

        // rank agents
        scores.sort((a, b) => b.score - a.score);

        // send rankings to smart contract

        // send rankings to api

        // post predictions to eigenda
        // const [cid, poll] = await dalService.publishToEigenDA(result);
        // const blob = await poll;
        // console.log(`blob data: ${blob}`);
        // await dalService.sendTask(cid, data, taskDefinitionId);

        // normal flow (remove iff eigenda being used)
        const cid = await dalService.publishJSONToIpfs(scores);
        // const data = "hello";
        await dalService.sendTask(cid, scores.join(" "), taskDefinitionId);
        return res.status(200).send(new CustomResponse({proofOfTask: cid, data: scores, taskDefinitionId: taskDefinitionId}, "Task executed successfully"));
    } catch (error) {
        console.log(error)
        return res.status(500).send(new CustomError("Something went wrong", {}));
    }
})


module.exports = router
