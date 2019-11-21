const files = (files = null, action) => {
    switch (action.type) {
        case "files":
            files = action.payload
            return files;

        default:
            return files;
    }
};

export default files;
