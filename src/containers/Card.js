import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";
import Axios from "axios";
import { getJwt } from "../components/helpers/jwt";
import { Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { reactLocalStorage } from "reactjs-localstorage";
import CardStats from "./CardStats";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import { red } from "@material-ui/core/colors";
import swal from "sweetalert";
import { connect } from "react-redux";
import { card } from "../actions/card";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            setOpen: false,
            nameProject: "",
            redirectToTodos: false,
            clickedCardIndex: null,
            redirectToLogin: false,
            loggedInUser: ""
        };
    }

    UNSAFE_componentWillMount() {
        // console.log(getJwt())
        Axios.get("http://localhost:4000/allCards", {
            params: { token: getJwt() }
        })
            .then(cardData => {
                if (cardData.data === "token is not valid") {
                    reactLocalStorage.remove("jwt");
                    this.setState({
                        redirectToLogin: true
                    });
                    return;
                }

                // console.log(cardData);
                this.setState({
                    loggedInUser: cardData.data.loggedInUser
                });
                this.props.card(cardData.data.myArray);
            })
            .catch(err => console.log(err));
    }

    dialog = () => {
        // console.log('clicked!');
        this.setState({
            setOpen: true
        });
    };

    handleClose = () => {
        this.setState({
            setOpen: false
        });
    };

    addnewPro = () => {
        if (this.state.nameProject.length === 0) {
            return swal("Please Enter the name of the Project!");
        }
        this.setState({
            setOpen: false
        });
        Axios.post("http://localhost:4000/cards", {
            token: getJwt(),
            cardName: this.state.nameProject
        })
            .then(cardData => {
                if (cardData.data === "token is not valid") {
                    reactLocalStorage.remove("jwt");
                    this.setState({
                        redirectToLogin: true
                    });
                    return;
                }
                // console.log('card', cardData);
                this.setState({
                    loggedInUser: cardData.data[0].createdBy
                });

                this.props.card(cardData.data);
            })
            .catch(err => console.log(err));
    };

    cardTodos = index => {
        // console.log(index);

        this.setState({
            clickedCardIndex: index,
            redirectToTodos: true
        });
    };

    logout = () => {
        this.setState({
            redirectToLogin: true
        });
    };

    render() {
        // console.log(this.state.allCards);

        if (this.state.redirectToTodos) {
            return (
                <Redirect
                    push
                    to={{
                        pathname: `/todo/${this.state.clickedCardIndex}`
                    }}
                />
            );
        }

        if (this.state.redirectToLogin) {
            return <Redirect to="/login" />;
        }

        if (this.props.cards !== null) {
            var allCards = this.props.cards.map(value => {
                // console.log(value);
                return (
                    <Card
                        style={{
                            width: "280px",
                            marginBottom: "20px",
                            height: "27vh"
                        }}
                        key={value.cardId}
                        onClick={() => this.cardTodos(value.cardId)}
                    >
                        <CardHeader
                            avatar={
                                <Avatar
                                    aria-label="recipe"
                                    style={{ backgroundColor: red[500] }}
                                >
                                    {value.createdBy[0]}
                                </Avatar>
                            }
                            title={`Created By-${value.createdBy} (${value.creatorEmail})`}
                            subheader={value.created_at}
                        />
                        <CardMedia
                            // className={classes.media}
                            style={{
                                height: 0,
                                paddingTop: "20px"
                            }}
                            image="/static/images/cards/paella.jpg"
                            title={value.cardName}
                        />
                        <CardContent>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                            >
                                Project Name - {value.cardName}
                            </Typography>
                        </CardContent>
                    </Card>
                );
            });
        }
        // console.log(this.state.allCards.length);
        return (
            <div style={{ background: "skyBlue", height: "100vh" }}>
                <CardStats
                    logout={this.logout}
                    total={this.state.countTotalCards}
                    loggedInUser={this.state.loggedInUser}
                />
                <div
                    style={{
                        padding: "24px",
                        borderRadius: "4px",
                        display: "flex",
                        flexDirection: "column",
                        width: "500",
                        flexWrap: "wrap",
                        background: "skyBlue"
                    }}
                >
                    {allCards}
                </div>

                <Tooltip title="Add Project" aria-label="add">
                    <Fab
                        color="secondary"
                        style={{
                            position: "fixed",
                            bottom: "70px",
                            right: "20px"
                        }}
                        onClick={this.dialog}
                    >
                        <AddIcon />
                    </Fab>
                </Tooltip>

                <Dialog
                    open={this.state.setOpen}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        Add your Project Name
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Project"
                            type="inherit"
                            onChange={e =>
                                this.setState({ nameProject: e.target.value })
                            }
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.addnewPro} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        cards: state.cards
    };
};

const mapDispatchToProps = () => {
    return {
        card
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps()
)(App);
