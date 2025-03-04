require('dotenv').config();
const axios = require("axios");

var ipfsHost = '';

function init() {
  ipfsHost = process.env.IPFS_HOST;
}

async function getIPfsTask(cid) {
  const { data } = await axios.get(ipfsHost + cid);
  return data.map(({ creator, prediction, score }) => ({
    creator,
    prediction,
    score: parseFloat(score),
  }));
}

module.exports = {
  init,
  getIPfsTask
}