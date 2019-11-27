const files = (files = [], action) => {
    // let copyFiles;
    switch (action.type) {
        case "files":
            // copyFiles = files.slice();
            // copyFiles.push(action.payload)
            // files = action.payload
            return [...action.payload];

        default:
            return files;
    }
};

export default files;
