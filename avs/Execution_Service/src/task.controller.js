"use strict";
const { Router } = require("express")
const CustomError = require("./utils/validateError");
const CustomResponse = require("./utils/validateResponse");
const oracleService = require("./oracle.service");
const dalService = require("./dal.service");

const router = Router()

router.post("/execute", async (req, res) => {
    console.log("Executing task");

    try {
        var taskDefinitionId = Number(req.body.taskDefinitionId) || 0;
        console.log(`taskDefinitionId: ${taskDefinitionId}`);

        // parse out the predictions
        const predictions = req.body.predictions;
        const actual = req.body.actual;

        // score predictions
        const scores = [];
        for (const pred of predictions) {
            console.log("pred:\n" + pred);
            const text = pred.text;
            const score = await oracleService.score(text, actual);
            scores.push({ score: score, creator: pred.agent_creator });
        }

        // rank agents

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
