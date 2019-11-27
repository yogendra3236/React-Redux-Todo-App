const comment = (comment = [], action) => {
    // let copyComment;
    switch (action.type) {
        case "comment":
            // copyComment = comment.slice();
            // copyComment.push(action.payload)
            // comment = action.payload
            return [...action.payload];

        default:
            return comment;
    }
};

export default comment;
