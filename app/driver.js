import Bb from 'backbone'
import { Application, View } from 'backbone.marionette'

import { Router } from './router'

import { LiveLeaderboardView } from './view/Leaderboard'
import { MainView } from './view/Main'

const RootView = View.extend({
	className: 'row',
	template: require('index.html'),
	regions: {
		leaderboard: '#live-leaderboard',
		main: '#main'
	},
	showLeaderboard(controller) {
		let leaderboardView = new LiveLeaderboardView({
			controller: controller
		})
		this.showChildView('leaderboard', leaderboardView)
	},
	showMain() {
		this.showChildView('main', new MainView())
	}
})

const App = Application.extend({
	region: '#root',

	onStart() {
		const rootView = new RootView()
		const router = new Router({rootView: rootView})
		this.showView(rootView)

		Bb.history.start()
	}
})

const app = new App()
app.start()
