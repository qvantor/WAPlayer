function Range(conf) {
    this.element = document.createElement('input');
    this.element.type = 'range';
    this.element.min = conf.min || 0;
    this.element.max = conf.max || 1;
    this.element.step = conf.step || 1;
    this.element.setAttribute('orient', conf.orient || 'horizontal');

    this.element.oninput = function (e) {
        conf.val[conf.param] = this.value;
    }
}