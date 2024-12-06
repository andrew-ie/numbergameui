import {useState} from "react";
import {buildGame} from "./gameengine/GameState.ts";
import {Box, Button, ButtonGroup, Container, Grid2} from "@mui/material";
import {Operations} from "./gameengine/Operations.ts";

function GamePanel() {
    const [gameState, setGameState] = useState(() => buildGame(localStorage))
    return (
        <Container maxWidth="md">
            <Box component="h3">
                Level {gameState.currentLevel} / {(gameState.currentHighestSolved + 1)}
            </Box>
            <Box component="h1">
                Target: {gameState.game.target}
            </Box>
            {gameState.game.getMoves().map((move, index) =>
                <Box component="section" key={"history" + index}>
                    <Grid2 container={true} spacing={2}>
                        <Grid2 size={10}>
                            {move.toString()}
                        </Grid2>
                        <Grid2 size={2}>
                            <ButtonGroup>
                                <Button key={"revert" + index} onClick={() => setGameState(gameState.revert(index))}>Revert</Button>
                            </ButtonGroup>
                        </Grid2>
                    </Grid2>
                </Box>
            )}
            <Box component="section">
                <Grid2 container={true} spacing={2}>
                    <Grid2 size={{sm: 10, md: 5}}>
                        <ButtonGroup>
                            {gameState.game.numbers().map((value, index) =>
                                <Button key={`Option${index}`} value={index} variant={(gameState.currentLeft === index || gameState.currentRight === index) ? "contained" : "outlined" } hidden={value < 0} onClick={() => {setGameState(gameState.toggle(index))}}>{value}</Button>
                            )}
                        </ButtonGroup>
                    </Grid2>
                    <Grid2 size={{sm: 10, md: 5}}>
                        <ButtonGroup>
                            <Button key="plus" variant={(gameState.currentSelectedOperation == Operations.Add) ? "contained" : "outlined"} onClick={() => setGameState(gameState.updateOperation(Operations.Add))}>{Operations.Add.symbol}</Button>
                            <Button key="minus" variant={(gameState.currentSelectedOperation == Operations.Subtract) ? "contained" : "outlined"} onClick={() => setGameState(gameState.updateOperation(Operations.Subtract))}>{Operations.Subtract.symbol}</Button>
                            <Button key="multiply" variant={(gameState.currentSelectedOperation == Operations.Multiply) ? "contained" : "outlined"} onClick={() => setGameState(gameState.updateOperation(Operations.Multiply))}>{Operations.Multiply.symbol}</Button>
                            <Button key="divide" variant={(gameState.currentSelectedOperation == Operations.Divide) ? "contained" : "outlined"} onClick={() => setGameState(gameState.updateOperation(Operations.Divide))}>{Operations.Divide.symbol}</Button>
                        </ButtonGroup>
                    </Grid2>
                    <Grid2 size={2}>
                        <ButtonGroup disabled={gameState.currentLevel === undefined || gameState.currentRight === undefined || gameState.currentSelectedOperation === undefined}>
                            <Button key="move" onClick={() => setGameState(gameState.move())}>Apply</Button>
                        </ButtonGroup>
                    </Grid2>
                </Grid2>
            </Box>
            <Box component="h1">
                <ButtonGroup>
                    <Button disabled={gameState.currentLevel === 1} variant="contained" hidden={gameState.currentLevel < 2} onClick={() => setGameState(gameState.updateLevel(1))}>First Level</Button>
                    <Button disabled={gameState.currentLevel === 1} variant="contained" hidden={gameState.currentLevel < 2} onClick={() => setGameState(gameState.updateLevel(gameState.currentLevel - 1))}>Previous Level</Button>
                    <Button disabled={!gameState.game.solved() && gameState.currentHighestSolved < gameState.currentLevel} key="nextGame" variant="contained" onClick={() => setGameState(gameState.nextGame(localStorage, false))}>Next Level</Button>
                    <Button disabled={!gameState.game.solved() && gameState.currentHighestSolved < gameState.currentLevel} key="lastGame" variant="contained" onClick={() => setGameState(gameState.nextGame(localStorage, true))}>Last Level</Button>
                </ButtonGroup>
            </Box>
        </Container>)
}
export default GamePanel;