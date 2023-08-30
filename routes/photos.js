require('dotenv').config();
var express = require('express');
var router = express.Router();

const Flickr = require('flickr-sdk');

const flickr = new Flickr(process.env.FLICKR_API_KEY);

const SEARCH_SAFE = 1;
const SEARCH_MODERATE = 2;
const SEARCH_UNFILTERED = 3;

const CONTENT_PHOTOS = 1;

const MAX_PHOTOS_TO_RETURN = 100;
const RETRIEVAL_BATCH_SIZE = 100;

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  //The maximum is exclusive and the minimum is inclusive
  const r = Math.floor(Math.random() * (max - min)) + min;
  console.log(`r ${r}`);
  return r;
}

const countPhotosAvailableForKeywords = async (tagList) => {
  let result = {};

  try {
    result = await flickr.photos.search({
      tags: tagList,
      page: 1,
      per_page: 1,
      safe_search: SEARCH_SAFE,
      content_type: CONTENT_PHOTOS,
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
  var tagList = req.params.keywordslist.replace(' ', ',');
  var photos = [];

  try {
    const { total, pages } = await countPhotosAvailableForKeywords(tagList);

    console.log({ total, pages })
    const result = await flickr.photos.search({
      tags: tagList,
      page: getRandomInt(1, pages),
      per_page: total % RETRIEVAL_BATCH_SIZE,
      safe_search: SEARCH_SAFE,
      content_type: CONTENT_PHOTOS,
      sort: 'relevance',
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
    console.log(`error ${e}`);
  }
});

module.exports = router;
