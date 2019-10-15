import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuIcon from "@material-ui/icons/Menu";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { Redirect } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import Avatar from "@material-ui/core/Avatar";
import { useSelector } from "react-redux";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { reactLocalStorage } from "reactjs-localstorage";
import Tooltip from "@material-ui/core/Tooltip";
import {red } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    avatar: {
        backgroundColor: red[500]
    },
    title: {
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block"
        }
    },
    inputRoot: {
        color: "inherit"
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("md")]: {
            display: "flex"
        }
    },
    sectionMobile: {
        display: "flex",
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
    },
    list: {
        width: 200
    }
}));

export default function PrimarySearchAppBar(props) {
    const classes = useStyles();
    const [profile, setProfile] = React.useState(false);
    const selector = useSelector(state => state.todos);

    const [state, setState] = React.useState({
        left: false
    });

    let doneList = selector.filter(done => {
        return done.done === 1 || done.done === true;
    });

    const toggleDrawer = (side, open) => event => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    const drawerListClick = index => {
        if (index === 0) {
            setProfile(true);
        } else {
            // console.log('logged out');
            reactLocalStorage.remove("jwt");
            props.logout();
        }
    };

    const sideList = side => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                {["Profile", "Log Out"].map((text, index) => (
                    <ListItem
                        button
                        key={text}
                        onClick={() => drawerListClick(index)}
                    >
                        <ListItemIcon>
                            {index % 2 === 0 ? (
                                <AccountCircleIcon />
                            ) : (
                                <ExitToAppIcon />
                            )}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    let openprofile = () => {
        // console.log("openprofile function is called");
        setProfile(true);
    };

    if (profile) {
        return <Redirect push to="/profile" />;
    }
    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer("left", true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        TodoApp- Todos
                    </Typography>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <Tooltip title="Done">
                            <IconButton aria-label="done icon" color="inherit">
                                <Badge
                                    badgeContent={doneList.length}
                                    color="secondary"
                                >
                                    <CheckCircleOutlineIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Pending">
                            <IconButton
                                aria-label="pending icon"
                                color="inherit"
                            >
                                <Badge
                                    badgeContent={
                                        selector.length - doneList.length
                                    }
                                    color="secondary"
                                >
                                    <HighlightOffIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Profile">
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={openprofile}
                            >
                                <Avatar className={classes.avatar} >{props.avatar[0]}</Avatar>
                                {/* <AccountCircleIcon  /> */}
                            </IconButton>
                        </Tooltip>
                    </div>
                </Toolbar>
                <Drawer open={state.left} onClose={toggleDrawer("left", false)}>
                    {sideList("left")}
                </Drawer>
            </AppBar>
        </div>
    );
}
