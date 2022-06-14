import styled from '@emotion/styled';
import { Link, ListItemButton } from '@mui/material';

export const NavLink = styled(Link)`
	font-weight: 700;
	position: relative;
	text-align: center;
	padding: 0px 10px;
	&:hover {
		cursor: pointer;
	}
	&:hover ul {
		display: block;
	}
`;

export const ListButton = styled(ListItemButton)`
	font-weight: 700;
`;
