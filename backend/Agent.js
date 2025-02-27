const User = require('./User')

class Agent {
    constructor(name, api, key, creator, stakers) {

        if (typeof api !== "string") {
            throw new Error ("api must be of type string")
        }

        if (!(creator instanceof User)) {
            throw new Error ("creator must be of type User")
        }

        if (!Array.isArray(stakers) || !stakers.every(user => user instanceof User)) {
            throw new Error("Invalid type: stakers must be an array of User instances");
        }

        this.name = name
        this.api = api
        this.key = key
        this.creator = creator
        this.stakers = stakers
    }

    addStaker(user) {
        if (!(user instanceof User)) {
            throw new Error("Invalid type: staker must be a User instance");
        }
        this.stakers.push(user);
    }
}

module.exports = Agent;

