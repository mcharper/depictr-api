var express = require('express');
var router = express.Router();

var flickrapi = require("flickrapi");

var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: process.env.FLICKR_API_KEY,
      secret: process.env.FLICKR_API_SECRET
    };

const SEARCH_SAFE = 1;
const SEARCH_MODERATE = 2;
const SEARCH_UNFILTERED = 3;

const CONTENT_PHOTOS = 1;

const MAX_PHOTOS_TO_RETURN = 20;
const RETRIEVAL_BATCH_SIZE = 100;

const countPhotosAvailableForKeywords = (tagList, retrievalCallBack) => {
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    // we can now use "flickr" as our API object,
    {
      flickr.photos.search({
        tags: tagList,
        page: 1,
        per_page: 1,
        safe_search: SEARCH_MODERATE,
        content_type: CONTENT_PHOTOS,
        sort: 'interestingness-desc',
      }, function(err, result) {
        if(err) { throw new Error(err); }
        retrievalCallBack(result.photos.pages);
        console.log(`Photos available ${result.photos.pages}`);
      });
    };
  });
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  //The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min)) + min; 
}

/* GET photos from Flickr. */
router.get('/:keywordslist', function(req, res, next) {
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    // we can now use "flickr" as our API object,
    // but we can only call public methods and access public data

      var tagList = req.params.keywordslist.replace(' ', ',');

      countPhotosAvailableForKeywords(tagList, (photoCount) => {
          flickr.photos.search({
            tags: tagList,
            per_page: photoCount % RETRIEVAL_BATCH_SIZE,
            safe_search : SEARCH_MODERATE,
            content_type: CONTENT_PHOTOS,
            sort: 'interestingness-desc',
          }, function(err, result) {
            if(err) { throw new Error(err); }
            var photos = [];

            for(var i=0; i < MAX_PHOTOS_TO_RETURN; i++) {
              var j = getRandomInt(1, photoCount % RETRIEVAL_BATCH_SIZE) - 1;
              var p = result.photos.photo[j];
              if(p) {
                  photos.push({ 
                    url: `https://farm${p.farm}.staticflickr.com/${p.server}/${p.id}_${p.secret}.jpg`, 
                    key: i, 
                    owner: 
                    p.owner, 
                    id: p.id, 
                    link: `https://www.flickr.com/photos/${p.owner}/${p.id}`
                });
              }
            };
            
            return res.json(photos);
          });

      });

  });

});

module.exports = router;
