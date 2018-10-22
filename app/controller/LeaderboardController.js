import Mn from 'backbone.marionette'

export const LeaderboardController = Mn.MnObject.extend({
	initialize(options) {
		this.participantsModel = options.participantsModel
		this.eventInfoModel = options.eventInfoModel
		this.gameStateModel = options.gameStateModel
	}
})
