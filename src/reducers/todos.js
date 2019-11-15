const todos = (todos = [], action) => {
    let copyList;

    switch (action.type) {
        case "Add":
            // console.log('me', action.payload)
            copyList = todos.slice();
            copyList.push(action.payload);
            return copyList;
        
        case "Read":
            // copyList = todos.slice();
            // console.log(action.payload);
            return action.payload;

        default:
            return todos;
    }
};

export default todos;
