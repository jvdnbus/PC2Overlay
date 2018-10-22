import { IndexController } from 'controller/IndexController'

const AppRouter = require('marionette.approuter')

export const Router = AppRouter.default.extend({
	initialize(options) {
		this.controller = new IndexController(options)
	},

	appRoutes: {
		'': 'default'
	}
})
