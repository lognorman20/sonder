require('dotenv').config();
const dalService = require("./dal.service");
const oracleService = require("./oracle.service");

async function validate(proofOfTask) {

  try {
    const taskResult = await dalService.getIPfsTask(proofOfTask);
    if (Object.keys(taskResult).length > 0) {
      console.log("Scores is not empty");
    } else {
      console.log("Scores is empty");
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