import React, { useState, useEffect } from "react";
import axios from "axios";

function Deck() {
	const [deckId, setDeckId] = useState(null);
	const [cards, setCards] = useState([]);
	const [remaining, setRemaining] = useState(0);
	const [error, setError] = useState(null);
	const [isShuffling, setIsShuffling] = useState(false);

	useEffect(() => {
		// Fetch a new deck when the component mounts
		async function fetchDeck() {
			try {
				const deckResult = await axios.get(
					"https://deckofcardsapi.com/api/deck/new/shuffle/"
				);
				setDeckId(deckResult.data.deck_id);
				setRemaining(deckResult.data.remaining);
			} catch (err) {
				setError("Error: Unable to fetch deck.");
			}
		}
		fetchDeck();
	}, []);

	async function drawCard() {
		if (remaining === 0) {
			alert("Error: no cards remaining!");
			return;
		}

		try {
			const drawResult = await axios.get(
				`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
			);
			if (drawResult.data.success) {
				setCards([...cards, ...drawResult.data.cards]);
				setRemaining(drawResult.data.remaining);
			} else {
				setError("Error: Unable to draw a card.");
			}
		} catch (err) {
			setError("Error: Unable to draw a card.");
		}
	}

	async function shuffleDeck() {
		setIsShuffling(true);
		try {
			const shuffleResult = await axios.get(
				`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`
			);
			if (shuffleResult.data.success) {
				setCards([]);
				setRemaining(shuffleResult.data.remaining);
			} else {
				setError("Error: Unable to shuffle the deck.");
			}
		} catch (err) {
			setError("Error: Unable to shuffle the deck.");
		}
		setIsShuffling(false);
	}

	return (
		<div>
			<h1>Deck of Cards</h1>
			{error && <p>{error}</p>}
			<button onClick={drawCard} disabled={isShuffling}>
				Draw a Card
			</button>
			<button onClick={shuffleDeck} disabled={isShuffling}>
				Shuffle Deck
			</button>
			<div>
				{cards.map((card) => (
					<img
						key={card.code}
						src={card.image}
						alt={card.value + " of " + card.suit}
					/>
				))}
			</div>
		</div>
	);
}

export default Deck;
