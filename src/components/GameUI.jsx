import React, {useState} from "react";
import {
    Button,
    Card,
    CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Divider, LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, Table, TableBody, TableCell, TableHead, TableRow
} from "@material-ui/core";
import {Autorenew, Check, HowToVote, NotInterested, SkipNext} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
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
    }
})

const GameUI = (props) => {

    const classes = useStyles();

    const [areYouSure, setAreYouSure] = useState(undefined);

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

    return <Card>
        <CardContent>
            <div className={classes.title}>
                Player: {props.player}
            </div>
            <div className={classes.title}>
                Turn: {props.turn}
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
                                <TableCell>{player}</TableCell>
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