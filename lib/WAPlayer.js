(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("WAPlayer", [], factory);
	else if(typeof exports === 'object')
		exports["WAPlayer"] = factory();
	else
		root["WAPlayer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _visualization = __webpack_require__(1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Player = function () {
	    function Player(config) {
	        var _this = this;
	
	        _classCallCheck(this, Player);
	
	        config = config || {};
	        this.ctx = new AudioContext();
	        this.gain = this.ctx.createGain();
	        this.analyser = this.ctx.createAnalyser();
	        this.paused = true;
	        this.time = 0;
	
	        if (config.filters) {
	            this.filters = [];
	            config.filters.forEach(function (filter) {
	                var f = _this.ctx.createBiquadFilter();
	
	                f.type = filter.type || 'peaking';
	                f.frequency.value = filter.frequency || 350;
	                f.gain.value = filter.gain || 0;
	                f.Q.value = filter.Q || 0;
	                _this.filters.push(f);
	            });
	        }
	
	        this.events = {
	            play: [],
	            pause: [],
	            timeChange: [],
	            volume: [],
	            seek: [],
	            load: [],
	            loaded: [],
	            endFile: []
	        };
	    }
	
	    _createClass(Player, [{
	        key: 'play',
	        value: function play() {
	            var _this2 = this;
	
	            if (!this.paused || this.loading) return;
	
	            this._createSource();
	
	            this.paused = false;
	
	            if (this.time > 0) {
	                this.source.start(0, this.time);
	            } else {
	                this.source.start(0);
	            }
	
	            this._interval = setInterval(function () {
	                if (_this2._last) {
	                    _this2.time = _this2.time + (new Date() - _this2._last) / 1000;
	                }
	                _this2._last = new Date();
	                if (_this2.time >= _this2.duration) {
	                    _this2.stop();
	                    _this2._emit('endFile');
	                }
	                _this2._emit('timeChange', _this2.time);
	            }, 50);
	
	            this._emit('play');
	        }
	    }, {
	        key: 'pause',
	        value: function pause() {
	            if (this.loading || this.paused) return;
	
	            this.paused = true;
	
	            this.source.stop(0);
	            this._last = null;
	            clearInterval(this._interval);
	            this._emit('pause');
	        }
	    }, {
	        key: 'stop',
	        value: function stop() {
	            if (this.loading || this.paused) return;
	            this.paused = true;
	            this.time = 0;
	            this._last = null;
	            clearInterval(this._interval);
	            this.source.stop(0);
	            this._emit('pause');
	        }
	    }, {
	        key: 'toggle',
	        value: function toggle() {
	            this.paused ? this.play() : this.pause();
	        }
	    }, {
	        key: 'volume',
	        value: function volume(vol) {
	            this.gain.gain.value = vol;
	            this._emit('volume', vol);
	        }
	    }, {
	        key: 'seek',
	        value: function seek(time) {
	            if (this.loading) return;
	            if (time < 0) return;
	
	            this.time = time;
	
	            if (!this.paused) {
	                this.source.stop(0);
	                this._createSource();
	                this.source.start(0, this.time);
	            }
	            this._emit('timeChange', time);
	            this._emit('seek', time);
	        }
	    }, {
	        key: 'load',
	        value: function load(src) {
	            var _this3 = this;
	
	            // @todo find way to cancel last one and make new one
	            return new Promise(function (resolve, reject) {
	                if (_this3.loading) return reject(false);
	                if (_this3.source) {
	                    clearInterval(_this3._interval);
	                    _this3.source.stop(0);
	                }
	                _this3.loading = true;
	
	                _this3._loadSoundFile(src, _this3.ctx).then(function (data) {
	                    _this3.buffer = data;
	                    _this3.duration = data.duration.toFixed(0);
	                    _this3.time = 0;
	                    _this3.paused = true;
	                    _this3.loading = false;
	                    _this3._createSource();
	                    _this3._emit('loaded');
	                    resolve(_this3);
	                }).catch(reject);
	            });
	        }
	    }, {
	        key: 'on',
	        value: function on(event, cb) {
	            if (this.events[event] && typeof cb === 'function') {
	                this.events[event].push(cb);
	            }
	            return this;
	        }
	    }, {
	        key: '_emit',
	        value: function _emit(event, data) {
	            var _this4 = this;
	
	            if (this.events[event].length > 0) {
	                this.events[event].forEach(function (fn) {
	                    fn.call(_this4, data);
	                });
	            }
	        }
	    }, {
	        key: '_createSource',
	        value: function _createSource() {
	            this.source = this.ctx.createBufferSource();
	            this.source.connect(this.gain);
	
	            if (this.filters && this.filters.length > 0) {
	                for (var i = 0; i < this.filters.length; i++) {
	                    if (i === 0) {
	                        this.gain.connect(this.filters[i]);
	                    } else {
	                        this.filters[i - 1].connect(this.filters[i]);
	                    }
	                }
	
	                this.filters[this.filters.length - 1].connect(this.analyser);
	                this.filters[this.filters.length - 1].connect(this.ctx.destination);
	            } else {
	                this.gain.connect(this.analyser);
	                this.gain.connect(this.ctx.destination);
	            }
	
	            this.source.buffer = this.buffer;
	        }
	    }, {
	        key: '_loadSoundFile',
	        value: function _loadSoundFile(url, context) {
	            var _this5 = this;
	
	            return new Promise(function (resolve, reject) {
	                var xhr = new XMLHttpRequest();
	
	                xhr.open('GET', url, true);
	                xhr.responseType = 'arraybuffer';
	                xhr.onprogress = function (e) {
	                    _this5._emit('load', e);
	                };
	                xhr.onload = function (e) {
	                    context.decodeAudioData(this.response, function (decodedArrayBuffer) {
	                        resolve(decodedArrayBuffer);
	                    }, function (e) {
	                        reject('Error decoding file', e);
	                    });
	                };
	                xhr.onerror = function (e) {
	                    reject(e);
	                };
	                xhr.send();
	            });
	        }
	    }]);
	
	    return Player;
	}();
	
	exports.Player = Player;
	exports.Visualization = _visualization.Visualization;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Visualization = undefined;
	
	var _default2 = __webpack_require__(2);
	
	var Visualization = exports.Visualization = {
	    default: _default2.Visualization
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Visualization = exports.Visualization = function () {
	    function Visualization(analyser, config) {
	        var _this = this;
	
	        _classCallCheck(this, Visualization);
	
	        this.analyser = analyser;
	        this.analyser.fftSize = config.specification || 2048;
	        this.parent = document.querySelector(config.selector);
	        this.canvas = document.createElement('canvas');
	        this.canvas.width = this.parent.clientWidth;
	        this.canvas.height = 255;
	        this.parent.appendChild(this.canvas);
	        this.canvasCtx = this.canvas.getContext('2d');
	        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
	
	        this.grd = this.canvasCtx.createLinearGradient(0, 255, 0, 0);
	        config.gardient.forEach(function (item) {
	            _this.grd.addColorStop(item[0], item[1]);
	        });
	
	        this.hzPerNumber = this.analyser.context.sampleRate / this.analyser.fftSize;
	        this.startHz = Math.round(50 / this.hzPerNumber);
	        this.endHz = Math.round(20000 / this.hzPerNumber);
	        this.animation();
	    }
	
	    _createClass(Visualization, [{
	        key: 'animation',
	        value: function animation() {
	            this.canvas.width = this.parent.clientWidth;
	
	            var width = this.canvas.clientWidth / this.dataArray.length * 1.4;
	
	            this.analyser.getByteFrequencyData(this.dataArray);
	            this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	            this.canvasCtx.beginPath();
	            this.canvasCtx.moveTo(0, 255);
	
	            for (var i = this.startHz; i < this.endHz; i++) {
	                this.canvasCtx.lineTo(i * width, 255 - this.dataArray[i]);
	            }
	
	            this.canvasCtx.lineTo(this.dataArray.length * width, 255);
	
	            this.canvasCtx.fillStyle = this.grd;
	            this.canvasCtx.fill();
	            this.canvasCtx.lineWidth = 0.001;
	            this.canvasCtx.stroke();
	
	            requestAnimationFrame(this.animation.bind(this));
	        }
	    }]);

	    return Visualization;
	}();

/***/ }
/******/ ])
});
;
//# sourceMappingURL=WAPlayer.js.map