import {Box, Button, Container, Grid2} from "@mui/material";
import {NumberInput} from "@mui/base/Unstable_NumberInput/NumberInput";
import {useState} from "react";
import {Graph} from "./gameengine/GameGraph.ts";

function SolvePanel() {
    const [target, setTarget] = useState(null as number | null)
    const [startPoints, setStartPoints] = useState([null, null, null, null, null, null] as (number | null)[])
    const [graph, setGraph] = useState(null as Graph | null)
    return (
        <Container maxWidth="lg">
            <Box component="h3">
                Solve Puzzle
            </Box>
            <Box component="h1">
                <NumberInput min={100} max={999} step={1} value={target} placeholder="Target number"
                             onChange={(_, value) => {
                                 if (value) {
                                     setTarget(value)
                                 }
                             }}/>
            </Box>
            <Box component="section" hidden={graph !== null}>
                <Grid2 container={true} maxWidth="lg">
                    {startPoints.map((_, index) =>
                        <Grid2 width={1}>
                            <NumberInput disabled={graph !== null} value={startPoints[index]} min={1} max={100}
                                         key={`Tile${index}`} placeholder={`Start Point ${index + 1}`}
                                         onChange={(_, value) => {
                                             if (value != null) {
                                                 setStartPoints(startPoints.map((currValue, startIndex) => (startIndex == index) ? value : currValue))
                                             }
                                         }}/>
                        </Grid2>
                    )}
                </Grid2>
            </Box>
            <Box hidden={graph !== null}>
                <Button variant="contained" disabled={target === null || startPoints.indexOf(null) >= 0}
                        onClick={() => setGraph(new Graph(startPoints as number[]))}>SOLVE</Button>
            </Box>
            <Box hidden={graph === null}>
                {graph?.solutions(target!)?.map((solution, solutionIndex) =>
                    <Container>
                        <Box component="h4">Solution {solutionIndex}</Box>
                        <Grid2 container={true} maxWidth="lg" key={`solution${solutionIndex}`}>
                            {solution.toMoves().map((move, index) =>
                                <Grid2 size={7} key={`move${index}`}>
                                    {move.toString()}
                                </Grid2>
                            )}
                        </Grid2>
                    </Container>
                )}
            </Box>
            <Box hidden={graph === null}>
                <Button variant="contained" onClick={() => {
                    setTarget(null);
                    setStartPoints([null, null, null, null, null, null]);
                    setGraph(null)
                }}>RESET</Button>
            </Box>
        </Container>)
}

export default SolvePanel;