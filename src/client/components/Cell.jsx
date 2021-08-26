import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    cell: {
        width: "calc( var(--coef) * (100vh - 160px) / var(--game-field-size) )",
        maxWidth: "calc( var(--coef) * (100vw - 340px) / var(--game-field-size) )",
        height: "calc( var(--coef) * (100vh - 160px) / var(--game-field-size) )",
        maxHeight: "calc( var(--coef) * (100vw - 340px) / var(--game-field-size) )",
        overflow: "hidden",
        boxSizing: "border-box",
        color: "#FFF",
        border: "none",
        outline: "none",
        textAlign: "center",
        padding: "5px",
        borderRadius: "2px",
        position: "relative",
        boxShadow: "2px 2px 0px inset rgb(255 255 255 / 50%), -2px -2px 0px inset rgb(0 0 0 / 50%)"
    },

    cellOk: {
        background: "#5b5b5b",
    },

    cellOffered: {
        background: "#319065",
    },

    cellPlaced: {
        background: "#642f4f",
    },

    cellEmpty: {
        background: "rgba(0, 0, 0, 0.1)",
        boxShadow: "none",
        cursor: "pointer"
    },

    symbol: {
        fontSize: "25px",
        fontWeight: 600,
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    price: {
        opacity: 0.8,
        fontSize: "12px",
        fontWeight: 600,
        position: "absolute",
        top: "3px",
        right: "3px"
    }
});

const FilledCell = (props) => {
    const classes = useStyles();

    function cellStateToClass(state) {
        if (state === "ok") return classes.cellOk;
        if (state === "placed") return classes.cellPlaced;
        if (state === "offered") return classes.cellOffered;
        throw new Error("Unknown cell state: " + state);
    }

    return <div
        className={cellStateToClass(props.state) + " " + classes.cell}
    >
        <span className={classes.symbol}>{props.symbol}</span>
        <span className={classes.price}>{props.price}</span>
    </div>
};

const EmptyCell = (props) => {
    const classes = useStyles();
    return <button className={classes.cell + " " + classes.cellEmpty} onClick={props.onClick}>
    </button>
}

export {FilledCell, EmptyCell};