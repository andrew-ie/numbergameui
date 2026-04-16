import {Box, Button, Container, Grid2} from "@mui/material";
import {NumberField} from "@base-ui/react";
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
                <NumberField.Root key="root" min={100} max={999} value={target} onValueChange={(value, _) => { if (value) { setTarget(value) }}}>
                    <NumberField.ScrubArea>
                        <NumberField.ScrubAreaCursor />
                    </NumberField.ScrubArea>
                    <NumberField.Group>
                        <NumberField.Decrement />
                        <NumberField.Input />
                        <NumberField.Increment />
                    </NumberField.Group>
                </NumberField.Root>
            </Box>
            <Box component="section" hidden={graph !== null}>
                <Grid2 container={true} maxWidth="lg">
                    {startPoints.map((startValue, index) =>
                        <Grid2 width={1} key={`tile${index}`}>
                            <NumberField.Root disabled={graph !== null} value={startValue} min={1} max={100}
                                         key={`Tile${index}`} placeholder={`Start Point ${index + 1}`} onValueCommitted={(value, _) => {
                                if (value) {
                                    setStartPoints(startPoints.map((currValue, startIndex) => (startIndex == index) ? value : currValue))
                                }
                            }}>
                                <NumberField.ScrubArea>
                                    <NumberField.ScrubAreaCursor />
                                </NumberField.ScrubArea>
                                <NumberField.Group>
                                    <NumberField.Decrement/>
                                    <NumberField.Input />
                                    <NumberField.Increment />
                                </NumberField.Group>
                            </NumberField.Root>
                        </Grid2>
                    )}
                </Grid2>
            </Box>
            <Box hidden={graph !== null}>
                <Button variant="contained" disabled={target === null || startPoints.indexOf(null) >= 0}
                        onClick={() => setGraph(new Graph(startPoints as number[]))}>SOLVE</Button>
            </Box>
            <Box hidden={graph === null}>
                {graph?.solutions(target!)?.slice(0, 100)?.map((solution, solutionIndex) =>
                    <Container key={`solution${solutionIndex}`}>
                        <Box component="h4">Solution {(solutionIndex + 1)}</Box>
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