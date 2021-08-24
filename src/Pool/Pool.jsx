import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    pool: {
        display: "flex",
        flexWrap: "wrap",
    },

    item: {
        background: "#333",
        color: '#fff',
        width: "40px",
        height: "40px",
    }
})

const PoolItem = (props) => {
    const classes = useStyles();
    return <div className={classes.item}>
        <div className="pool-item__price">
            {props.price}
        </div>
        <div className="pool-item__symbol">
            {props.symbol}
        </div>
    </div>
}

const Pool = (props) => {

    const classes = useStyles();

    const [pool, setPool] = useState();

    function loadState() {
        props.server.getQueue().then(e => {
            setPool(e);
        });
    }

    useEffect(() => {
        loadState();
        props.server.subscribe(() => {
            loadState();
        });
    }, [0]);

    const items = pool?.map((i, idx) => {
        return <PoolItem price={i.price} symbol={i.symbol} key={idx + "_" + i.symbol}/>
    })
    return <div className={classes.pool}>
        {items}
    </div>
};

export default Pool;