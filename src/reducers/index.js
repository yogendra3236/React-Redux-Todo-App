import { combineReducers } from "redux";
import todos from "./todos";
import cards from "./cards";
import comment from './comment';
import reply from './reply';
import files from './files';

export default combineReducers({
    todos,
    cards,
    comment,
    reply,
    files,
});
