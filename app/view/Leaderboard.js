import { View, CollectionView } from 'backbone.marionette'
import _ from 'underscore'

const LeaderboardTemplate = require('leaderboard.html')
const LeaderboardChildTemplate = require('leaderboard-child.html')
const LeaderboardEmptyTemplate = require('leaderboard-empty.html')

const LLChildView = View.extend({
	template: LeaderboardChildTemplate,
	tagName: 'li',
	className: 'row leaderboard-child-view',
	initialize() {
		// _.bindAll(this, 'render')
		// this.model.bind('change', _.bind(this.requestRender, this))
		this.model.bind('change', _.bind(this.render, this))
	},
	requestRender() {
		let moving = false
		let participant = this.model
		if (participant) {
			let previousPos = participant.previous('racePosition')
			let currentPos = participant.get('racePosition')
			if (previousPos && currentPos && previousPos !== currentPos) {
				moving = true
				const animateSwitch = (child, dir) => {
					// remove animation class to be able to restart the animation
					child.$el.removeClass('move-' + dir)
			
					// triggering reflow - magic
					void child.$el.offsetWidth
					
					// re-add class to start animation
					child.$el.addClass('move-' + dir)
				}
				let moves = currentPos - previousPos
				let direction = moves > 0 ? 'down' : 'up'
				console.log(moves)

				let promise = Promise.delay(animateSwitch, 10, null, this, direction)
				for (let i = 1; i < moves; i++) {
					promise = promise.delay(animateSwitch, 500, null, this, direction)
				}
				promise.then(this.render.apply(this))
			}
		}
		if (!moving) {
			this.render()
		}
	},
	onRender() {
		this.$el.removeClass('move-up move-down')
	},
	templateContext() {
		return {
			shortenedName: this.model.get('name').trim().slice(0, 3).toUpperCase(),
			nameColor: this.model.get('name').hashCode().intToHSL()
		}
	}
})

const LLEmptyView = View.extend({
	template: LeaderboardEmptyTemplate
})

const LLCollectionView = CollectionView.extend({
	collection: null, // is set in construction
	initialize(options) {
		this.controller = options.controller

		//this.collection.bind('reset', this.render)
		//this.collection.bind('add', this.render)
		//this.collection.bind('remove', this.render)
		// this.on('child:requestRender', this.onChildViewRequestRender)
	},
	//viewComparator: 'racePosition',
	// childViewEventPrefix: 'child',
	childView: LLChildView,
	emptyView: LLEmptyView,
	tagName: 'ul',
	className: 'leaderboard-collection-view',
	// onChildViewRequestRender(childView) {
		
	// }
})

export const LiveLeaderboardView = View.extend({
	template: LeaderboardTemplate,
	tagName: 'div',
	className: 'leaderboard-view',
	regions: {
		collection: {
			el: 'ul',
			replaceElement: true
		}
	},
	defaultUpdateTick: 1000,
	initialize(options) {
		this.controller = options.controller
		this.participantsModel = this.controller.participantsModel
		this.eventInfoModel = this.controller.eventInfoModel
		this.gameStateModel = this.controller.gameStateModel

		this.sessionStates = [
			'INVALID', 'PRAC', 'TEST', 'QUALI', 'FORM', 'RACE', 'TT'
		]

		_.bindAll(this, 'render')
		this.eventInfoModel.bind('change', this.render)

		this.participantsModel.fetch()
		this.eventInfoModel.fetch()

		this.updateTick = this.defaultUpdateTick
		this.repeatRender()
	},
	templateContext() {
		const leadersCurrentLap = !this.participantsModel.isEmpty() ?
			this.participantsModel.at(0).get('currentLap') : 0
		const session = this.sessionStates[this.gameStateModel.get('sessionState')]
		return {
			session: session,
			leadersCurrentLap: leadersCurrentLap,
			totalLaps: this.eventInfoModel.get('lapsInEvent')
		}
	},
	onRender() {
		this.showChildView('collection', new LLCollectionView({
			controller: this.controller,
			collection: this.participantsModel
		}))
	},
	repeatRender() {
		var self = this
		setTimeout(function() {
			self.reRender()
		}, this.updateTick)
	},
	reRender() {
		var self = this
		this.eventInfoModel.fetch()
		this.participantsModel.fetch({
			success: function() {
				self.updateTick = self.defaultUpdateTick
				if (self.participantsModel.isEmpty()) {
					self.updateTick = self.defaultUpdateTick * 10
				}
				self.repeatRender()
			}
		})
	}
})
