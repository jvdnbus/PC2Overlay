import Mn from 'backbone.marionette'

import { Participants, EventInfo, GameState } from 'Models'
import { LeaderboardController } from 'LeaderboardController'

export const IndexController = Mn.Object.extend({
	default() {
		let participants = new Participants()
		let eventInfo = new EventInfo()
		let gameState = new GameState()
		this.leaderboardController = new LeaderboardController({
			participantsModel: participants,
			eventInfoModel: eventInfo,
			gameStateModel: gameState
		})
		const rootView = this.getOption('rootView')
		rootView.showLeaderboard(this.leaderboardController)
		rootView.showMain()
	}
})
