import {makeStyles} from "@material-ui/core/styles";
import {Button, ButtonGroup, Container, Paper} from "@material-ui/core";
import {Public, ViewComfy} from "@material-ui/icons";
import {useState} from "react";
import SplitScreenSettings from "./SplitScreenSettings";
import NetworkGameSettings from "./NetworkGameSettings";


const useStyles = makeStyles({
    menuWrapper: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    menu: {
        padding: "20px"
    }
});

const Menu = () => {
    const classes = useStyles();
    const [mode, setMode] = useState();
    if (mode) {
        return mode.action();
    }
    return <div className={classes.menuWrapper}>
        <Paper elevation={1}>
            <div className={classes.menu}>
                <ButtonGroup>
                    <Button
                        variant="contained"
                        startIcon={<ViewComfy/>}
                        onClick={() => {
                            setMode({
                                action: () => <SplitScreenSettings/>
                            });
                        }}
                    >
                        SplitScreen
                    </Button>
                    <Button variant="contained"
                            startIcon={<Public/>}
                            onClick={() => {
                                setMode({
                                    action: () => <NetworkGameSettings/>
                                })
                            }
                            }
                    >
                        Play via network
                    </Button>
                </ButtonGroup>
            </div>
        </Paper>
    </div>
}

export default Menu;