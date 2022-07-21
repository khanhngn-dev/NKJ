import styled from '@emotion/styled';
export const FlipCardContainer = styled.div`
	width: 300px;
	height: 400px;
	margin: 50px 0;
	perspective: 500px;
`;

export const FlipCardInner = styled.div`
	transform-style: preserve-3d;
	transition: all 0.5s ease-in-out;
	position: relative;
	width: inherit;
	height: inherit;

	&.showBack {
		transform: rotateX(180deg);
	}
`;

export const Card = styled.div`
	backface-visibility: hidden;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 10px;
	padding: 20px;

	&.front {
		transform: rotateX(0);
		background-color: var(--primary-color);
	}

	&.back {
		transform: rotateX(180deg);
		background-color: var(--primary-color);
	}
`;
