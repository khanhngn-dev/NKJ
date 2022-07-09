import styled from '@emotion/styled';

export const ToastrWarpper = styled.div`
	position: absolute;
	transition: 1s ease-in-out;
	top: 40px;
	z-index: 10000;
	&.in {
		right: 10px;
		animation: flyIn 1s ease;
	}
	&.out {
		right: -500px;
	}
	@keyframes flyIn {
		from {
			right: -200px;
		}
		to {
			right: 10px;
		}
	}
`;
