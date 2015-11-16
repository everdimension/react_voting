import Immutable from 'immutable';
import { expect } from 'chai';

import { setEntries, next, vote } from '../src/core';

describe('application logic', () => {
	describe('setEntries', () => {

		it('adds the entries to the state', () => {
			const state = Immutable.Map();
			const entries = Immutable.List.of('Trainspotting', '28 Days Later');

			const nextState = setEntries(state, entries);

			expect(nextState.get('entries').size).to.equal(2);
			expect(nextState).to.equal(Immutable.Map({
				entries: Immutable.List.of('Trainspotting', '28 Days Later')
			}));
		});

		it('converts to immutable', () => {
			const state = Immutable.Map();
			const entries = ['Trainspotting', '28 Days Later'];

			const nextState = setEntries(state, entries);

			// expect(nextState.get('entries').size).to.equal(2);
			expect(nextState).to.equal(Immutable.Map({
				entries: Immutable.List.of('Trainspotting', '28 Days Later')
			}));
		});

	});

	describe('next', () => {

		it('takes the next two entries under vote', () => {
			const state = Immutable.Map({
				entries: Immutable.List.of('Trainspotting', '28 Days Later', 'Sunshine')
			});
			const nextState = next(state);

			expect(nextState).to.equal(Immutable.Map({
				vote: Immutable.Map({
					pair: Immutable.List.of('Trainspotting', '28 Days Later')
				}),
				entries: Immutable.List.of('Sunshine')
			}));
		});

		it('puts the winner of current vote back to entries', function () {
			const state = Immutable.Map({
				vote: Immutable.Map({
					pair: Immutable.List.of('Trainspotting', '28 Days Later'),
					tally: Immutable.Map({
						'Trainspotting': 4,
						'28 Days Later': 2
					})
				}),
				entries: Immutable.List.of('Sunshine', 'Millions', '127 Hours')
			});

			const nextState = next(state);

			expect(nextState).to.equal(Immutable.Map({
				vote: Immutable.Map({
					pair: Immutable.List.of('Sunshine', 'Millions')
				}),
				entries: Immutable.List.of('127 Hours', 'Trainspotting')
			}));
		});

		it('puts both entries back from tied vote', function () {

			const state = Immutable.Map({
				vote: Immutable.Map({
					pair: Immutable.List.of('Trainspotting', '28 Days Later'),
					tally: Immutable.Map({
						'Trainspotting': 4,
						'28 Days Later': 4
					})
				}),
				entries: Immutable.List.of('Sunshine', 'Millions', '127 Hours')
			});

			const nextState = next(state);

			expect(nextState).to.equal(Immutable.Map({
				vote: Immutable.Map({
					pair: Immutable.List.of('Sunshine', 'Millions')
				}),
				entries: Immutable.List.of('127 Hours', 'Trainspotting', '28 Days Later')
			}));

		});

		it('marks winner when just one entry left', function () {
			const state = Immutable.Map({
				vote: Immutable.Map({
					pair: Immutable.List.of('Trainspotting', '28 Days Later'),
					tally: Immutable.Map({
						'Trainspotting': 4,
						'28 Days Later': 2
					})
				}),
				entries: Immutable.List()
			});

			const nextState = next(state);

			expect(nextState).to.equal(Immutable.Map({
				winner: 'Trainspotting'
			}));
			
		});

	});

	describe('vote', () => {
		it('creates a tally for the voted entry', function () {
			const state = Immutable.Map({
				vote: Immutable.Map({
					pair: Immutable.List.of('Trainspotting', '28 Days Later')
				}),
				entries: Immutable.List.of('Sunshine')
			});

			const nextState = vote(state, 'Trainspotting');

			expect(nextState).to.equal(Immutable.Map({
				vote: Immutable.Map({
					pair: Immutable.List.of('Trainspotting', '28 Days Later'),
					tally: Immutable.Map({
						'Trainspotting': 1
					})
				}),
				entries: Immutable.List.of('Sunshine')
			}));

		});

		it('adds to existing tally for the voted entry', function () {
			const state = Immutable.Map({
				vote: Immutable.Map({
					pair: Immutable.List.of('Trainspotting', '28 Days Later'),
					tally: Immutable.Map({
						'Trainspotting': 4,
						'28 Days Later': 2
					})
				}),
				entries: Immutable.List.of('Sunshine')
			});

			const nextState = vote(state, 'Trainspotting');

			expect(nextState).to.equal(Immutable.Map({
				vote: Immutable.Map({
					pair: Immutable.List.of('Trainspotting', '28 Days Later'),
					tally: Immutable.Map({
						'Trainspotting': 5,
						'28 Days Later': 2
					})
				}),
				entries: Immutable.List.of('Sunshine')
			}));

		});
	});


});
