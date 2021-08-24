import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    cell: {
        width: "30px",
        height: "30px",
        boxSizing: "border-box",
        color: "#FFF",
        border: "none",
        outline: "none",
        textAlign: "center",
        padding: "5px"
    },

    cellOk: {
        background: "#333",
    },

    cellOffered: {
        background: "#319065",
    },

    cellPlaced: {
        background: "#614",
    },

    cellEmpty: {
        background: "#a4a4a4",
    },

    author: {
        display: "none"
    },

    symbol: {
        fontSize: "20px",
    },

    price: {
        fontSize: "10px",
        float: "right"
    }
});

const FilledCell = (props) => {
    const classes = useStyles();
    const classname =
        props.state === "ok"
            ? classes.cellOk
            : props.state === "placed"
                ? classes.cellPlaced
                : classes.cellOffered;
    return <div
        className={classname + " " + classes.cell}
    >
        <span className={classes.author}>
            {props.author}
        </span>
        <span className={classes.symbol}>
            {props.symbol}
        </span>
        <super className={classes.price}>
            {props.price}
        </super>
    </div>
};

const EmptyCell = (props) => {
    const classes = useStyles();
    return <button className={classes.cell + " " + classes.cellEmpty} onClick={props.onClick}>
    </button>
}

export {FilledCell, EmptyCell};