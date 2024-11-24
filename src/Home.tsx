import {Box, Container, List, ListItem} from "@mui/material";

export function Home() {
    return (<Container>
            <Box>
                Simple number puzzle game similar to the UK TV show Countdown, or the (former) game NYT digits.
            </Box>
            <Box>
                Starting with 6 numbers, you can perform a collection of arithmetic operations to find an eventual
                target.
            </Box>
            <Box>
                For example, given a target of 357, and the starting points of 75, 100, 25, 5, 3, 2; this could be
                calculated as:
                <List>
                    <ListItem>100 ＋ 75 = 175</ListItem>
                    <ListItem>5 ＋ 175 = 180</ListItem>
                    <ListItem>2 × 180 = 360</ListItem>
                    <ListItem>360 － 3 = 357</ListItem>
                </List>
            </Box>
            <Box component="code">
                Source code is available on <a href="https://github.com/andrew-ie/numbergameui">GitHub</a>
            </Box>
        </Container>
    )
}