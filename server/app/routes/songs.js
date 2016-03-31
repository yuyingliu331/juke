'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const mime = require('mime');

module.exports = router;

router.get('/', function (req, res, next) {
  mongoose.model('Song')
  .find(req.query)
  .then(function (songs) {
    res.json(songs);
  })
  .then(null, next);
});

router.param('songId', function (req, res, next, id) {
  mongoose.model('Song')
  .findById(id)
  .populate('artists')
  .then(function (song) {
    if(!song) throw new Error('not found!');
    req.song = song;
    next();
  })
  .then(null, next);
});

var rangeStream = require('range-stream');
router.use(function (req, res, next) {
  res.seekableStream = function (stream, options) {
    if (!options.length) {
      var err = new Error('seekable-stream requires `length` option');
      return next(err);
    }
    // indicate this resource can be partially requested
    res.set('Accept-Ranges', 'bytes');
    // incorporate options
    if (options.length) res.set('Content-Length', options.length);
    if (options.type) res.set('Content-Type', options.type);
    // if this is a partial request
    if (req.headers.range) {
      // parsing request
      var span = req.headers.range.split('=')[1].split('-');
      var start = parseInt(span[0], 10);
      var end = parseInt(span[1], 10) || options.length - 1;
      // formatting response
      res.status(206);
      res.set('Content-Length', (end + 1) - start);
      res.set('Content-Range', 'bytes ' + start + '-' + end + '/' + options.length);
      // slicing the stream to partial content
      stream = stream.pipe(rangeStream(start, end));
    }
    stream.pipe(res);
  };
  next();
});

router.get('/:songId.audio', function (req, res, next) {
  if(!req.song.extension) return next(new Error('No audio for song'));
  var options = {
    type: mime.lookup(req.song.extension),
    length: req.song.size
  };
  var stream = mongoose.model('Song')
  .findById(req.params.songId)
  .select('buffer')
  .stream({ transform: song => song.buffer });
  res.seekableStream(stream, options);
});

router.get('/:songId.image', function (req, res, next) {
  req.song.getAlbums()
  .select('+cover +coverType')
  .then(function (albums) {
    let album = albums[0];
    if(!album.cover || !album.coverType) return next(new Error('no cover'));
    res.set('Content-Type', mime.lookup(album.coverType));
    res.send(album.cover);
  })
  .then(null, next);
});

router.get('/:songId', function (req, res) {
  res.json(req.song);
});
