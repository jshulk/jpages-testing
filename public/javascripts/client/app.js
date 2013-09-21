define([
		'backbone',
		'views/FundListView',
		'collections/FundCollection',
		'views/ClientPaginationView',
		'views/BaseView',
		'utils/ServiceManager'
		], function(
			Backbone,
			FundListView, 
			FundCollection, 
			ClientPaginationView, 
			BaseView,
			serviceManager
			){
		
		return {
					initialize: function(){	

						this.initializeCollections();
						this.initializeViews();
						this.loadData();				

					},
					
					initializeCollections: function(){
						this.funds = new FundCollection();
					},
					initializeViews: function(){
						this.pagination = new ClientPaginationView({collection:this.funds});	
						this.fundListView = new FundListView({
							collection: this.funds
						});

					},
					loadData: function(){

						serviceManager.loadData(this.funds, {
							currentPageNum: 1,
							perPage : 5,
							action: 'initial-load'
						});
					}

		};
});