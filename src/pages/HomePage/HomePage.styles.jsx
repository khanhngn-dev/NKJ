import styled from '@emotion/styled';
import { Button } from '@mui/material';

export const LandingPageImageContainer = styled.div`
	/* background-image: url('../../assets/Landing.png');
	background-size: contain;
	background-repeat: no-repeat;
	height: calc(100vh - 60px);
	background-position: center; */
	background-color: #ffd7d3;
	border-radius: 50%;
	width: 50vw;
	height: 50vw;
	display: flex;
	justify-content: center;
	align-items: center;
	max-width: 600px;
	max-height: 600px;
	position: relative;
`;

export const LandingPageImage = styled.img`
	width: 110%;
`;

export const LandingButton = styled(Button)`
	width: 100%;
	height: 60px;
	font-weight: 700;
`;

export const DecorBar = styled.div`
	height: ${({ height }) => height};
	width: ${({ width }) => width};
	content: '';
	position: absolute;
	background-color: #eb342b;
	top: ${({ top }) => top};
	left: ${({ left }) => left};
	right: ${({ right }) => right};
	border-radius: 20px;
`;
