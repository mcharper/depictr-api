require('dotenv').config();
var express = require('express');
const keyword_extractor = require("keyword-extractor");
var textValidator = require('../textValidator');

var router = express.Router();

/* GET keywords */
router.get('/:lyric', function (req, res, next) {
  var keywords;

  if (!textValidator(req.params.lyric)) {
    res.status(422);
    res.send("The lyric must be 500 characters or less and contain only English text");
  } else {
    const extraction_result =
      keyword_extractor.extract(req.params.lyric, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true
      });

    keywords = extraction_result;

    res.json(keywords);
  };
});

module.exports = router;
