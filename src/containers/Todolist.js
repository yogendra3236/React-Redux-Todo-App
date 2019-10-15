import React from "react";
import { connect } from "react-redux";
import { read } from "../actions/todo";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { getJwt } from "../components/helpers/jwt";
import { reactLocalStorage } from "reactjs-localstorage";
import swal from "sweetalert";
import { Card, Avatar, Tooltip } from "@material-ui/core";
import _ from "underscore";
import { Redirect } from "react-router-dom";

class Todolist extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            login: false,
            redirectToProject: false,
            edit: false,
            updateId: null,
            editItem: "",
            checked: false
        };
    }

    componentDidMount() {
        // console.log(this.props);
        if (!getJwt()) {
            // console.log("expired");
            this.setState({
                login: true
            });
            reactLocalStorage.remove("jwt", "");
            return;
        }

        let cardId = this.props.clickedCard;
        // console.log("ben 10", cardId);

        this.setState({
            clickedCardIndex: cardId
        });

        axios
            .get("http://localhost:4000/get", {
                params: { token: getJwt(), clickedCardIndex: cardId }
            })
            .then(result => {
                // console.log("result", result);

                if (result.data === "token is not valid") {
                    reactLocalStorage.remove("jwt");
                    this.setState({
                        login: true
                    });
                    return;
                }

                if (result.data === "Invalid Card") {
                    swal("Wrong Project Id");
                    this.setState({
                        redirectToProject: true
                    });
                    return;
                }
                let data = result.data.data;
                this.props.read(data);
            })
            .catch(err => console.log(err));
    }

    editTodoInput = index => {
        this.setState({
            edit: true,
            updateId: index
        });
    };

    delete = itemId => {
        axios
            .delete("http://localhost:4000/delete/" + itemId, {
                data: {
                    token: getJwt(),
                    clickedCardIndex: this.state.clickedCardIndex
                }
            })
            .then(response => {
                this.props.read(response.data);
                // console.log(response.data);
            })
            .catch(err => console.log(err));
    };

    editSubmit = e => {
        // console.log(e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            let { updateId, clickedCardIndex } = this.state;
            // console.log(this.state);
            if (this.state.editItem.length !== 0) {
                if (updateId !== null) {
                    axios
                        .put("http://localhost:4000/update/" + updateId, {
                            editItem: this.state.editItem,
                            token: getJwt(),
                            clickedCardIndex: clickedCardIndex
                        })
                        .then(response => {
                            // console.log('updated!');
                            // console.log('response', response);
                            this.setState({
                                // list: response.data,
                                updateId: null
                            });
                            this.props.read(response.data);
                        })
                        .catch(err => console.log(err));
                }
            } else this.setState({ updateId: null });
        }
    };

    checkboxHandler = e => {
        // console.log('this method is working now!',e.target);
        // this.setState({checked: e.target.checked});
        var { list } = this.props;
        var { id, checked } = e.target;
        var { clickedCardIndex } = this.state;

        // console.log(id, checked);
        var obj = _.findWhere(list, { id: parseInt(id) });
        // console.log(obj);
        obj.done = checked; // to set checked if uncheck and vice-versa

        axios
            .put("http://localhost:4000/checkbox", {
                done: obj.done,
                id: id,
                token: getJwt(),
                clickedCardIndex: clickedCardIndex
            })
            .then(response => {
                // console.log(response.data);

                this.props.read(response.data);
            })
            .catch(err => console.log("error updating value", err));
    };

    render() {
        // let list = useSelector(state => state);
        // let dispatch = useDispatch();
        let list = this.props.list;
        // console.log(list);

        if (this.state.login) {
            return <Redirect to="/login" />;
        }
        if (this.state.redirectToProject) {
            return <Redirect to="/project" />;
        }

        return (
            <React.Fragment>
                <List>
                    {list.map(value => {
                        const labelId = String(value.id);

                        // to give the boolean value to checkbox
                        let tick = value.done ? true : false;
                        // console.log(tick);

                        if (
                            this.state.edit &&
                            this.state.updateId === value.id
                        ) {
                            return (
                                <Card
                                    key={value.id}
                                    style={{ margin: 16, padding: 10 }}
                                >
                                    <ListItem
                                        style={{
                                            backgroundColor: "black",
                                            color: "white"
                                        }}
                                    >
                                        <Avatar
                                            alt="Remy Sharp"
                                            src="https://www.searchpng.com/wp-content/uploads/2019/02/Profile-ICon.png"
                                        />
                                        <Tooltip title={value.assignedBy}>
                                            <ListItemText>
                                                Assigned By:{" "}
                                                {value.assignedByName}
                                            </ListItemText>
                                        </Tooltip>
                                        <Avatar
                                            alt="Remy Sharp"
                                            src="https://www.searchpng.com/wp-content/uploads/2019/02/Profile-ICon.png"
                                        />

                                        <Tooltip title={value.assignedTo}>
                                            <ListItemText>
                                                Assigned To:{" "}
                                                {value.assignedToName}
                                            </ListItemText>
                                        </Tooltip>
                                    </ListItem>
                                    <ListItem
                                        key={value.id}
                                        style={{
                                            backgroundColor: "skyBlue",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Checkbox
                                                onChange={this.checkboxHandler}
                                                id={labelId}
                                                checked={tick}
                                            />
                                        </ListItemIcon>
                                        <form
                                            onSubmit={this.editSubmit}
                                            noValidate
                                        >
                                            <TextField
                                                type="text"
                                                label="Edit Todo"
                                                onChange={e =>
                                                    this.setState({
                                                        editItem: e.target.value
                                                    })
                                                }
                                                onKeyPress={this.editSubmit}
                                                id="update"
                                                defaultValue={value.item}
                                                fullWidth
                                            />
                                        </form>
                                    </ListItem>
                                </Card>
                            );
                        } else {
                            return (
                                <Card
                                    key={value.id}
                                    style={{ margin: 16, padding: 10 }}
                                >
                                    <ListItem
                                        style={{
                                            backgroundColor: "black",
                                            color: "white"
                                        }}
                                    >
                                        <Avatar
                                            alt="Remy Sharp"
                                            src="https://www.searchpng.com/wp-content/uploads/2019/02/Profile-ICon.png"
                                        />
                                        <Tooltip title={value.assignedBy}>
                                            <ListItemText>
                                                By: {value.assignedByName}
                                            </ListItemText>
                                        </Tooltip>
                                        <Avatar
                                            alt="Remy Sharp"
                                            src="https://www.searchpng.com/wp-content/uploads/2019/02/Profile-ICon.png"
                                        />
                                        <Tooltip title={value.assignedTo}>
                                            <ListItemText>
                                                To: {value.assignedToName}
                                            </ListItemText>
                                        </Tooltip>
                                    </ListItem>
                                    <ListItem
                                        key={value.id}
                                        dense
                                        button
                                        onDoubleClick={() =>
                                            this.editTodoInput(value.id)
                                        }
                                        style={{
                                            backgroundColor: "skyBlue",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Checkbox
                                                onChange={this.checkboxHandler}
                                                id={labelId}
                                                checked={tick}
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary={value.item} />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() =>
                                                    this.delete(value.id)
                                                }
                                                id="delete"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </Card>
                            );
                        }
                    })}
                </List>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        list: state.todos
    };
};

const mapDispatchToProps = () => {
    return {
        read
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps()
)(Todolist);
