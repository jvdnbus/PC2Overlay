import { Model, Collection } from 'backbone'

export const GameState = Model.extend({
	url: 'http://localhost:8180/crest2/v1/api?gameStates=true',
	defaults: {
		gameState: 0,
		sessionState: 0,
		raceState: 0
	},
	parse(data) {
		return {
			gameState: data.gameStates.mGameState,
			sessionState: data.gameStates.mSessionState,
			raceState: data.gameStates.mRaceState
		}
	}
})

export const EventInfo = Model.extend({
	url: 'http://localhost:8180/crest2/v1/api?eventInformation=true',
	defaults: {
		lapsInEvent: -1,
		trackLocation: null,
		trackVariation: null,
		trackLength: 0.0,
		translatedTrackLocation: null,
		translatedTrackVariation: null
	},
	parse(data) {
		return {
			lapsInEvent: data.eventInformation.mLapsInEvent,
			trackLocation: data.eventInformation.mTrackLocation,
			trackVariation: data.eventInformation.mTrackVariation,
			trackLength: data.eventInformation.mTrackLength,
			translatedTrackLocation: data.eventInformation.mTranslatedTrackLocation,
			translatedTrackVariation: data.eventInformation.mTranslatedTrackVariation
		}
	}
})

const Participant = Model.extend({
	defaults: {
		name: '<name>',
		racePosition: 0,
		currentLap: 0
	},
	parse(data) {
		return {
			id: data.mName.hashCode(),
			name: data.mName,
			racePosition: data.mRacePosition,
			currentLap: data.mCurrentLap
		}
	}
})

export const Participants = Collection.extend({
	model: Participant,
	comparator: 'racePosition',
	url: 'http://localhost:8180/crest2/v1/api?participants=true',
	modelId(attribs) {
		let name = attribs.name || attribs.mName
		return name.hashCode()
	},
	parse(data) {
		return data.participants.mParticipantInfo
	}
})
