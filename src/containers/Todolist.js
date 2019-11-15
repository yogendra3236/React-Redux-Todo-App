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
import {
    Card,
    CardHeader,
    Avatar,
    Tooltip,
    DialogActions,
    CardContent
} from "@material-ui/core";
import _ from "underscore";
import { Redirect } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from "@material-ui/core/Fab";
import { DropzoneArea } from "material-ui-dropzone";
import Button from "@material-ui/core/Button";
import FormData from "form-data";
import {
    Button as SemanticButton,
    Comment,
    Header,
    Form
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import GetAppIcon from "@material-ui/icons/GetApp";
import Link from '@material-ui/core/Link';


class Todolist extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            login: false,
            redirectToProject: false,
            edit: false,
            updateId: null,
            editItem: "",
            checked: false,
            notes: false,
            noteId: null,
            onChangeNote: "",
            editNoteStatus: false,
            attachmentStatus: false,
            files: [],
            userFiles: [],
            onChangeComment: "",
            onChangeReply: "",
            commentData: [],
            parentCommentId: null,
            replyData: []
        };
    }

    componentDidUpdate() {
        if (!getJwt()) {
            // console.log("expired");
            this.setState({
                login: true
            });
            reactLocalStorage.remove("jwt", "");
            return;
        }
        axios
            .get("http://localhost:4000/get", {
                params: {
                    token: getJwt(),
                    clickedCardIndex: this.props.clickedCard
                }
            })
            .then(result => {
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
            });
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

        let getTodosData = axios.get("http://localhost:4000/get", {
            params: { token: getJwt(), clickedCardIndex: cardId }
        });

        let getUserFiles = axios.get("http://localhost:4000/allfiles", {
            params: { token: getJwt() }
        });

        let commentData = axios.get("http://localhost:4000/allcomments", {
            params: { token: getJwt() }
        });

        let replyData = axios.get("http://localhost:4000/allreplies", {
            params: { token: getJwt() }
        });

        Promise.all([getTodosData, getUserFiles, commentData, replyData])
            .then(result => {
                // console.log("result", result[0]);
                let result1 = result[0];
                let userFiles = result[1].data.userFiles;
                let commentData = result[2].data;
                let replyData = result[3].data;
                console.log(replyData);
                // console.log(userFiles);

                if (result1.data === "token is not valid") {
                    reactLocalStorage.remove("jwt");
                    this.setState({
                        login: true
                    });
                    return;
                }

                if (result1.data === "Invalid Card") {
                    swal("Wrong Project Id");
                    this.setState({
                        redirectToProject: true
                    });
                    return;
                }
                let data = result1.data.data;
                this.props.read(data);

                this.setState({
                    userFiles: userFiles,
                    commentData: commentData,
                    replyData: replyData
                });
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

    notesOpen = noteId => {
        this.setState({
            notes: true,
            noteId: noteId
        });
    };

    notesClose = () => {
        this.setState({
            notes: false,
            editNoteStatus: false,
            parentCommentId: null
        });
    };

    noteSubmit = e => {
        e.preventDefault();

        let { noteId, onChangeNote, clickedCardIndex } = this.state;
        axios
            .post("http://localhost:4000/notes", {
                token: getJwt(),
                noteId: noteId,
                note: onChangeNote,
                clickedCardIndex: clickedCardIndex
            })
            .then(response => {
                console.log(response);
                if (response.data === "token is not valid") {
                    this.setState({
                        login: true
                    });
                    return;
                }
                this.props.read(response.data);
            })
            .catch(err => console.log(err));

        this.setState({
            editNoteStatus: false
        });
    };

    fileUpload(files) {
        this.setState({
            files: files
        });
    }

    fileSubmit = () => {
        let { noteId, files } = this.state;
        let formdata = new FormData();
        // console.log(files[0]);
        // data.append('file', data)
        for (var i = 0; i < files.length; i++) {
            console.log(files[i]);
            formdata.append("files", files[i], files[i].name);
        }

        formdata.append("token", getJwt());
        formdata.append("todoId", noteId);

        // console.log(...formdata);
        axios
            .post("http://localhost:4000/files", formdata)
            .then(response => {
                console.log(response.data.userFiles);
                this.setState({
                    userFiles: response.data.userFiles
                });
            })
            .catch(err => console.log(err));

        this.setState({
            notes: false
        });
        swal("Perfect!", "Attachment Added!", "success");
    };

    trial = () => {
        let { noteId, userFiles, commentData, replyData } = this.state;
        let { list } = this.props;
        // console.log(this.state.userFiles);
        // console.log(list);
        // console.log(noteId);
        var dic = _.findWhere(list, { id: noteId });
        let eachUserFiles = userFiles.filter(
            each => each.todoId === String(noteId)
        );

        let eachTodoComment = commentData.filter(
            each => each.todoId === String(noteId)
        );

        // console.log(userFiles);
        // console.log(eachUserFiles);

        if (dic !== undefined) {
            if (this.state.editNoteStatus) {
                return (
                    <form onSubmit={this.noteSubmit}>
                        <TextField
                            id="outlined-text-input"
                            label="Description"
                            fullWidth
                            onChange={e =>
                                this.setState({
                                    onChangeNote: e.target.value
                                })
                            }
                            defaultValue={dic.note}
                            type="text"
                            name="text"
                            autoComplete="text"
                            margin="normal"
                            variant="outlined"
                        />
                    </form>
                );
            }

            return (
                <div>
                    <DialogContentText id="alert-dialog-description">
                        {/* Let Google help apps determine location. This means sending
                        anonymous location data to Google, even when no apps are
                        running. */}
                        {dic.note || "You don't have any description"}
                    </DialogContentText>
                    <DialogActions>
                        <Fab
                            color="secondary"
                            aria-label="edit"
                            // className={classes.fab}
                            onClick={() => {
                                this.setState({
                                    editNoteStatus: true
                                });
                            }}
                            style={{ position: "relative", top: "-50px" }}
                        >
                            <EditIcon />
                        </Fab>
                    </DialogActions>
                    <DropzoneArea
                        onChange={this.fileUpload.bind(this)}
                        name="files"
                    />
                    <Card>
                        <CardHeader title="All Media" />
                        <CardContent>
                            {eachUserFiles.map((each, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <ol>{each.fileName}</ol>
                                    <Link href={each.fileLink} > <GetAppIcon /></Link>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "15px" }}
                        onClick={this.fileSubmit}
                    >
                        Upload
                    </Button>
                    <Card style={{ marginTop: "20px" }}>
                        {/* <CardHeader title="All Comments" /> */}
                        <CardContent>
                            <Comment.Group threaded>
                                <Header as="h3" dividing>
                                    Comments
                                </Header>
                                {eachTodoComment.map((comment, index) => {
                                    let commentId = comment.commentId;
                                    if (
                                        comment.commentId ===
                                        this.state.parentCommentId
                                    ) {
                                        return (
                                            <Comment key={index}>
                                                <Comment.Avatar
                                                    as="a"
                                                    src="https://react.semantic-ui.com/images/avatar/small/matt.jpg"
                                                />
                                                <Comment.Content>
                                                    <Comment.Author as="a">
                                                        {comment.firstName}
                                                    </Comment.Author>
                                                    <Comment.Metadata>
                                                        <span>
                                                            {comment.time}
                                                        </span>
                                                    </Comment.Metadata>
                                                    <Comment.Text>
                                                        {comment.comment}
                                                    </Comment.Text>
                                                    <Comment.Group>
                                                        {replyData
                                                            .filter(replyf => {
                                                                return (
                                                                    replyf.commentId ===
                                                                    String(
                                                                        commentId
                                                                    )
                                                                );
                                                            })
                                                            .map((reply, index) => {
                                                                return (
                                                                    <Comment key={index}>
                                                                        <Comment.Avatar
                                                                            as="a"
                                                                            src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg"
                                                                        />
                                                                        <Comment.Content>
                                                                            <Comment.Author as="a">
                                                                                {
                                                                                    reply.firstName
                                                                                }
                                                                            </Comment.Author>
                                                                            <Comment.Metadata>
                                                                                <span>
                                                                                    {
                                                                                        reply.time
                                                                                    }
                                                                                </span>
                                                                            </Comment.Metadata>
                                                                            <Comment.Text>
                                                                                {
                                                                                    reply.reply
                                                                                }
                                                                            </Comment.Text>
                                                                        </Comment.Content>
                                                                    </Comment>
                                                                );
                                                            })}
                                                    </Comment.Group>
                                                    <Form
                                                        reply
                                                        onSubmit={this.addreply}
                                                    >
                                                        <Form.Input
                                                            onChange={e =>
                                                                this.setState({
                                                                    onChangeReply:
                                                                        e.target
                                                                            .value
                                                                })
                                                            }
                                                            label="Add Reply"
                                                            value={
                                                                this.state
                                                                    .onChangeReply
                                                            }
                                                        />
                                                    </Form>
                                                </Comment.Content>
                                            </Comment>
                                        );
                                    }
                                    return (
                                        <Comment key={index}>
                                            <Comment.Avatar
                                                as="a"
                                                src="https://react.semantic-ui.com/images/avatar/small/matt.jpg"
                                            />
                                            <Comment.Content>
                                                <Comment.Author as="a">
                                                    {comment.firstName}
                                                </Comment.Author>
                                                <Comment.Metadata>
                                                    <span>{comment.time}</span>
                                                </Comment.Metadata>
                                                <Comment.Text>
                                                    {comment.comment}
                                                </Comment.Text>

                                                <Comment.Group>
                                                    {replyData
                                                        .filter(replyf => {
                                                            return (
                                                                replyf.commentId ===
                                                                String(
                                                                    commentId
                                                                )
                                                            );
                                                        })
                                                        .map((reply, index) => {
                                                            return (
                                                                <Comment key={index}>
                                                                    <Comment.Avatar
                                                                        as="a"
                                                                        src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg"
                                                                    />
                                                                    <Comment.Content>
                                                                        <Comment.Author as="a">
                                                                            {
                                                                                reply.firstName
                                                                            }
                                                                        </Comment.Author>
                                                                        <Comment.Metadata>
                                                                            <span>
                                                                                {
                                                                                    reply.time
                                                                                }
                                                                            </span>
                                                                        </Comment.Metadata>
                                                                        <Comment.Text>
                                                                            {
                                                                                reply.reply
                                                                            }
                                                                        </Comment.Text>
                                                                    </Comment.Content>
                                                                </Comment>
                                                            );
                                                        })}
                                                </Comment.Group>

                                                <Comment.Actions>
                                                    <SemanticButton
                                                        onClick={() =>
                                                            this.setState({
                                                                parentCommentId: commentId
                                                            })
                                                        }
                                                    >
                                                        Reply
                                                    </SemanticButton>
                                                </Comment.Actions>
                                            </Comment.Content>
                                        </Comment>
                                    );
                                })}
                            </Comment.Group>

                            <form onSubmit={this.commentSubmit}>
                                <TextField
                                    id="outlined-text-input"
                                    label="Add Comment"
                                    fullWidth
                                    onChange={e =>
                                        this.setState({
                                            onChangeComment: e.target.value
                                        })
                                    }
                                    value={this.state.onChangeComment}
                                    type="text"
                                    name="text"
                                    autoComplete="text"
                                    margin="normal"
                                    variant="outlined"
                                />
                            </form>
                        </CardContent>
                    </Card>
                </div>
            );
        }
    };

    addreply = e => {
        e.preventDefault();
        let { parentCommentId, noteId, onChangeReply } = this.state;
        axios
            .post("http://localhost:4000/addreply", {
                token: getJwt(),
                parentCommentId: parentCommentId,
                todoId: noteId,
                reply: onChangeReply,
                time: new Date().toLocaleString()
            })
            .then(response => {
                let replyData = response.data;
                this.setState({
                    replyData: replyData,
                    onChangeReply: "",
                    parentCommentId: null
                });
            })
            .catch(err => console.log(err));
    };

    commentSubmit = e => {
        e.preventDefault();
        let { noteId, onChangeComment } = this.state;
        axios
            .post("http://localhost:4000/postcomment", {
                token: getJwt(),
                todoId: noteId,
                comment: onChangeComment,
                time: new Date().toLocaleString()
            })
            .then(response => {
                let commentData = response.data;
                this.setState({
                    commentData: commentData,
                    onChangeComment: ""
                });
            })
            .catch(err => console.log(err));
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
                                        onClick={() => this.notesOpen(value.id)}
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
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() =>
                                                        this.editTodoInput(
                                                            value.id
                                                        )
                                                    }
                                                    style={{
                                                        marginRight: "0px"
                                                    }}
                                                    id="edit"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() =>
                                                        this.delete(value.id)
                                                    }
                                                    id="delete"
                                                    color="primary"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </Card>
                            );
                        }
                    })}
                </List>

                <Dialog
                    fullWidth
                    // maxWidth={"md"}
                    open={this.state.notes}
                    onClose={this.notesClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        <DialogTitle id="form-dialog-title">
                            Your Description
                        </DialogTitle>
                        {this.trial()}
                    </DialogContent>
                </Dialog>
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

export default connect(mapStateToProps, mapDispatchToProps())(Todolist);
