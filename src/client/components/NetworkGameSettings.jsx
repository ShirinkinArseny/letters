import {makeStyles} from "@material-ui/core/styles";
import {useState} from "react";
import {Avatar, Button, Card, Divider, TextField} from "@material-ui/core";
import colorHash from "../colorHash";
import NetworkGame from "./NetworkGame";


const useStyles = makeStyles({
    networkGameSettings: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        padding: "20px",
        width: "800px",
        display: "grid",
        gap: "10px",
        gridTemplateAreas: "'pass ava' 'user ava' 'btn btn'"
    },
    avatarContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
    avatar: {
        backgroundColor: "var(--color)"
    }

})

const NetworkGameSettings = (props) => {

    const classes = useStyles();
    const [roomname, setRoomname] = useState("");
    const [username, setUsername] = useState("");
    const [game, setGame] = useState(undefined);

    if (game) {
        return game.action();
    }

    return <div className={classes.networkGameSettings}>

        <Card className={classes.card}>

            <TextField
                label="Room name"
                value={roomname}
                onChange={(e) => {
                    setRoomname(e.target.value);
                }}
            />
            <TextField
                label="Player name"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                }}
            />
            <div className={classes.avatarContainer}>
                <Avatar
                    className={classes.avatar}
                    style={{
                        "--color": colorHash(username)
                    }}
                    key={username}
                >
                    {username.substring(0, 2)}
                </Avatar>
                {username}
            </div>


            <Button variant="contained" color="primary"
                    onClick={() => {
                        setGame({
                            action: () => <NetworkGame
                                room={roomname}
                                player={username}
                            />
                        })
                    }}
            >
                PLAY!
            </Button>
        </Card>


    </div>
}

export default NetworkGameSettings;