import React from "react";
import {
    Card,
    CardContent,
    Divider,
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
    }
})

const GameUI = (props) => {

    const classes = useStyles();

    return <Card>
        <CardContent>
            <List>
                {props.inventory
                    .sort((a, b) => a.symbol.localeCompare(b.symbol))
                    .map((item, idx) => {
                        const eq = props.placingItem?.symbol === item.symbol
                        return <ListItem button
                                         disabled={props.turn !== props.player}
                                         key={"game-ui__inventory$" + idx + ":" + item.symbol}
                                         onClick={() => {
                                             console.log(props.placingItem?.symbol + " $ " + item.symbol + " $ " + eq);
                                             if (eq) {
                                                 props.setPlacingItem(undefined);
                                             } else {
                                                 props.setPlacingItem(item);
                                             }
                                         }}
                        >
                            <ListItemText className={eq ? classes.activeCard : ""}
                                          primary={item.symbol + " (" + item.price + ")"}/>
                        </ListItem>
                    })}
            </List>
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
                          onClick={() => {
                              props.setPlacingItem(undefined);
                              props.skip();
                          }}
                >
                    <ListItemIcon>
                        <SkipNext/>
                    </ListItemIcon>
                    <ListItemText primary="SKIP TURN"/>
                </ListItem>
                <ListItem button
                          disabled={props.turn !== props.player}
                          onClick={() => {
                              props.setPlacingItem(undefined);
                              props.renew();
                          }}
                >
                    <ListItemIcon>
                        <Autorenew/>
                    </ListItemIcon>
                    <ListItemText primary="RENEW INVENTORY"/>
                </ListItem>
            </List>
            <Divider/>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Player</TableCell>
                        <TableCell align="right">Points</TableCell>
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
        </CardContent>
    </Card>


};

export default GameUI;