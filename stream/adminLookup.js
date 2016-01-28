var through = require('through2');
var peliasConfig = require( 'pelias-config' ).generate();
var wofAdminLookup = require('pelias-wof-admin-lookup');
var peliasAdminLookup = require('pelias-admin-lookup')

/**
 * Generate a stream object that will handle the adminLookup when enabled.
 * When disabled, generate a passthrough stream.
 *
 * @param {object} [config]
 * @param {object} [adminLookup]
 * @returns {Stream}
 */
function createStream(config, adminLookup) {
  config = config || peliasConfig;
  adminLookup = adminLookup || wofAdminLookup;

  if (config.imports.openstreetmap.adminLookup
    && config.imports.adminLookup
    && config.imports.adminLookup.url) {

    var pipResolver = adminLookup.createWofPipResolver(config.imports.adminLookup.url);
    return adminLookup.createLookupStream(pipResolver);

  } else if(config.imports.openstreetmap.adminLookup) {

    return peliasAdminLookup.stream();

  } else {
    return through.obj(function (doc, enc, next) {
      next(null, doc);
    });
  }
}

module.exports = createStream;
