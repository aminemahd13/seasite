"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sitemap = require("./sitemap");

Object.keys(_sitemap).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _sitemap[key];
    }
  });
});

var _blog = require("./blog");

Object.keys(_blog).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _blog[key];
    }
  });
});

var _markdown = require("./markdown");

Object.keys(_markdown).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _markdown[key];
    }
  });
});

var _html = require("./html");

Object.keys(_html).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _html[key];
    }
  });
});

var _handle = require("./handle");

Object.keys(_handle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _handle[key];
    }
  });
});

var _release = require("./release");

Object.keys(_release).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _release[key];
    }
  });
});

var _minify = require("../site/minify");

Object.keys(_minify).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _minify[key];
    }
  });
});