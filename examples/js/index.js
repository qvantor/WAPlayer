window.onload = function () {
    let player = new WAPlayer.Player(),
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
        volume = document.getElementById('volume');

    start();

    console.log(player);

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