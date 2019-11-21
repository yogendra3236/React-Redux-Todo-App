const comment = (comment = null, action) => {
    switch (action.type) {
        case "comment":
            comment = action.payload
            return comment;

        default:
            return comment;
    }
};

export default comment;
