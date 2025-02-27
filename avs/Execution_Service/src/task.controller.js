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

        const result = await oracleService.getPrice("BTCUSDT");
        result.price = result.price ? result.price : req.body.fakePrice;
        const cid = await dalService.publishJSONToIpfs(result);
        // const [cid, poll] = await dalService.publishToEigenDA(result);
        const data = result.price;
        await dalService.sendTask(cid, data, taskDefinitionId);
        return res.status(200).send(new CustomResponse({proofOfTask: cid, data: data, taskDefinitionId: taskDefinitionId}, "Task executed successfully"));
        // const blob = await poll;
        // console.log(`blob data: ${blob}`);
        // await dalService.sendTask(cid, data, taskDefinitionId);
    } catch (error) {
        console.log(error)
        return res.status(500).send(new CustomError("Something went wrong", {}));
    }
})


module.exports = router
