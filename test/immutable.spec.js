import { expect } from 'chai';
import Immutable from 'immutable';

describe('immutability', () => {
	describe('a number', () => {
		function increment(currentState) {
			return currentState + 1;
		}

		it('is immutable', () => {
			let state = 42;
			let nextState = increment(state);

			expect(nextState).to.equal(43);
			expect(state).to.equal(42);
		});

	});

	describe('a list', () => {
		function addMovie(currentState, movie) {
			return currentState.push(movie);
		}

		it('is immutable', () => {
			let state = Immutable.List.of('Trainspotting', '28 days later');
			let nextState = addMovie(state, 'Sunshine');

			expect(nextState.size).to.equal(3);
			expect(state.size).to.equal(2);

			expect(nextState).to.equal(Immutable.List.of(
				'Trainspotting',
				'28 days later',
				'Sunshine'
			));
			expect(state).to.equal(Immutable.List.of(
				'Trainspotting',
				'28 days later'
			));
		});

	});

	describe('a javascript array', () => {
		function addMovie(currentState, movie) {
			currentState.push(movie);
			return currentState;
		}

		it('is mutable', () => {
			let state = ['Trainspotting', '28 days later'];
			let nextState = addMovie(state, 'Sunshine');

			expect(nextState.length).to.equal(3);
			expect(state.length).to.equal(3);

			expect(nextState).to.equal(state);

		});
	});

	describe('a tree', () => {
		function addMovie(currentState, movie) {
			let newState = currentState.set(
				'movies',
				currentState.get('movies').push(movie)
			);
			return newState;
		}

		it('is immutable', () => {
			let state = Immutable.Map({
				movies: Immutable.List.of('Trainspotting', '28 days later')
			});

			let nextState = addMovie(state, 'Sunshine');

			expect(nextState).to.equal(Immutable.Map({
				movies: Immutable.List.of(
					'Trainspotting',
					'28 days later',
					'Sunshine'
				)
			}));

			expect(state).to.equal(Immutable.Map({
				movies: Immutable.List.of('Trainspotting', '28 days later')
			}));

		});

	});

});
