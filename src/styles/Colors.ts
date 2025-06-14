// Color palette for the school bus tracking application

const Colors = {
    // Primary colors
    primary: {
      main: "#3E7BFA", // Main primary color - bright blue
      light: "#6B9AFB", // Lighter shade of primary
      dark: "#2A5ED9", // Darker shade of primary
      background: "#EEF3FF", // Very light background with primary tint
    },
  
    // Secondary colors
    secondary: {
      main: "#FF9D42", // Orange - represents the school bus
      light: "#FFBB7C", // Lighter shade of secondary
      dark: "#E67E21", // Darker shade of secondary
      background: "#FFF5EB", // Very light background with secondary tint
    },
  
    // Neutral colors
    neutral: {
      white: "#FFFFFF",
      black: "#000000",
      grey1: "#F7F9FC", // Lightest grey - background
      grey2: "#EDF1F7", // Light grey - cards, dividers
      grey3: "#C5CEE0", // Medium grey - disabled states
      grey4: "#8F9BB3", // Dark grey - secondary text
      grey5: "#2E3A59", // Darkest grey - primary text
    },
  
    // Status colors
    status: {
      success: "#00E096", // Green for success states
      warning: "#FFAA00", // Amber for warning states
      error: "#FF3D71", // Red for error states
      info: "#0095FF", // Blue for information
    },
  
    // Map specific colors
    map: {
      busMarker: "#FF9D42", // Bus location marker
      homeMarker: "#3E7BFA", // Home location marker
      outerRadius: "rgba(62, 123, 250, 0.2)", // Outer proximity circle
      innerRadius: "rgba(62, 123, 250, 0.4)", // Inner proximity circle
      routePath: "#3E7BFA", // Route path color
    },
  
    // Gradient colors
    gradient: {
      primaryStart: "#3E7BFA",
      primaryEnd: "#2A5ED9",
      secondaryStart: "#FF9D42",
      secondaryEnd: "#E67E21",
    },
  
    // Transparent colors
    transparent: {
      primary: "rgba(62, 123, 250, 0.1)",
      secondary: "rgba(255, 157, 66, 0.1)",
      black: "rgba(0, 0, 0, 0.5)",
      white: "rgba(255, 255, 255, 0.8)",
    },
  }
  
  export default Colors
  
  