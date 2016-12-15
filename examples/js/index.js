window.onload = function () {
    let player = new WAPlayer.Player({
            filters: [
                {type: 'peaking', frequency: 50, Q: 0.5},
                {type: 'peaking', frequency: 100, Q: 0.5},
                {type: 'peaking', frequency: 300, Q: 0.5},
                {type: 'peaking', frequency: 500, Q: 0.5},
                {type: 'peaking', frequency: 700, Q: 0.5},
                {type: 'peaking', frequency: 1000, Q: 0.5},
                {type: 'peaking', frequency: 1500, Q: 0.5},
                {type: 'peaking', frequency: 2000, Q: 0.5},
                {type: 'peaking', frequency: 3500, Q: 0.5},
                {type: 'peaking', frequency: 5000, Q: 0.5},
                {type: 'peaking', frequency: 10000, Q: 0.5},
                {type: 'peaking', frequency: 15000, Q: 0.5}
            ]
        }),
        visualisation = new WAPlayer
            .Visualization.default(player.analyser,
            {
                selector: '.visual',
                gardient: [
                    [0, 'rgba(234,169,223, 1)'],
                    [1, 'rgba(166,123,193,1)']
                ]
            }),
        songs = [
            'mp3/Custom Phase - Black  White.mp3',
            'mp3/Custom Phase - Overcast.mp3',
            'mp3/Custom Phase - Overwatch-Hop.mp3'
        ],
        song = 0,
        play = document.getElementById('play'),
        played = document.getElementById('played'),
        next = document.getElementById('next'),
        prev = document.getElementById('prev'),
        timeLine = document.getElementById('time-line'),
        timeA = document.getElementById('timeA'),
        timeB = document.getElementById('timeB'),
        volume = document.getElementById('volume'),
        showEQ = document.getElementById('showEQ');

    start();

    player.filters.forEach(function (item) {
        var gain = new Range({
                min: -20,
                max: 20,
                val: item.gain,
                param: 'value',
                orient: 'vertical'
            }),
            q = new
                Range({
                min: 0,
                max: 1,
                val: item.Q,
                step: 0.05,
                param: 'value'
            }),
            div = document.createElement('div'),
            qDiv = document.createElement('div');
        qDiv.setAttribute('class', 'q-range');
        document.getElementsByClassName('eq')[0].appendChild(div);
        div.appendChild(gain.element);
        div.appendChild(qDiv);
        qDiv.appendChild(q.element);
    });

    player.on('timeChange', function (time) {
        timeA.innerHTML = formatTime(time);
        played.style.width = ((time / player.duration) * 100) + '%';
    });
    player.on('loaded', function () {
        timeB.innerHTML = formatTime(player.duration);
    });
    player.on('play', function () {
        play.className = 'flaticon-player';
    });
    player.on('pause', function () {
        play.className = 'flaticon-arrows';
    });
    player.on('volume', function (vol) {
        volume.children[1].style.width = (vol * 100) + '%';
    });
    player.on('endFile', function () {
        next.click();
    });
    player.volume(0.5);


    play.onclick = function () {
        player.toggle();
    };
    next.onclick = function () {
        song++;
        if (song >= songs.length) {
            song = 0;
        }
        start();
    };
    prev.onclick = function () {
        song--;
        if (song < 0) {
            song = songs.length - 1;
        }
        start();
    };
    timeLine.onclick = function (e) {
        player.seek(e.layerX / timeLine.clientWidth * player.duration);
    };
    volume.onclick = function (e) {
        player.volume(e.layerX / volume.clientWidth);
    };
    showEQ.onclick = function (e) {
        document.getElementById('eq').classList.toggle('show');
    };

    function start() {
        player.load(songs[song])
            .then(function () {
                player.play();
            });
    }

    function formatTime(secs) {
        let minutes = Math.floor(secs / 60) || 0;
        let seconds = (secs - minutes * 60) || 0;

        return minutes + ':' + (seconds < 9.5 ? '0' : '') + seconds.toFixed(0);
    }
};