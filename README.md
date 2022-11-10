# depictr-api
API to support the Depictr app, which takes lyrics or prose as input and retrieves relevant photos.

Uses Retina API to analyse text to extract keywords.
You'll need an API key for this.

Add it as an environment variable to .env:

RETINA_API_KEY=yours

Uses Flickr API to get photos matching criteria.
You'll need an API key and secret for this.

Add them to environment variables to  .env:

FLICKR_API_KEY=yours

FLICKR_API_SECRET=yours

To run locally, if you're running bash, you'll need to export and set the environment variables so:

export FLICKR_API_KEY
FLICKR_API_KEY=yourkey
etc

and then npm start.
