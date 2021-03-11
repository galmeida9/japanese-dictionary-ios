const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GREY: '#898989',
  THEME: '#B23AFC',
  PRIMARY: '#B23AFC',
  INFO: '#1232FF',
  ERROR: '#FE2472',
  WARNING: '#FF9C09',
  SUCCESS: '#45DF31',
  TRANSPARENT: 'transparent',
  INPUT: '#808080',
  PLACEHOLDER: '#9FA5AA',
  NAVBAR: '#F9F9F9',
  BLOCK: '#808080',
  MUTED: '#9FA5AA',
  NEUTRAL: 'rgba(255,255,255, 0.65)',
  FACEBOOK: '#3B5998',
  TWITTER: '#5BC0DE',
  DRIBBBLE: '#EA4C89',
  ICON: '#000000',
};

const SIZES = {
  BASE: 16,
  FONT: 16,
  OPACITY: 0.8,
};

const DarkTheme = {
  dark: true,
  colors: {
      background: "black",
      text: 'white',
      cards: '#141414',
      subtitle: '#e3e3e3',
  }
};

const LightTheme = {
  dark: true,
  colors: {
      background: "white",
      text: 'black',
  }
};

export default {
  COLORS,
  SIZES,
  DarkTheme,
  LightTheme,
};
