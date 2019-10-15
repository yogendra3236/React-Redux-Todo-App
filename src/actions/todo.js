export function addTodo(payload) {
    return {
        type: 'Add',
        payload
    }
}

export function read(payload) {
    return {
        type: 'Read',
        payload
    }
}
