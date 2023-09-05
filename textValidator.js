var validator = require('validator');

const textValidator = function (str) {
  const whitelistPattern = /^[a-zA-Z0-9 \,\;\.\!\?\"\'\-\(\)\[\]\#\$\£]{1,500}$/i;
  return validator.matches(str, whitelistPattern);
}

module.exports = textValidator;
