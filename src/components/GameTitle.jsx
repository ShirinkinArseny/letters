import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    title: {
        fontWeight: "600",
        color: "#222",
        fontSize: "20px"
    }
})

const GameTitle = (props) => {
    const classes = useStyles();
    return <h1 className={classes.title}>
        {props.title}
    </h1>
};

export default GameTitle;