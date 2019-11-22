import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { Link as RouterLink, Redirect } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { GoogleLogin } from "react-google-login";
import { reactLocalStorage } from "reactjs-localstorage";
import { getJwt } from './helpers/jwt';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://material-ui.com/">
                Buddies Enterprises
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

export default class SignUp extends React.Component {
    //   const classes = useStyles();
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            signup: false,
            googleSignUp: false
        };
    }

    firstName = e => {
        //   console.log(e.target.value);
        this.setState({
            firstName: e.target.value
        });
    };

    lastName = e => {
        this.setState({
            lastName: e.target.value
        });
    };

    email = e => {
        this.setState({
            email: e.target.value
        });
    };

    password = e => {
        this.setState({
            password: e.target.value
        });
    };

    submitData = e => {
        e.preventDefault();
        let { firstName, lastName, email, password } = this.state;
        // console.log(firstName, lastName, email, password);
        let data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        };

        axios
            .post("http://localhost:4000/signup", data)
            .then(myData => {
                // console.log(myData);
                // console.log(data.data.length);
                // console.log(myData.data.constructor === Array);
                if (myData.data === "SequelizeUniqueConstraintError") {
                    swal(
                        "Signup Error",
                        "This email has already been used. Please Sign In",
                        "error"
                    );
                } else {
                    this.setState({
                        signup: true
                    });
                    swal("Signup Success", "Cool. Please Sign In", "success");
                }
            })
            .catch(err => console.log(err));
    };

    responseGoogle = response => {
        // console.log(response);
        // axios
        //     .post("http://localhost:4000/googleSignUp", response.profileObj)
        //     .then(myData => {
        //         console.log(myData);
        //         // console.log(data.data.length);
        //         // console.log(myData.data.constructor === Array);
        //         if (myData.data.token !== null || myData.data.token !== undefined) {
        //             reactLocalStorage.set("jwt", myData.data.token);
        //             this.setState({
        //                 googleSignUp: true
        //             });
        //             // swal("Signup Success", "Cool. Please Sign In", "success");
        //         }
        //     })
        //     .catch(err => console.log(err));
        axios
            .post("http://localhost:4000/googleSignUp", {
                tokenObj: response.tokenObj,
                imgUrl: response.profileObj.imageUrl
            })
            .then(config => {
                // console.log('config', config.data);
                if (config.data === 'SequelizeUniqueConstraintError') {
                    swal(
                        "Login Error",
                        "Please enter a valid Email/Password or Sign up!",
                        "error"
                    );
                } else {
                    // console.log(config.data)
                    reactLocalStorage.set("jwt", config.data.token);
                    this.setState({
                        googleSignUp: true
                    });
                }
            })
            .catch(err => console.log(err));
    };

    render() {
        if (this.state.signup) {
            return <Redirect to="/login" />;
        }
        if (this.state.googleSignUp) {
            return <Redirect to="/project" />;
        }
        if (getJwt()) {
            return <Redirect to="/project" />;
        }
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div
                    style={{
                        marginTop: "30px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Avatar style={{ margin: "0px", backgroundColor: "red" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography
                        component="h1"
                        variant="h5"
                        style={{ paddingBottom: "20px" }}
                    >
                        Sign up
                    </Typography>
                    <form onSubmit={this.submitData}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    onChange={this.firstName}
                                    // autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lname"
                                    onChange={this.lastName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={this.email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={this.password}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            value="allowExtraEmails"
                                            color="primary"
                                        />
                                    }
                                    label="I agree all the terms and conditions"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            // className={classes.submit}
                        >
                            Sign Up
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <RouterLink to="/login" color="inherit">
                                    Already have an account? Sign in
                                </RouterLink>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <GoogleLogin
                    clientId="536299356769-6revlp8ocmd1ffr53gm5knf1icsknh37.apps.googleusercontent.com"
                    buttonText="Signup With Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                />
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        );
    }
}
