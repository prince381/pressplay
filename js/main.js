document.addEventListener('DOMContentLoaded',function() {
/* The code in this function gets executed as soon as the document is rendered
    to the DOM
*/

    // an array of videos to be added to our video playlist.
    const videos = [
        './videos/AirPods Pro - Apple_Full-HD.mp4',
        './videos/iMac Pro - Power to the pro Apple Full-HD.mp4',
        './videos/iPad Pro - Your next computer is not a computer — Apple_HD.mp4',
        './videos/iPhone 11 - Apple_HD.mp4',
        './videos/iPhone 11 Pro - It’s tough out there — Apple_HD.mp4',
        './videos/MacBook Pro - 16-inch — Apple_HD.mp4'
    ];

    // change the theme of the background when the toggle is switched.
    const body = document.querySelector('body');
    const checkBox = document.querySelector('#theme');

    checkBox.addEventListener('change',() => {
        if(checkBox.checked === true) {
            body.classList.add('light');
        } else {
            body.classList.remove('light');
        }
    });

    // this function creates the playlist and append it to the DOM.
    function createPlaylist(list,container) {
        list.forEach(element => {
            let li = document.createElement('li') // create a li tag
            li.setAttribute('class','song'); // set a class attribute

            let [_,folder,vid] = element.split('/');
            li.setAttribute('data-attr',vid); // set a data-attr attribute

            // get artist name and music video title
            let [artist,vidTitle] = vid.split('-');

            // create the inner content of the li tag.
            li.innerHTML = `
            <img src="./icons/play.png" class="plps">
            <div>
                <p class="song-title">${vidTitle.trim().slice(0,-4)}</p>
                <h2 class="artist">${artist.trim()}</h2>
            </div>
            `
            container.appendChild(li);  // append video list to the container.
        });
    }

    // append the video lists in the playlist container.
    const container = document.querySelector('ul.list');
    createPlaylist(videos,container);

    // get the video tag and the control buttons.
    const videoPlayer = document.querySelector('#vid'),
          playPauseImg = document.querySelector('.play img'), // play icon
          playBtn = document.querySelector('.play'), // play button
          prevBtn = document.querySelector('.prev'), // prev button
          nextBtn = document.querySelector('.next'); // next button

    // this function plays or pauses the video and changes the play icon.
    function playPause() {
        // play video if it is paused.
        if(videoPlayer.paused) {
            videoPlayer.play();
            playPauseImg.setAttribute('src','./icons/pause.png');
        } else {
            // pause video if it is playing.
            videoPlayer.pause();
            playPauseImg.setAttribute('src','./icons/play.png');
        }
    }

    // this function fetches the src attribute of the current video being played.
    function getSrc() {
        const player = document.getElementById('vid');
        let src = player.getAttribute('src');
        return src;
    }

    playBtn.addEventListener('click',playPause);

    // reacting to some keyboard keys when they are pressed.
    window.addEventListener('keypress',function(e) {
        let pressedKey = e.key;
        if (pressedKey === ' ' || pressedKey === 'p') {
            // pause or play video when user presses spacebar or p.
            playPause();
        } else if (pressedKey === 'n') {
            // play next video when user presses n.
            seekNext();
        } else if (pressedKey === 'b') {
            // play previous video when user presses b.
            seekPrev();
        } else if (pressedKey === 'r') {
            // restart video when user presses r.
            videoPlayer.currentTime = 0.000;
        } else {
            return;
        }
    });

    prevBtn.addEventListener('click',seekPrev);

    // this function seeks the previous video.
    function seekPrev() {
        let currentSong = videos.indexOf(getSrc());
        if(currentSong == 0) {
            currentSong = videos.length - 1;
            videoPlayer.setAttribute('src',videos[currentSong]);
        } else {
            currentSong -= 1;
            videoPlayer.setAttribute('src',videos[currentSong]);
        }
        nowPlaying();
    }

    nextBtn.addEventListener('click',seekNext);

    // this function seeks the next video.
    function seekNext() {
        let currentSong = videos.indexOf(getSrc());
        if(currentSong == videos.length - 1) {
            currentSong = 0;
            videoPlayer.setAttribute('src',videos[currentSong]);
        } else {
            currentSong += 1;
            videoPlayer.setAttribute('src',videos[currentSong]);
        }
        nowPlaying();
    }

    const progressBar = document.querySelector('.progress-bar'),
          progress = document.querySelector('.progress');

    // listen to timeupdate on the video and update the status of the porgressbar.
    videoPlayer.addEventListener('timeupdate',() => {
        let totalTime = videoPlayer.duration;
        let currTime = videoPlayer.currentTime;
        if(currTime == totalTime) {
            seekNext();
        }
        let pctWidth = Math.round((currTime / totalTime) * 100);
        progress.style.width = pctWidth + '%';
    });

    // seek to a particular time when the user clicks on the progressbar.
    progressBar.addEventListener('click',function(e) {
        const calcWidth = (e.offsetX / this.clientWidth) * videoPlayer.duration;
        videoPlayer.currentTime = Math.round(calcWidth);
    });

    // get all the list of videos in the playlist.
    const playList = document.querySelectorAll('li.song');

    // play or pause video when user clicks on it in the playlist.
    playList.forEach(list => {
        list.addEventListener('click',() => {
            const currentVideo = getSrc(),
                  vidAttr = list.getAttribute('data-attr'),
                  vidSrc = './videos/' + vidAttr;
            if(vidSrc === currentVideo) {
                playPause();
            } else {
                videoPlayer.setAttribute('src',vidSrc);
            }
            nowPlaying();
        });
    });

    function nowPlaying() {
        let currentVideo = getSrc();
        playList.forEach(list => {
            let vidAttr = list.getAttribute('data-attr');
            if (currentVideo === './videos/' + vidAttr) {
                list.classList.add('now-playing');
            } else {
                list.classList.remove('now-playing');
            }
        });
    }

    nowPlaying();


});
