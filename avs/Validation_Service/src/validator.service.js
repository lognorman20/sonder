require('dotenv').config();
const dalService = require("./dal.service");
const oracleService = require("./oracle.service");

async function validate(proofOfTask) {

  try {
    var isApproved = true;
    const taskResult = await dalService.getIPfsTask(proofOfTask);
    if (Object.keys(taskResult).length <= 0) {
      console.log("Scores is empty");
      isApproved = false;
    }

    const isDescending = taskResult.every((_, i, arr) => 
      i === 0 || arr[i - 1].score >= arr[i].score
    );

    if (isDescending == false) {
      isApproved = false;
    }

    return isApproved;
  } catch (err) {
    console.error(err?.message);
    return false;
  }
}

module.exports = {
  validate,
}