require('dotenv').config();
var express = require('express');
const keyword_extractor = require("keyword-extractor");

var router = express.Router();

/* GET keywords */
router.get('/:lyric', function (req, res, next) {
  var keywords;

  try {
    const extraction_result =
      keyword_extractor.extract(req.params.lyric, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true
      });

    keywords = extraction_result;
  }
  catch (e) {
    console.log("Error extracting keywords", e)
    keywords = [];
  }
  return res.json(keywords);
});

module.exports = router;
