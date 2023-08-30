require('dotenv').config();
var express = require('express');
var Sentiment = require('sentiment');

var router = express.Router();

/* GET sentiment */
router.get('/:lyric', function (req, res, next) {
  var detectedSentiment = 0;

  try {
    var sentiment = new Sentiment();
    var result = sentiment.analyze(req.params.lyric);
    console.log(result);
    detectedSentiment = result.score;
  }
  catch (e) {
    console.log("Error detecting sentiment", e);
    detectedSentiment = 0;
  }
  return res.json(detectedSentiment);
});

module.exports = router;
