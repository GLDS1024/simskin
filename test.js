var yt_players = [];
document.addEventListener('DOMContentLoaded', function () {
    var swiper = new Swiper(".mainBnr .swiper", {
        slidesPerView: 1,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        on: {
            init: function () {
                console.log('init');
            },
            slideChange: function () {

                let currentSlide = this.slides[this.activeIndex];
                slide = this.activeIndex + 1;
                if (this.slides.length == slide) {
                    slide = 0;
                }
                console.log(slide);
                let width = $(document).width();
                let name = 'iframe.pc';
                if (width < 769) {
                    name = 'iframe.mo';
                }
                let iframe = currentSlide.querySelector(name);

                if (iframe) {
                    // autoplay를 정지합니다.
                    this.autoplay.stop();
                    if (iframe.getAttribute('src').search('vimeo') > 0) {
                        console.log(iframe);

                    }
                    if (iframe.getAttribute('src').search('youtube') > 0) {
                        console.log(iframe);
                        iframe.data('yt_player').playVideo();
                    }
                } else {
                    this.autoplay.start();
                }

            }
        }
    });



    function initializePlayers() {
        // Initialize YouTube Players
        let youtubePlayers = document.querySelectorAll('.youtube-play');
        youtubePlayers.forEach(initYouTubePlayer);
        // Initialize Vimeo Players
        let vimeoPlayers = document.querySelectorAll('.vimeo-play');
        vimeoPlayers.forEach(initVimeoPlayer);
    }

    var isVpaly = false;
    var isVmplay = false;
    var isPcPlay = false;
    var isMoPlay = false;
    var durationPc = 0;
    var durationMc = 0;
    var slide = 0;

    function initYouTubePlayer(element) {
        element.parentNode.parentNode.removeChild(element.parentNode.nextSibling);
        const videoId = element.getAttribute('videoid');
        var $iframe = $(element);
        YT.Player(element, {
            height: '1080',
            width: '1920',
            videoId: videoId,
            playerVars: {
                autoplay: true,
                mute: 1,
                controls: 0,
                enablejsapi: 1,
                modestbranding: 1,
                loop: 0,
                playlist: videoId,
                rel: 0
            },
            events: {
                onReady: (event) => {
                    console.log('Youtube video is now loaded.');
                    yt_players.push(event.target);
                    $iframe.data('yt_player', event.target);
                    event.target.setVolume(0); // 최초 볼륨 크기
                    event.target.playVideo();
                    event.target.seekTo(0);
                },
                onStateChange: (event) => {
                    if (event.data === YT.PlayerState.ENDED && isPcPlay) {
                        console.log('Youtube Pc video stop.');
                        swiper.slideTo(slide);
                        isPcPlay = false;
                    }
                }
            }
        });

    }

    function initVimeoPlayer(element) {
        element.parentNode.parentNode.removeChild(element.parentNode.nextSibling);
        let videoId = element.getAttribute('videoid');
        let options = {
            id: videoId,
            width: 1920,
            loop: false,
            autoplay: true,
            muted: true,
            background: true
        };

        let vp = new Vimeo.Player(element, options);
        vp.ready().then(function () {
            // the player is ready
            let op = document.querySelectorAll('.vimeo-play')
            op.forEach(function (el) {
                if (el.tagName == "DIV") {
                    el.firstChild.setAttribute('class', el.getAttribute('class'));
                    el.parentNode.appendChild(el.firstChild);
                    el.parentNode.removeChild(el);
                }
            });
        });

    }

    // YouTube Iframe API is ready
    window.onYouTubeIframeAPIReady = initializePlayers;
});
