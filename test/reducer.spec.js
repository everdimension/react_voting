import Immutable from 'immutable';
import { expect } from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {

	it('handles undefined initial state', () => {
		const action = {
			type: 'SET_ENTRIES',
			entries: ['Trainspotting']
		};

		const nextState = reducer(undefined, action);

		expect(nextState).to.equal(Immutable.fromJS({
			entries: ['Trainspotting']
		}));
	});

	it('handles SET_ENTRIES', () => {
		const initialState = Immutable.Map();
		const action = {
			type: 'SET_ENTRIES',
			entries: ['Trainspotting']
		};
		const nextState = reducer(initialState, action);

		expect(nextState).to.equal(Immutable.fromJS({
			entries: ['Trainspotting']
		}));
	});

	it('handles NEXT', () => {
		const initialState = Immutable.fromJS({
			entries: ['Trainspotting', '28 Days Later']
		});
		const action = { type: 'NEXT' };
		const nextState = reducer(initialState, action);

		expect(nextState).to.equal(Immutable.fromJS({
			vote: {
				pair: ['Trainspotting', '28 Days Later']
			},
			entries: []
		}));
	});

	it('handles VOTE', () => {
		const initialState = Immutable.fromJS({
			vote: {
				pair: ['Trainspotting', '28 Days Later']
			},
			entries: []
		});

		const action = { type: 'VOTE', entry: 'Trainspotting' };
		const nextState = reducer(initialState, action);

		expect(nextState).to.equal(Immutable.fromJS({
			vote: {
				pair: ['Trainspotting', '28 Days Later'],
				tally: {
					Trainspotting: 1
				}
			},
			entries: []
		}));

	});

	it('can be used with reduce', () => {
		const actions = [
			{ type: 'SET_ENTRIES', entries: ['Trainspotting', '28 Days Later'] },
			{ type: 'NEXT' },
			{ type: 'VOTE', entry: 'Trainspotting' },
			{ type: 'VOTE', entry: '28 Days Later' },
			{ type: 'VOTE', entry: 'Trainspotting' },
			{ type: 'NEXT' }
		];

		const finalState = actions.reduce(reducer, Immutable.Map());

		expect(finalState).to.equal(Immutable.fromJS({
			winner: 'Trainspotting'
		}));
	});

});
