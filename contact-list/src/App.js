import { ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux'

import './App.css';
import theme from './theme/index';
import store from './redux/store';
import Routes from './Routes';

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<CssBaseline />
				<Paper className="app-paper">
					<Routes />
				</Paper>				
			</Provider>
		</ThemeProvider>
	);
}

export default App;
