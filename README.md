# Literature Relations Visualization

An interactive web application for visualizing relationships between literary works, authors, and themes. The application features a network graph, timeline, and detailed information pane.

## Features

- **Network Graph**: Visualize relationships between literary works, authors, and themes
- **Timeline**: View works and authors in chronological order
- **Detail Pane**: See detailed information about selected items
- **Interactive**: Click on items in any view to see related information in other views

## Tech Stack

- React.js
- TypeScript
- Material-UI
- D3.js (for timeline visualization)
- Cytoscape.js (for network graph)
- Styled Components

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/components/`
  - `Layout.tsx`: Main layout component
  - `NetworkGraph.tsx`: Network visualization component
  - `Timeline.tsx`: Timeline visualization component
  - `DetailPane.tsx`: Detailed information display component
- `src/App.tsx`: Main application component
- `src/types/`: TypeScript type definitions

## Data Structure

The application uses the following data structure:

```typescript
interface Node {
  id: string;
  label: string;
  type: "work" | "author" | "theme";
  year?: number;
}

interface Edge {
  source: string;
  target: string;
  type: "influenced" | "themed" | "authored";
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
