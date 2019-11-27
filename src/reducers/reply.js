const reply = (reply = [], action) => {
    // let copyreply;
    switch (action.type) {
        case "reply":
            // copyreply = reply.slice();
            // copyreply.push(action.payload)
            // reply = action.payload
            return [...action.payload];

        default:
            return reply;
    }
};

export default reply;
