var express = require('express');
var stopWords = require('stopword');
var retinaSDK = require('retinasdk');

var router = express.Router();

/* GET keywords */
router.get('/:lyric', function(req, res, next) {
  var keywords = [];
  try {
    const liteClient = retinaSDK.LiteClient(process.env.RETINA_API_KEY);

    var interestingLyric = stopWords.removeStopwords(req.params.lyric.split(' '));
    console.log('interestingLyric ' + interestingLyric.join(' '));

    keywords = liteClient.getKeywords(interestingLyric.join(' '));
    console.log('keywords ' + keywords.join(','));
  }
  catch(e) {
    keywords = ['fire'];
  }
  return res.json(keywords);
});

module.exports = router;
