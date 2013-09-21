
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.movies = function(req, res){
	res.render('movies');
}

exports.client = function(req, res){
	res.render('client');
}