import {makeStyles} from "@material-ui/core/styles";
import {useState} from "react";
import {Avatar, Button, Card, FormControl, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import colorHash from "../colorHash";
import SplitScreen from "./SplitScreen";


const useStyles = makeStyles({
    splitScreenSettings: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        padding: "20px",
        width: "800px"
    },
    players: {
        marginTop: "30px",
        "&::before": {
            display: "block",
            paddingBottom: "10px",
            content: "'Players: '"
        },
        paddingBottom: "20px"
    },
    player: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        paddingBottom: "5px"
    },
    avatar: {
        backgroundColor: "var(--color)"
    }
})

const SplitScreenSettings = (props) => {

    const classes = useStyles();
    const [string, setString] = useState("");
    const [word, setWord] = useState("");
    const [size, setSize] = useState(14);
    const players = string.split(",").map(p => p.trim());
    const [splitscreen, setSplitscreen] = useState();

    if (splitscreen) {
        return splitscreen.action();
    }

    return <div className={classes.splitScreenSettings}>

        <Card className={classes.card}>

            <TextField
                label="Initial word"
                value={word}
                onChange={(e) => {
                    setWord(e.target.value);
                }}
            />

            <TextField
                label="Players names over ','"
                value={string}
                onChange={(e) => {
                    setString(e.target.value);
                }}
            />

            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Size</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={size}
                    onChange={e =>
                        setSize(e.target.value)
                    }
                >
                    {
                        (() => {
                            const l = [];
                            for (let i = 10; i < 30; i++) {
                                l.push(<MenuItem key={"SplitScreenSettings__size_"+i} value={i}>{i}</MenuItem>);
                            }
                            return l;
                        })()
                    }
                </Select>
            </FormControl>

            <div className={classes.players}>
                {
                    players.map(player =>
                        <div className={classes.player}>
                            <Avatar
                                className={classes.avatar}
                                style={{
                                    "--color": colorHash(player)
                                }}
                                key={player}
                            >
                                {player.substring(0, 2)}
                            </Avatar>
                            {player}
                        </div>
                    )
                }
            </div>

            <Button variant="contained" color="primary"
                    onClick={() => {
                        setSplitscreen({
                            action: () => <SplitScreen players={players} word={word} size={size}/>
                        })
                    }
                    }
            >
                PLAY!
            </Button>
        </Card>


    </div>
}

export default SplitScreenSettings;