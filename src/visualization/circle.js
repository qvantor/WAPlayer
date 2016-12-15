export class Visualization {
    constructor(analyser, config) {
        this.config = config;
        this.parent = document.querySelector(config.selector);
        this.canvas = document.createElement('canvas');
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvas.width = this.parent.clientWidth;
        this.canvas.height = 255;
        this.parent.appendChild(this.canvas);
        this.analyser = analyser;
        this.analyser.fftSize = 32;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.destroyed = false;

        this.animation();
    }

    animation() {
        this.analyser.getByteFrequencyData(this.dataArray);
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.dataArray.length; i++) {
            this.canvasCtx.beginPath();
            this.canvasCtx.arc(this.canvas.width / 2, 255 / 2, this.dataArray[i] / 2, 0, 2 * Math.PI, false);
            this.canvasCtx.fillStyle = this.config.color || 'rgba(52, 152, 219,0.1)';
            this.canvasCtx.fill();
            this.canvasCtx.lineWidth = 0.001;
            this.canvasCtx.stroke();
        }

        if (!this.destroyed) {
            requestAnimationFrame(this.animation.bind(this));
        }
    }

    destroy() {
        this.destroyed = true;
        this.parent.removeChild(this.canvas);
    }
}
