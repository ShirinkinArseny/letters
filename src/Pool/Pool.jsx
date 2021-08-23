import React, {useState} from "react";
import './Pool.css';

const PoolItem = (props) => {
    return <div className="pool-item">
        <div className="pool-item__price">
            {props.price}
        </div>
        <div className="pool-item__symbol">
            {props.symbol}
        </div>
    </div>
}

const Pool = (props) => {
    const [pool, setPool] = useState();
    props.queue.then(v => {
       setPool(v);
    });
    const items = pool?.map((i, idx) => {
        return <PoolItem price={i.price} symbol={i.symbol} key={idx+"_"+i.symbol}/>
    })
    return <div className="pool">
        {items}
    </div>
};

export default Pool;