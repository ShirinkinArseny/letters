import React, {useState} from "react";
import {
    Avatar,
    Badge,
    Button,
    Card,
    CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Divider, FormControl, InputLabel, LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField
} from "@material-ui/core";
import {Autorenew, Check, HowToVote, NotInterested, SkipNext, SportsEsports} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import colorHash from "../colorHash";

const useStyles = makeStyles({
    card: {
        width: "360px",
    },
    activeCard: {
        color: "#F00"
    },
    remaining: {
        paddingTop: "20px",
        "&::before": {
            display: "block",
            content: '"Remaining items: " attr(data-remaining-items)',
            paddingBottom: "8px"
        }
    },
    title: {
        fontWeight: 600,
        fontSize: "20px",
        paddingBottom: "10px"
    },
    inventory: {
        paddingTop: "10px",
        paddingBottom: "10px",
        display: "grid",
        gap: "5px",
        gridTemplateColumns: "repeat(4, 1fr)",
        "&::before": {
            content: '"Inventory: "',
            gridColumnStart: "1",
            gridColumnEnd: "5",
            paddingBottom: "3px"
        }
    },
    scoreUsername: {
        display: "flex",
        alignItems: "center"
    },
    avatar: {
        background: "var(--color)",
        marginRight: "10px"
    },
    activePlayer: {
        color: "#f50057",
    },
    newWordDialogInputs: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
    }
})

const GameUI = (props) => {

    const classes = useStyles();

    const [areYouSure, setAreYouSure] = useState(undefined);
    const [wannaRestart, setWannaRestart] = useState(false);
    const [newWord, setNewWord] = useState("");
    const [newSize, setNewSize] = useState(14);

    const InventoryItem = (item) => {
        const eq = props.placingItem?.symbol === item.symbol
        return <Button
            variant="contained"
            color={eq ? "secondary" : "primary"}
            disabled={props.turn !== props.player}
            onClick={() => {
                if (eq) {
                    props.setPlacingItem(undefined);
                } else {
                    props.setPlacingItem(item);
                }
            }}
        >
            {item.symbol + " (" + item.price + ")"}
        </Button>
    }

    const skipTurn = () => {
        props.setPlacingItem(undefined);
        props.skip();
    }

    const renewInventory = () => {
        props.setPlacingItem(undefined);
        props.renew();
    }

    return <Card className={classes.card}>
        <CardContent>
            <div className={classes.title}>
                Player: {props.player}
            </div>
            <Divider/>
            <div className={classes.inventory}>
                {props.inventory
                    .sort((a, b) => a.symbol.localeCompare(b.symbol))
                    .map((item, idx) => <InventoryItem
                        key={"game-ui__inventory$" + idx + ":" + item.symbol}
                        {...item}
                    />)}
            </div>
            <Divider/>
            <List>
                <ListItem button
                          disabled={!props.itemsAreOffered || props.turn === props.player}
                          onClick={() => {
                              props.setPlacingItem(undefined);
                              props.accept();
                          }}
                >
                    <ListItemIcon>
                        <Check/>
                    </ListItemIcon>
                    <ListItemText primary="ACCEPT WORD"/>
                </ListItem>
                <ListItem button
                          disabled={
                              !(props.itemsAreOffered || props.itemsArePlaced && props.turn === props.player)
                          }
                          onClick={() => {
                              props.setPlacingItem(undefined);
                              props.refuse();
                          }
                          }
                >
                    <ListItemIcon>
                        <NotInterested/>
                    </ListItemIcon>
                    <ListItemText primary="REFUSE WORD"/>
                </ListItem>
                <ListItem button
                          disabled={!props.itemsArePlaced || props.turn !== props.player}
                          onClick={() => {
                              props.setPlacingItem(undefined);
                              props.offerWord();
                          }}
                >
                    <ListItemIcon>
                        <HowToVote/>
                    </ListItemIcon>
                    <ListItemText primary="OFFER WORD"/>
                </ListItem>
                <ListItem button
                          disabled={props.turn !== props.player}
                          onClick={() =>
                              setAreYouSure({
                                  message: "Are you really wanna skip turn?",
                                  action: skipTurn
                              })
                          }
                >
                    <ListItemIcon>
                        <SkipNext/>
                    </ListItemIcon>
                    <ListItemText primary="SKIP TURN"/>
                </ListItem>
                <ListItem button
                          disabled={props.turn !== props.player}
                          onClick={() =>
                              setAreYouSure({
                                  message: "Are you really wanna renew inventory?",
                                  action: renewInventory
                              })
                          }
                >
                    <ListItemIcon>
                        <Autorenew/>
                    </ListItemIcon>
                    <ListItemText primary="RENEW INVENTORY"/>
                </ListItem>
                <Dialog
                    open={areYouSure}
                    onClose={() => setAreYouSure(undefined)}
                >
                    <DialogTitle>{areYouSure?.message}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Doing this may result you losing the game
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setAreYouSure(undefined);
                        }}>
                            No, I just missclicked
                        </Button>
                        <Button onClick={() => {
                            areYouSure.action();
                            setAreYouSure(undefined);
                        }} color="secondary">
                            Yes, I understand consequences
                        </Button>
                    </DialogActions>
                </Dialog>
                <ListItem button
                          onClick={() =>
                              setWannaRestart(true)
                          }
                >
                    <ListItemIcon>
                        <SportsEsports/>
                    </ListItemIcon>
                    <ListItemText primary="RESTART"/>
                </ListItem>
                <Dialog
                    open={wannaRestart}
                    onClose={() => setWannaRestart(false)}
                >
                    <DialogTitle>Do you really wanna restart game?</DialogTitle>

                    <div className={classes.newWordDialogInputs}>
                        <TextField
                            label="New word"
                            value={newWord}
                            onChange={(e) => {
                                setNewWord(e.target.value);
                            }}
                        />

                        <FormControl>
                            <InputLabel id="GameUI__worldSize">Size</InputLabel>
                            <Select
                                labelId="GameUI__worldSize"
                                value={newSize}
                                onChange={e =>
                                    setNewSize(e.target.value)
                                }
                            >
                                {
                                    (() => {
                                        const l = [];
                                        for (let i = 10; i < 30; i++) {
                                            l.push(<MenuItem key={"GameUI__newSize_" + i} value={i}>{i}</MenuItem>);
                                        }
                                        return l;
                                    })()
                                }
                            </Select>
                        </FormControl>

                    </div>
                    <DialogActions>
                        <Button onClick={() => {
                            setWannaRestart(undefined);
                        }}>
                            No
                        </Button>
                        <Button onClick={() => {
                            setWannaRestart(false);
                            props.restart(newWord, newSize);
                        }} color="secondary">
                            Restart
                        </Button>
                    </DialogActions>
                </Dialog>
            </List>
            <Divider/>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Player</TableCell>
                        <TableCell align="right">Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(props.rank)
                        .sort((a, b) => props.rank[b] - props.rank[a])
                        .map(player =>
                            <TableRow key={player}>
                                <TableCell>
                                    <div className={classes.scoreUsername + " "+ ((player === props.turn) ? classes.activePlayer : " ")}>
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
                                </TableCell>
                                <TableCell align="right">{props.rank[player]}</TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>
            <div className={classes.remaining} data-remaining-items={props.remainingItems}>
                <LinearProgress variant="determinate" value={props.remainingItems * 100 / props.totalItems}/>
            </div>
        </CardContent>
    </Card>


};

export default GameUI;