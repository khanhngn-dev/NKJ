import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { Box, Tabs, Tab } from '@mui/material';
import TabPanel from '../../components/TabPanel/TabPanel.component';

import { setNotificationAsync } from '../../redux/notification/notification.action';

const ALPHABET_LIST = ['Hiragana', 'Katakana', 'Kanji'];

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': process.env.REACT_APP_X_RAPIDAPI_KEY,
		'X-RapidAPI-Host': process.env.REACT_APP_X_RAPIDAPI_HOST,
	},
};

const AlphabetPage = () => {
	const dispatch = useDispatch();
	const [tabIndex, setTabIndex] = useState(0);
	const [loading, setLoading] = useState(false);
	const [alphabet, setAlphabet] = useState([]);

	const handleTabChange = (e, newValue) => {
		setTabIndex(newValue);
		fetchAlphabet(e.target.id.toLowerCase());
	};

	const fetchAlphabet = async (alphabet) => {
		setLoading(true);
		try {
			const result = await axios.request({
				...options,
				url: `https://japanese-alphabet.p.rapidapi.com/api/${alphabet}`,
			});
			setLoading(false);
			setAlphabet(result.data['0'].content);
		} catch (e) {
			setLoading(false);
			dispatch(setNotificationAsync({ message: e.message, severity: 'error' }));
			setAlphabet([]);
		}
	};

	useEffect(() => {
		fetchAlphabet('hiragana');
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Box style={{ margin: 'auto', maxWidth: '1200px', padding: '20px 40px' }}>
				<Box>
					<Tabs value={tabIndex} onChange={handleTabChange} centered variant='fullWidth'>
						{ALPHABET_LIST.map((title, index) => (
							<Tab
								sx={{
									borderBottom: 1,
									borderColor: 'divider',
									fontWeight: 700,
									fontSize: '1rem',
								}}
								key={index}
								label={title.toUpperCase()}
								id={title}
								disabled={loading}
							/>
						))}
					</Tabs>
				</Box>
				{/* {ALPHABET_LIST.map((title, index) => (
				<TabPanel
					value={tabIndex}
					key={index}
					index={index}
					title={title}
					letters={alphabet}
				></TabPanel>
			))} */}
				<TabPanel
					value={tabIndex}
					// key={index}
					// index={index}
					title={ALPHABET_LIST[tabIndex]}
					letters={alphabet}
					loading={loading}
				></TabPanel>
			</Box>
		</>
	);
};

export default AlphabetPage;
