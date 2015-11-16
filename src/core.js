import Immutable from 'immutable';

export const INITIAL_STATE = Immutable.Map();

export function setEntries(state, entries) {
	return state.set('entries', Immutable.List(entries));
}

function getWinners(vote) {
	if (!vote) {
		return [];
	}

	const [a, b] = vote.get('pair');
	const voteA = vote.getIn(['tally', a], 0);
	const voteB = vote.getIn(['tally', b], 0);

	if (voteA > voteB) {
		return [a];

	} else if (voteA < voteB) {
		return [b];
	}

	return [a, b];

}

export function next(state) {
	const winners = getWinners(state.get('vote'));
	const entries = state.get('entries').concat(winners);

	if (entries.size === 1) {
		return state
			.remove('vote')
			.remove('entries')
			.set('winner', entries.first());
	}

	return state.merge({
		vote: Immutable.Map({
			pair: entries.take(2)
		}),
		entries: entries.skip(2)
	});

}

export function vote(state, entry) {
	return state.updateIn(
		['vote', 'tally', entry], 0, (score) => score + 1
	);
}
