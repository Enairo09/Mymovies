var express = require('express');
var router = express.Router();
let request = require("request");
var movieModel = require("../models/movie");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/movies', function (req, res, next) {
  request('https://api.themoviedb.org/3/discover/movie?page=1&include_video=false&include_adult=false&sort_by=popularity.desc&language=fr-FR&api_key=c42ff0bcd97c34600ee3e91624eabc43', function (error, response, body) {
    body = JSON.parse(body);
    console.log(body);
    res.json({ body });
  });
});

router.get('/mymovies', function (req, res, next) {
  movieModel.find(
    function (error, movie) {
      console.log(movie);
      res.json({ result: 'true', data: movie });
    })

});

router.post('/mymovies', function (req, res, next) {
  var newMovie = new movieModel({
    poster_path: req.body.poster_path,
    overview: req.body.overview,
    title: req.body.title,
    idMovieDB: req.body.idMovieDB,
  });

  newMovie.save(
    function (error, movie) {
      if (error) {
        console.log("Oups...error ->", error)
      } else {
        console.log("Here is our new Liked movie ->", movie)
      }
      res.json({ result: 'true', movie });
    });

});

router.delete('/mymovies/:movieId', function (req, res, next) {
  movieModel.deleteOne(
    { idMovieDB: req.params.movieId },
    function (error, movie) {
      if (error) {
        console.log('Sorry i couldnt do it');
      } else {
        console.log('I rock', movie)
        res.json({ result: 'true', movie });
      }

    });
});


module.exports = router;
