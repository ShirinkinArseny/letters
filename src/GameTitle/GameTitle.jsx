import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    title: {
        fontWeight: "600",
        color: "#222",
    }
})

const GameTitle = (props) => {
    const classes = useStyles();
    return <div className={classes.title}>
        {props.title}
    </div>
};

export default GameTitle;