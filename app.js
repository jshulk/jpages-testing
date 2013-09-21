
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
var funds = [
						{name: 'abc'},
						{name: 'bcd'},
						{name: 'def'},
						{name: 'fgh'},
						{name: 'ghi'},
						{name: 'hij'},
						{name: 'ijk'},
						{name: 'jkl'},
						{name: 'klm'},
						{name: 'lmn'},
						{name: 'mno'},
						{name: 'nop'},
						{name: 'opq'},
						{name: 'pqr'},
						{name: 'qrs'},
						{name: 'rst'},
						{name: 'stu'},
						{name: 'tuv'},
						{name: 'uvw'},
						{name: 'vwx'},
						{name: 'wxy'},
						{name: 'xyz'},
						{name: 'abc1'},
						{name: 'abc2'},
						{name: 'abc3'},
						{name: 'abc4'},
						{name: 'abc5'},
						{name: 'abc6'}

					];
app.get('/', routes.index);
app.get('/movies', routes.movies);
app.get('/client', routes.client);
app.get('/funds', function(req, res){
	res.json(funds);
});
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
