import React, {useState} from "react";
import {Box, createTheme, CssBaseline, Tab, ThemeProvider} from "@mui/material";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import GamePanel from "./GamePanel.tsx";
import SolvePanel from "./SolvePanel.tsx";
import {Home} from "./Home.tsx";

function App() {
    const [tabIndex, setTabIndex] = useState(0)
    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };
    const theme = createTheme({
        colorSchemes: {
            dark: true
        }
    });
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme={true} />
        <TabContext value={tabIndex}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange}>
                    <Tab label="Home" value={0} />
                    <Tab label="Play Game" value={1} />
                    <Tab label="Solve Game" value={2} />
                </TabList>
            </Box>
            <TabPanel value={0}>
                <Home />
            </TabPanel>
            <TabPanel value={1}>
                <GamePanel />
            </TabPanel>
            <TabPanel value={2}>
                <SolvePanel />
            </TabPanel>
        </TabContext>
    </ThemeProvider>
  )
}

export default App
