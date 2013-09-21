define(["views/BaseView"], function(BaseView){
	return {

			loadData: function(collection, params){
				var that = this;

				collection
					.fetch({})
					.done(function(){
						if(params.action == 'initial-load')
							that.updatePaginationParams(collection, params);
						
						that.sliceCollection(collection, params);

					})
					.fail(function(){
						BaseView.prototype.eventBus.trigger("empty:collection");
					})
					.always(function(){

					});
			},
			updatePaginationParams: function(collection, params){
				//params - for currentPageNum and perPage
				
					this.totalFunds = collection.toJSON();
					this.totalRecords = collection.length;
				
					
			},
			sliceCollection: function(collection, params){
				params.currentPageNum = parseInt(params.currentPageNum);
				params.perPage = parseInt(params.perPage);
				var offset = (params.currentPageNum - 1) * params.perPage,
					end = offset + params.perPage,
					slicedFunds = this.totalFunds.slice(offset, end);
				collection.reset(slicedFunds, {silent:true});

				//settting pagination paginationarams on the collection
				collection.currentPageNum = params.currentPageNum;
				collection.perPage = params.perPage;
				collection.totalPages = Math.ceil(this.totalRecords/params.perPage);

				if(params.action == 'initial-load')
					BaseView.prototype.eventBus.trigger("data:loaded");
				else if(params.action == 'perpage-update')
					BaseView.prototype.eventBus.trigger("perpage:update");
				else
					BaseView.prototype.eventBus.trigger("collection:sliced", params.currentPageNum);
			}
	};
});