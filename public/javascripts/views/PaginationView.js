define(["backbone", "tpl!templates/perpage.tmpl"], function(Backbone, perPageTemplate){

	return Backbone.View.extend({
		el : ".pagination-bar",
		initialize: function(attrs){
			this.parentView = attrs.parentView;

			var defaults = {
				containerID: "",
				first: false,
				previous: "&lt;",
				next: "&gt;",
				last: false,
		        links: "numeric", // blank || title
		        startPage: 1,
		        perPage: 10,
		        midRange: 5,
		        startRange: 1,
		        endRange: 1,
		        keyBrowse: false,
		        scrollBrowse: false,
		        pause: 0,
		        clickStop: false,
		        delay: 50,
		        direction: "forward", // backwards || auto || random ||
		        animation: "", // http://daneden.me/animate/ - any entrance animations
		        fallback: 400,
		        minHeight: true,
		        perPageOptions:[5,10,15],
		        callback: undefined // function( pages, items ) { }
		    };

			//this.previous = attrs.previous; //for previous link
			//this.next = attrs.next; // for next link
			//this.startPage = 1;
			//this.midRange = attrs.midRange; //number of pages to be displayed at once around the currently active link
			//this.startRange = attrs.startRange //number of pages always visible at the begining of the nav.
			//this.endRange = attrs.endRange;
			//this.delay = attrs.delay;
			//this.minHeight = true;
			//this.callback = attrs.callback;
			this.options = _.extend({}, defaults, attrs);
			this.container = $("#" + this.options.containerID);
			this.listenTo(this.collection, "reset", this.render);
		},
		events:{
			"click a" : "getNextPage",
			"change .items-perpage" : "changeItemsPerPage"
		},
		changeItemsPerPage: function(e){
			var $target = $(e.target);
			this.collection.fetch({
				reset: true,
				data: {
					perPage: $target.val()
				}
			});
		},
		render: function(){
			//We have updated the parse method of the collection.
			// to get values for the properties such as currentPageNum
			// perPage, offset and totalPages.
			this.currentPageNum = this.collection.currentPageNum;
			this.perPage = this.collection.perPage;
			this.offset = this.collection.offset;
			this.totalPages = this.collection.totalPages;
			//this.$el.html( this.createNav() );
			this.initializePagination();
		},		
		initializePagination: function(){
			//not required, we would add the styles to a separate stylesheet.
			this.setStyles();
			var navhtml = this.createNav();
			this.$el.find(".nav-bar").html( navhtml );
			var ops = this.options.perPageOptions;
			var perPage = this.perPage;
			this.$el.find(".select-box").html(perPageTemplate({ops:ops, perPage:perPage}));
			this.cacheNavElements();		
			this.paginate(this.currentPageNum);
			this.setMinHeight();
		},
		setStyles : function() {
			var requiredStyles = "<style>" +
			".jp-invisible { visibility: hidden !important; } " +
			".jp-hidden { display: none !important; }" +
			"</style>";

			$(requiredStyles).appendTo("head");

		},
		//generates html for the nav bar 
		createNav: function(){
			var i = 1, navhtml;
			//generates previous button
			navhtml = this.writeBtn("first") + this.writeBtn("previous");
			for(;i <= this.totalPages; i++){
				//when there is no visible link at the begining - rare case
				if (i === 1 && this.options.startRange === 0) navhtml += "<span>...</span>";
				//when the page link is in between the startrange and end range.
				// generate an anchor link with link-hidden class;
				if (i > this.options.startRange && i <= this.totalPages - this.options.endRange)
		          navhtml += "<a href='#' class='jp-hidden'>";
				
				//otherwise generate an anchor tag without link-hidden class.
				else{
					navhtml+="<a>";
				}
					
				//defaulting to numbers
				navhtml += i;

				//closing the tag
				navhtml += "</a>";

				//inserting empty span tags after startRange and before
				//endRange anchor tags.
				if(i === this.options.startRange || i === this.totalPages - this.options.endRange){
					navhtml+="<span>...</span>";
				}
			}
				navhtml += this.writeBtn("next") + this.writeBtn("last");

				return navhtml;
		},
		//creates html for the buttons.
		writeBtn: function(which){
			return this.options[which] !== false ?
				   "<a class = 'jp-"+ which +"'>"+this.options[which]+"</a>":"";
		},
		cacheNavElements: function(){
			this.nav = this.nav || {};
			this.holder = this.$el.find('.nav-bar');

			this.nav.first = this.holder.find("a.jp-first");
			this.nav.last = this.holder.find("a.jp-last");
			this.nav.previous = this.holder.find("a.jp-previous");
			this.nav.next = this.holder.find("a.jp-next");
			this.nav.firstBreak = this.holder.find("span:first");
			this.nav.lastBreak = this.holder.find("span:last");
			this.nav.pages = this.holder.find("a").not(".jp-next, .jp-previous, .jp-first, .jp-last");
			this.nav.permPages = this.nav.pages.slice(0, this.options.startRange)
								.add(this.nav.pages.slice(this.totalPages - this.options.endRange, this.totalPages));
			this.nav.pagesShowing = $([]);
			this.nav.currentPage = $([]);
		},		
		setMinHeight : function() {
			var that = this;
			if (this.options.minHeight && !this.container.is("table, tbody")) {
				setTimeout(function() {
					that.container.css({ "min-height": that.container.css("height") });
				}, 1000);
			}
		},
		//is the new page number valid, to navigate ?
		validNewPage: function(newPage){
			return newPage !== this.currentPageNum && newPage > 0 && newPage <= this.totalPages;
		},
		//triggered when any of the links in the nav bar are clicked.
		getNextPage: function(e){
			var $target = $(e.target),
				newPage = this.getNewPageNum(this.nav, $target);
				if(this.validNewPage(newPage)){
					//skipping this._clicked = true, for the time being.
					//call fetch on the collection with the new parameters
					// which will in turn trigger the reset event and 
					// call the render method.
					this.collection.fetch({
						reset: true, 
						data: {
							currentPageNum : newPage,
							perPage : this.perPage
						}
					});
					//this.paginate(newPage)
				}

				e.preventDefault();
			
		},
		getNewPageNum: function(nav, target){

			if(target.is(nav.currentPage)) return this.currentPageNum;
			if(target.is(nav.first)) return 1;
			if(target.is(nav.last)) return this.totalPages;
			if(target.is(nav.pages)) return nav.pages.index(target)+1;
			if(target.is(nav.previous)) return nav.pages.index(nav.currentPage);
			if(target.is(nav.next)) return nav.pages.index(nav.currentPage)+2;
			
		},
		paginate: function(page){
		  var pageInterval;
		      pageInterval = this.updatePages(page);
		      this.currentPageNum = page;
		      if ($.isFunction(this.options.callback))
		         this.callback(page, pageInterval);

		      //this.updatePause();
		},
		updatePages: function(page){
		  var interval;
      		  interval = this.getInterval(page);
			  this.updateBtns(this.nav, page);
	          this.updateCurrentPage(this.nav, page);
	          this.updatePagesShowing(this.nav, interval);
	          this.updateBreaks(this.nav, interval);
		},
		getInterval : function(page) {
	      var neHalf, upperLimit, start, end;
	      neHalf = Math.ceil(this.options.midRange / 2);
	      upperLimit = this.totalPages - this.options.midRange;
	      start = page > neHalf ? Math.max(Math.min(page - neHalf, upperLimit), 0) : 0;
	      end = page > neHalf ?
	        Math.min(page + neHalf - (this.options.midRange % 2 > 0 ? 1 : 0), this.totalPages) :
	        Math.min(this.options.midRange, this.totalPages);
	      return {start: start,end: end};
	    },
	    updateBtns: function(nav, page){
	    	if (page === 1) {
	    		nav.first.addClass("jp-disabled");
	    		nav.previous.addClass("jp-disabled");
	    	}
	    	if (page === this.totalPages) {
	    		nav.next.addClass("jp-disabled");
	    		nav.last.addClass("jp-disabled");
	    	}
	    	if (this.currentPageNum === 1 && page > 1) {
	    		nav.first.removeClass("jp-disabled");
	    		nav.previous.removeClass("jp-disabled");
	    	}
	    	if (this.currentPageNum === this.totalPages && page < this.totalPages) {
	    		nav.next.removeClass("jp-disabled");
	    		nav.last.removeClass("jp-disabled");
	    	}
	    },
	    updateCurrentPage: function(nav, page){
	    	nav.currentPage.removeClass("jp-current");
      		nav.currentPage = nav.pages.eq(page - 1).addClass("jp-current");
	    },
	    updatePagesShowing : function(nav, interval) {
	    	var newRange = nav.pages.slice(interval.start, interval.end).not(nav.permPages);
	    	nav.pagesShowing.not(newRange).addClass("jp-hidden");
	    	newRange.not(nav.pagesShowing).removeClass("jp-hidden");
	    	nav.pagesShowing = newRange;
	    },

	    updateBreaks : function(nav, interval) {
	    	if (
	    		interval.start > this.options.startRange ||
	    		(this.options.startRange === 0 && interval.start > 0)
	    		) nav.firstBreak.removeClass("jp-hidden");
	    		else nav.firstBreak.addClass("jp-hidden");

	    	if (interval.end < this.totalPages - this.options.endRange) nav.lastBreak.removeClass("jp-hidden");
	    	else nav.lastBreak.addClass("jp-hidden");
	    }
	});
});