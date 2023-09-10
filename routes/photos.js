require('dotenv').config();
var express = require('express');
var textValidator = require('../textValidator');

var router = express.Router();

const Flickr = require('flickr-sdk');

const flickr = new Flickr(process.env.FLICKR_API_KEY);

const SEARCH_SAFE = 1;
const SEARCH_MODERATE = 2;
const SEARCH_UNFILTERED = 3;

const CONTENT_PHOTOS = 0;

const DefaultBatchSize = 9;

const countPhotosAvailableForKeywords = async (tagList) => {
  let result = {};

  try {
    result = await flickr.photos.search({
      tags: tagList,
      page: 1,
      per_page: 1,
      safe_search: SEARCH_MODERATE,
      content_types: [CONTENT_PHOTOS],
      sort: 'interestingness-desc',
    });

    return {
      total: result.body.photos.total,
      pages: result.body.photos.pages
    };
  }
  catch (e) {
    throw new Error(e);
  }
};

/* GET photos from Flickr matching keywords */
router.get('/:keywordslist', async function (req, res, next) {
  console.log(`req.query.batchSize ${req.query.batchSize}`);
  if (!textValidator(req.params.keywordslist)) {
    res.status(422);
    res.send("The keywords must not exceed 500 characters in total and must comprise only English text");
  } else {
    var tagList = req.params.keywordslist.replace(' ', ',');
    var photos = [];

    try {
      const { total, pages } = await countPhotosAvailableForKeywords(tagList);
      const r = (Math.floor(Math.random() * (pages - 1))) % 20;
      const result = await flickr.photos.search({
        tags: tagList,
        page: r,
        per_page: req.query.batchSize || DefaultBatchSize,
        safe_search: SEARCH_MODERATE,
        content_type: CONTENT_PHOTOS,
        sort: 'interestingness-desc',
      })

      for (const k in result.body.photos.photo) {
        if (k) {
          const p = result.body.photos.photo[k];
          photos.push({
            url: `https://farm${p.farm}.staticflickr.com/${p.server}/${p.id}_${p.secret}.jpg`,
            key: p.id,
            owner:
              p.owner,
            id: p.id,
            link: `https://www.flickr.com/photos/${p.owner}/${p.id}`
          });
        }
      };

      res.json(photos);
    }
    catch (e) {
      res.status(500);
      res.send(`Error retrieving photos associated with the keywords`);
    }
  }
});

module.exports = router;
