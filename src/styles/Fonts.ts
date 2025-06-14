// Font styles for the school bus tracking application

// Font families
export const FontFamily = {
    regular: "Poppins-Regular",
    medium: "Poppins-Medium",
    semiBold: "Poppins-SemiBold",
    bold: "Poppins-Bold",
    light: "Poppins-Light",
  }
  
  // Font sizes (to be used with Scaler)
  export const FontSizes = {
    tiny: 10, // Very small text, labels
    small: 12, // Small text, captions
    regular: 14, // Regular text, body
    medium: 16, // Medium text, subheadings
    large: 18, // Large text, headings
    xlarge: 20, // Extra large text, section titles
    xxlarge: 24, // Double extra large, screen titles
    xxxlarge: 32, // Triple extra large, hero text
  }
  
  // Font weights
  export const FontWeights = {
    light: "300",
    regular: "400",
    medium: "500",
    semiBold: "600",
    bold: "700",
  }
  
  // Text styles - combinations of family, size, and weight
  export const TextStyles = {
    // Headings
    h1: {
      fontFamily: FontFamily.bold,
      fontSize: FontSizes.xxxlarge,
    },
    h2: {
      fontFamily: FontFamily.bold,
      fontSize: FontSizes.xxlarge,
    },
    h3: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSizes.xlarge,
    },
    h4: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSizes.large,
    },
  
    // Body text
    bodyLarge: {
      fontFamily: FontFamily.regular,
      fontSize: FontSizes.medium,
    },
    bodyRegular: {
      fontFamily: FontFamily.regular,
      fontSize: FontSizes.regular,
    },
    bodySmall: {
      fontFamily: FontFamily.regular,
      fontSize: FontSizes.small,
    },
  
    // Button text
    buttonLarge: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSizes.medium,
    },
    buttonRegular: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSizes.regular,
    },
    buttonSmall: {
      fontFamily: FontFamily.semiBold,
      fontSize: FontSizes.small,
    },
  
    // Caption text
    caption: {
      fontFamily: FontFamily.light,
      fontSize: FontSizes.small,
    },
  
    // Label text
    label: {
      fontFamily: FontFamily.medium,
      fontSize: FontSizes.regular,
    },
  
    // Tab text
    tab: {
      fontFamily: FontFamily.medium,
      fontSize: FontSizes.small,
    },
  }
  
  export default {
    FontFamily,
    FontSizes,
    FontWeights,
    TextStyles,
  }
  
  