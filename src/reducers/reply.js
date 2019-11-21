const reply = (reply = null, action) => {
    switch (action.type) {
        case "reply":
            reply = action.payload
            return reply;

        default:
            return reply;
    }
};

export default reply;
