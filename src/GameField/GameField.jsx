import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {FilledCell, EmptyCell} from "../Cell/Cell";

const useStyles = makeStyles({

    field: {
        display: "grid",
        gap: "4px",
        gridTemplateColumns: "repeat(var(--game-field-size), max-content)",
        gridTemplateRows: "repeat(var(--game-field-size), max-content)",
    },


});

const GameField = (props) => {

    const classes = useStyles();

    const size = Math.round(Math.sqrt(props.letters.length));

    const itemPlacer = (index) => {
        return () => {
            if (props.placeItem) {
                props.placeItem(index);
            }
        };
    }

    const lettersComponents = props.letters.map((letter, index) => {
        return letter
            ? <FilledCell
                key={letter?.symbol + "__" + index}
                {...letter}
            />
            : <EmptyCell
                key={index}
                onClick={itemPlacer(index)}
            />
            ;
    });

    return <div className={classes.field}
                style={{"--game-field-size": size}}
    >
        {lettersComponents}
    </div>

};

export default GameField;