require.config({
	baseUrl : "/javascripts",
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		}
	},
	paths: {
		'jquery' : 'libs/jquery-1.9.1',
		'underscore' : 'libs/underscore-min',
		'backbone' : 'libs/backbone-min',
		'tpl' : 'libs/tpl',
		'app' : 'client/app'
	}
});

require(["app"], function(App){
	App.initialize();
})