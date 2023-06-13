import { colors } from '@material-ui/core';

const white = '#FFFFFF';
const black = '#000000';

const palette = {
	black,
  white,
  colors,
  primary: {
    contrastText: white,
    dark: colors.indigo[900],
    main: colors.indigo[500],
    light: colors.indigo[100]
  },
  secondary: {
    contrastText: white,
    dark: colors.pink[900],
    main: colors.pink['A400'],
    light: colors.pink['A400']
  },
  success: {
    contrastText: white,
    dark: colors.green[900],
    main: colors.green[600],
    light: colors.green[400]
  },
  info: {
    contrastText: white,
    dark: colors.blue[900],
    main: colors.blue[600],
    light: colors.blue[400]
  },
  warning: {
    contrastText: white,
    dark: colors.orange[900],
    main: colors.orange[600],
    light: colors.orange[400]
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
  },
  text: {
    primary: colors.blueGrey[900],
    secondary: colors.blueGrey[600],
    link: colors.blue[600],
		contrastText: white,
		// hint: "rgba(0, 0, 0, 0.38)"
  },
  background: {
    default: '#f2f2ef',
    // default: '#F4F6F8',
    paper: white,
		level2: "#f5f5f5",
		level1: "#fff",
		footer: "#1b1642",
  },
  icon: colors.blueGrey[600],
  divider: colors.grey[200],
  outline: colors.grey[300],
	alternate: {
		main: "rgb(247, 249, 250)",
		dark: "#e8eaf6",
	},
	cardShadow: "rgba(23, 70, 161, .11)",
	common: {
		black: "#000",
		white: "#fff"
	},
	type: "light",
	grey: {
		50: "#fafafa",
		100: "#f5f5f5",
		200: "#eeeeee",
		300: "#e0e0e0",
		400: "#bdbdbd",
		500: "#9e9e9e",
		600: "#757575",
		700: "#616161",
		800: "#424242",
		900: "#212121",
		A100: "#d5d5d5",
		A200: "#aaaaaa",
		A400: "#303030",
		A700: "#616161"
	},
	contrastThreshold: 3,
	tonalOffset: 0.2,
	action: {
		active: "rgba(0, 0, 0, 0.54)",
		hover: "rgba(0, 0, 0, 0.04)",
		hoverOpacity: 0.04,
		selected: "rgba(0, 0, 0, 0.08)",
		selectedOpacity: 0.08,
		disabled: "rgba(0, 0, 0, 0.26)",
		disabledBackground: "rgba(0, 0, 0, 0.12)",
		disabledOpacity: 0.38,
		focus: "rgba(0, 0, 0, 0.12)",
		focusOpacity: 0.12,
		activatedOpacity: 0.12
	}
};

export default palette;