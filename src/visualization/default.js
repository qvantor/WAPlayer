export class Visualization {
    constructor(analyser, config) {
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
        config.gardient.forEach((item) => {
            this.grd.addColorStop(item[0], item[1]);
        });

        this.hzPerNumber = this.analyser.context.sampleRate / this.analyser.fftSize;
        this.startHz = Math.round(50 / this.hzPerNumber);
        this.endHz = Math.round(20000 / this.hzPerNumber);
        this.animation();
    }

    animation() {
        this.canvas.width = this.parent.clientWidth;

        let width = (this.canvas.clientWidth / this.dataArray.length) * 1.4;

        this.analyser.getByteFrequencyData(this.dataArray);
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(0, 255);

        for (let i = this.startHz; i < this.endHz; i++) {
            this.canvasCtx.lineTo(i * width, 255 - this.dataArray[i]);
        }

        this.canvasCtx.lineTo(this.dataArray.length * width, 255);

        this.canvasCtx.fillStyle = this.grd;
        this.canvasCtx.fill();
        this.canvasCtx.lineWidth = 0.001;
        this.canvasCtx.stroke();

        requestAnimationFrame(this.animation.bind(this));
    }
}
