define([
		"backbone", 
		"views/BaseView",
		"views/FundView"
		], function(Backbone, BaseView, FundView){

		return BaseView.extend({
			el: "#fundList",
			initialize: function(){
				this.childViews = [];
				this.eventBus.on("collection:sliced", this.render, this);
				this.eventBus.on("perpage:update", this.render, this);
				this.eventBus.on("data:loaded", this.render, this);
			},
			render: function(){
				if(this.childViews.length)
					this.removeChildViews();

				this.collection.each(this.addOne, this);
				return this;
			},
			addOne: function(model){
				var view = new FundView({model:model});
				this.childViews.push(view);
				this.$el.append(view.render().el);
			},
			removeChildViews: function(){
				_.each(this.childViews, function(view){
					view.remove();
				}, this);

				this.childViews = [];
			}
		});
});