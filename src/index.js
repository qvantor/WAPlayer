import {Visualization} from './visualization/';

class Player {
    constructor(config) {
        config = config || {};
        this.ctx = new AudioContext();
        this.gain = this.ctx.createGain();
        this.analyser = this.ctx.createAnalyser();
        this.paused = true;
        this.time = 0;

        if (config.filters) {
            this.filters = [];
            config.filters.forEach((filter) => {
                let f = this.ctx.createBiquadFilter();

                f.type = filter.type || 'peaking';
                f.frequency.value = filter.frequency || 350;
                f.gain.value = filter.gain || 0;
                f.Q.value = filter.Q || 0;
                this.filters.push(f);
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

    play() {
        if (!this.paused || this.loading) return;

        this._createSource();

        this.paused = false;

        if (this.time > 0) {
            this.source.start(0, this.time);
        } else {
            this.source.start(0);
        }

        this._interval = setInterval(() => {
            if (this._last) {
                this.time = this.time + ((new Date() - this._last) / 1000);
            }
            this._last = new Date();
            if (this.time >= this.duration) {
                this.stop();
                this._emit('endFile');
            }
            this._emit('timeChange', this.time);
        }, 50);

        this._emit('play');
    }

    pause() {
        if (this.loading || this.paused) return;

        this.paused = true;

        this.source.stop(0);
        this._last = null;
        clearInterval(this._interval);
        this._emit('pause');
    }

    stop() {
        if (this.loading || this.paused) return;
        this.paused = true;
        this.time = 0;
        this._last = null;
        clearInterval(this._interval);
        this.source.stop(0);
        this._emit('pause');
    }

    toggle() {
        this.paused ? this.play() : this.pause();
    }

    volume(vol) {
        this.gain.gain.value = vol;
        this._emit('volume', vol);
    }

    seek(time) {
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

    load(src) {
        // @todo find way to cancel last one and make new one
        return new Promise((resolve, reject) => {
            if (this.loading) return reject(false);
            if (this.source) {
                clearInterval(this._interval);
                this.source.stop(0);
            }
            this.loading = true;

            this._loadSoundFile(src, this.ctx).then((data) => {
                this.buffer = data;
                this.duration = data.duration.toFixed(0);
                this.time = 0;
                this.paused = true;
                this.loading = false;
                this._createSource();
                this._emit('loaded');
                resolve(this);
            }).catch(reject);
        });
    }

    destroy() {
        clearInterval(this._interval);
        this.ctx.close();
    }

    on(event, cb) {
        if (this.events[event] && typeof cb === 'function') {
            this.events[event].push(cb);
        }
        return this;
    }

    _emit(event, data) {
        if (this.events[event].length > 0) {
            this.events[event].forEach((fn) => {
                fn.call(this, data);
            });
        }
    }

    _createSource() {
        this.source = this.ctx.createBufferSource();
        this.source.connect(this.gain);

        if (this.filters && this.filters.length > 0) {
            for (let i = 0; i < this.filters.length; i++) {
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

    _loadSoundFile(url, context) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onprogress = (e) => {
                this._emit('load', e);
            };
            xhr.onload = function (e) {
                context.decodeAudioData(this.response,
                    function (decodedArrayBuffer) {
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
}

exports.Player = Player;
exports.Visualization = Visualization;
