define([
		"backbone", 
		"tpl!templates/fund.html"
		], function(Backbone, fundTemplate){
			
		return Backbone.View.extend({
			render: function(){
				this.$el.html(fundTemplate(this.model.toJSON()));
				return this;
			}
		});
});