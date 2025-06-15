import { useState, useMemo } from "react";
import DetailPane from "./components/DetailPane";
import Timeline from "./components/timeline/Timeline";
import { LiteratureNetwork } from "./components/LiteratureNetwork";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Node, DetailItem } from "./types";
import "./App.css";

// Sample data - replace with your actual data
import { sampleEdges, sampleNodes } from "../resources/data";

function App() {
  const [selectedItem, setSelectedItem] = useState<DetailItem | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkTheme ? "dark" : "light",
          primary: {
            main: isDarkTheme ? "#90caf9" : "#1976d2",
            light: isDarkTheme ? "#e3f2fd" : "#42a5f5",
            dark: isDarkTheme ? "#1565c0" : "#1565c0",
          },
          secondary: {
            main: isDarkTheme ? "#f48fb1" : "#9c27b0",
            light: isDarkTheme ? "#fce4ec" : "#ba68c8",
            dark: isDarkTheme ? "#c2185b" : "#7b1fa2",
          },
          background: {
            default: isDarkTheme ? "#121212" : "#f5f5f5",
            paper: isDarkTheme ? "#1e1e1e" : "#ffffff",
          },
          text: {
            primary: isDarkTheme ? "#ffffff" : "#333333",
            secondary: isDarkTheme ? "#b0bec5" : "#666666",
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: isDarkTheme ? "#121212" : "#f5f5f5",
                color: isDarkTheme ? "#ffffff" : "#333333",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkTheme ? "#1e1e1e" : "#ffffff",
                color: isDarkTheme ? "#ffffff" : "#333333",
              },
            },
          },
        },
      }),
    [isDarkTheme]
  );

  const handleNodeClick = (node: Node) => {
    setSelectedItem(node as DetailItem);
  };

  const handleTimelineClick = (item: Node) => {
    setSelectedItem(item as DetailItem);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`app ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
        <header className="app-header">
          <h1>Literature Network</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkTheme ? "☀️ Light" : "🌙 Dark"}
          </button>
        </header>
        <div className="app-content">
          <div className="network-container">
            <LiteratureNetwork
              nodes={sampleNodes}
              edges={sampleEdges}
              onNodeClick={handleNodeClick}
            />
          </div>
          <div className="detail-container">
            <DetailPane selectedItem={selectedItem} />
          </div>
          <div className="timeline-container">
            <Timeline
              data={sampleNodes.filter(
                (node): node is Node => node.year !== undefined
              )}
              selectedNodeId={selectedItem?.id ?? null}
              onNodeSelected={handleTimelineClick}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
