import { FlipCardContainer, FlipCardInner, Card } from './FlipCard.styles';

const FlipCard = ({ front, back, showBack, showBackHandler }) => {
	return (
		<FlipCardContainer onClick={showBackHandler}>
			<FlipCardInner className={showBack ? 'showBack' : ''}>
				<Card className='front'>{front}</Card>
				<Card className='back'>{back}</Card>
			</FlipCardInner>
		</FlipCardContainer>
	);
};

export default FlipCard;
