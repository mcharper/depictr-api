require('dotenv').config();
var express = require('express');
var textValidator = require('../textValidator');
var Sentiment = require('sentiment');

var router = express.Router();

/* GET sentiment */
router.get('/:lyric', function (req, res, next) {
  var detectedSentiment = 0;

  if (!textValidator(req.params.lyric)) {
    res.status(422);
    res.send("The lyric must be 500 characters or less and contain only English text");
  } else {
    try {
      var sentiment = new Sentiment();
      var result = sentiment.analyze(req.params.lyric);
      console.log(result);
      detectedSentiment = result.score;
    }
    catch (e) {
      res.status(500);
      res.send("Error computing sentiment associated with the lyric");
    }
    return res.json(detectedSentiment);
  }
});

module.exports = router;
