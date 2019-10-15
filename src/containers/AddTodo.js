import React from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "../actions/todo";
import TextField from "@material-ui/core/TextField";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { getJwt } from "../components/helpers/jwt";
import swal from "sweetalert";

const CssTextField = withStyles({
    root: {
        "& label.Mui-focused": {
            color: "green"
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: "green"
        },
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "red"
            },
            "&:hover fieldset": {
                borderColor: "yellow"
            },
            "&.Mui-focused fieldset": {
                borderColor: "green"
            }
        }
    }
})(TextField);

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
        // flexWrap: 'wrap',
    },
    margin1: {
        margin: theme.spacing(1),
        width: "65%"
    },
    margin2: {
        margin: theme.spacing(1),
        width: "35%"
    }
}));

const AddTodo = props => {
    const classes = useStyles();
    const [item, setItem] = React.useState("");
    const [emailValue, setEmailValue] = React.useState("");
    // const [clickedCardIndex, setClickedCardIndex] = React.useState(null);

    const dispatch = useDispatch();

    const addNew = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (item.length > 0 && emailValue.length > 0) {
                axios
                    .post("http://localhost:4000/post", {
                        item: item,
                        done: false,
                        token: getJwt(),
                        assignedTo: emailValue,
                        clickedCardIndex: props.clickedCard
                    })
                    .then(fullUserData => {
                        // console.log('data uploaded!', fullUserData);
                        if (fullUserData.data.length === 0) {
                            swal(
                                "User Doesn't exist",
                                "Please let him Signup!",
                                "error"
                            );
                            return;
                        } else {
                            // console.log('it\'s still working! ');
                            // setState({
                            //     list: fullUserData.data
                            // });
                            // console.log(fullUserData);
                            dispatch(
                                addTodo(
                                    fullUserData.data[
                                        fullUserData.data.length - 1
                                    ]
                                )
                            );
                        }
                        // console.log('is state', state.list);
                    })
                    .catch(err => console.log("myErr", err));
            } else {
                // console.log('Kindly input some data');
                swal("Error", "Please input some data", "info");
            }


            setItem('');
            setEmailValue('');
            // console.log(input.value);
            // dispatch(action('Add', input.value))
        }
    };

    // ref={node => input=node}
    return (
        <div>
            <form className={classes.root} onSubmit={addNew}>
                <CssTextField
                    className={classes.margin1}
                    type="text"
                    id="outlined-full-width"
                    label="Add Todo"
                    style={{ margin: 8 }}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    onChange={e => setItem(e.target.value)}
                    value={item}
                    // fullWidth
                    onKeyPress={addNew}
                    autoFocus
                />
                <CssTextField
                    // autoFocus
                    type="email"
                    onChange={e => setEmailValue(e.target.value)}
                    className={classes.margin2}
                    label="Assign to"
                    value={emailValue}
                    onKeyPress={addNew}
                    variant="outlined"
                />
            </form>
        </div>
    );
};

export default AddTodo;
