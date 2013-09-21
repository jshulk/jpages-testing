define(["backbone", "models/FundModel"], function(Backbone, FundModel){
	return Backbone.Collection.extend({
		model: FundModel,
		url:'/funds'
	});
});