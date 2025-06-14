import React, { useState, useMemo } from "react";
import DetailPane from "./components/DetailPane";
import Timeline from "./components/timeline/Timeline";
import LiteratureNetwork from "./components/LiteratureNetwork";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Node, Edge, DetailItem } from "./types";
import "./App.css";

// Sample data - replace with your actual data
const sampleNodes: Node[] = [
  {
    id: "1",
    label: "The Great Gatsby",
    type: "work",
    year: 1925,
    image: "https://example.com/gatsby-cover.jpg",
    externalLink: "https://en.wikipedia.org/wiki/The_Great_Gatsby",
    description:
      "A novel by F. Scott Fitzgerald that follows a cast of characters living in the fictional towns of West Egg and East Egg on Long Island in the summer of 1922.",
    tags: ["American Literature", "Modernism", "Jazz Age"],
  },
  {
    id: "2",
    label: "F. Scott Fitzgerald",
    type: "author",
    year: 1896,
    description:
      "American novelist and short story writer, whose works illustrate the Jazz Age.",
    tags: ["American Author", "Modernist"],
  },
  {
    id: "3",
    label: "American Dream",
    type: "theme",
    description:
      "The ideal that every US citizen should have an equal opportunity to achieve success and prosperity through hard work, determination, and initiative.",
    tags: ["American Culture", "Social Commentary"],
  },
  {
    id: "4",
    label: "The Sun Also Rises",
    type: "work",
    year: 1926,
    description:
      "A novel by Ernest Hemingway that follows a group of American and British expatriates as they travel from Paris to Pamplona to watch the running of the bulls.",
    tags: ["American Literature", "Modernism", "Lost Generation"],
  },
  {
    id: "5",
    label: "Ernest Hemingway",
    type: "author",
    year: 1899,
    description:
      "American novelist, short story writer, and journalist. His economical and understated style had a strong influence on 20th-century fiction.",
    tags: ["American Author", "Modernist"],
  },
  {
    id: "6",
    label: "The Old Man and the Sea",
    type: "work",
    year: 1952,
    description:
      "A novel by Ernest Hemingway about an aging Cuban fisherman who struggles with a giant marlin far out in the Gulf Stream.",
    tags: ["American Literature", "Modernism"],
  },
  {
    id: "7",
    label: "To Kill a Mockingbird",
    type: "work",
    year: 1960,
    description:
      "A novel by Harper Lee about racial injustice and the loss of innocence in the American South.",
    tags: ["American Literature", "Southern Gothic"],
  },
  {
    id: "8",
    label: "Harper Lee",
    type: "author",
    year: 1926,
    description:
      "American novelist best known for To Kill a Mockingbird, which won the Pulitzer Prize.",
    tags: ["American Author"],
  },
  {
    id: "9",
    label: "Racial Injustice",
    type: "theme",
    description:
      "The unfair treatment of people based on their race or ethnicity.",
    tags: ["Social Issues", "Civil Rights"],
  },
  {
    id: "10",
    label: "The Catcher in the Rye",
    type: "work",
    year: 1951,
    description:
      "A novel by J.D. Salinger about teenage alienation and loss of innocence in post-war America.",
    tags: ["American Literature", "Coming of Age"],
  },
  {
    id: "11",
    label: "J.D. Salinger",
    type: "author",
    year: 1919,
    description: "American writer best known for The Catcher in the Rye.",
    tags: ["American Author"],
  },
  {
    id: "12",
    label: "Coming of Age",
    type: "theme",
    description:
      "The transition from childhood to adulthood, often involving personal growth and self-discovery.",
    tags: ["Literary Theme", "Personal Development"],
  },
];

const sampleEdges: Edge[] = [
  { source: "1", target: "2", type: "authored" },
  { source: "1", target: "3", type: "themed" },
  { source: "4", target: "5", type: "authored" },
  { source: "4", target: "3", type: "themed" },
  { source: "6", target: "5", type: "authored" },
  { source: "7", target: "8", type: "authored" },
  { source: "7", target: "9", type: "themed" },
  { source: "10", target: "11", type: "authored" },
  { source: "10", target: "12", type: "themed" },
  { source: "5", target: "3", type: "influenced" },
  { source: "8", target: "9", type: "themed" },
  { source: "11", target: "12", type: "influenced" },
];

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
