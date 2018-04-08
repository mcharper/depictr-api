var express = require('express');
var router = express.Router();

var flickrapi = require("flickrapi");

var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: process.env.FLICKR_API_KEY,
      secret: process.env.FLICKR_API_SECRET
    };

const pagesForKeyword = (keywordslist, setPageCount) => {
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    // we can now use "flickr" as our API object,
    {
      flickr.photos.search({
        tags: keywordslist.replace(' ', ','),
        page: 1,
        per_page: 100,
        safe_search : 1, // 1 is safest, 2 is moderate
        content_type: 1, // Photos only
        sort: 'interestingness-desc',
        orientation: 'landscape,square'
      }, function(err, result) {
        if(err) { throw new Error(err); }
        setPageCount(result.photos.pages);
      });
    };
  });
};

/* GET photos from Flickr. */
router.get('/:keywordslist', function(req, res, next) {
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    // we can now use "flickr" as our API object,
    // but we can only call public methods and access public data

      var pageCount = 1;
      pagesForKeyword(req.params.keywordslist, (c) => {
          pageCount = c;

          flickr.photos.search({
            text: req.params.keywordslist[0] + req.params.keywordslist[1] + req.params.keywordslist[2],
            tags: req.params.keywordslist.replace(' ', ','),
            page: getRandomInt(1, pageCount),
            per_page: 100,
            safe_search : 2, // 1 is safest, 2 is moderate
            content_type: 1, // Photos only
            sort: 'interestingness-desc',
            orientation: 'landscape,square'
          }, function(err, result) {
            // pageCount = result.photos.pages;
            if(err) { throw new Error(err); }
            var photos = [];

            for(var i=0; i < 9; i++) {
              var j = getRandomInt(1, 20);
              var p = result.photos.photo[j - 1];
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = router;
