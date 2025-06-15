// Function to get color based on tag content
export const getTagColor = (tag: string, theme: any) => {
  const tagColors: { [key: string]: string } = {
    // Literary movements TODO add more colors
    Modernism: theme.palette.info.main, // Blue
    "Southern Gothic": theme.palette.secondary.main, // Purple
    "Lost Generation": theme.palette.warning.main, // Orange
    "Jazz Age": theme.palette.error.main, // Pink

    // Genres
    "American Literature": theme.palette.success.main, // Green
    "Coming of Age": theme.palette.info.light, // Cyan

    // Themes
    "Social Commentary": theme.palette.error.main, // Red
    "Civil Rights": theme.palette.warning.dark, // Deep Orange
    "Personal Development": theme.palette.success.light, // Teal

    // Author types
    "American Author": theme.palette.secondary.dark, // Deep Purple
  };

  // Default color if no specific match
  return tagColors[tag] || theme.palette.grey[500]; // Grey as default
};
