
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
                isVpaly = false;
                isVmplay = false;
                isMoPlay = false;
                isPcPlay = false;
                if (vimeoPcObj) vimeoPcObj.setCurrentTime(0);
                if (vimeoMoObj) vimeoMoObj.setCurrentTime(0);
                if (youtubePcObj) youtubePcObj.seekTo(0);
                if (youtubeMoObj) youtubeMoObj.seekTo(0);

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
                        if (name == "iframe.pc") {

                            vimeoPcObj.play()
                            isVpaly = true;

                        } else {
                            vimeoMoObj.play()
                            isVmplay = true;

                        }

                    }
                    if (iframe.getAttribute('src').search('youtube') > 0) {
                        if (name == "iframe.pc") {
                            youtubePcObj.playVideo();
                            isPcPlay = true;
                        } else {
                            youtubeMoObj.playVideo();
                            isMoPlay = true;
                        }
                    }
                } else {
                    this.autoplay.start();
                }

            }
        }
    });

    $(window).resize(function () {
        //if($(window).width() < 768) {
        swiper.slideTo(0);
        //} 
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
    var youtubePcObj;
    var youtubeMoObj;
    var vimeoPcObj;
    var vimeoMoObj;
    var durationPc = 0;
    var durationMc = 0;
    var slide = 0;
    function initYouTubePlayer(element) {
        element.parentNode.parentNode.removeChild(element.parentNode.nextSibling);
        const videoId = element.getAttribute('videoid');
        const classname = element.getAttribute('class');
        var $iframe = $(element);
        if (classname == "youtube-play pc") {
            youtubePcObj = new YT.Player(element, {
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
        } else {
            youtubeMoObj = new YT.Player(element, {
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
                        event.target.setVolume(0); // 최초 볼륨 크기
                        event.target.playVideo();
                        event.target.seekTo(0);
                    },
                    onStateChange: (event) => {
                        if (event.data === YT.PlayerState.ENDED && isMoPlay) {
                            console.log('Youtube Mo video  stop.');
                            swiper.slideTo(slide);
                            isMoPlay = false;
                        }
                    }
                }
            });
        }
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
        const classname = element.getAttribute('class');
        var $iframe = $(element);
        if (classname == "vimeo-play pc") {
            vimeoPcObj = new Vimeo.Player(element, options);
            vimeoPcObj.ready().then(function () {
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
            vimeoPcObj.getDuration().then(function (d) {
                // duration = the duration of the video in seconds
                durationPc = d;
            })
            // 비디오 재생이 끝나면 다음 슬라이드로 넘어갑니다.
            vimeoPcObj.on("ended", function () {
                // 다음 슬라이드로 넘어가고 autoplay를 재개합니다.
                if (isVpaly) {
                    vimeoPcObj.setCurrentTime(durationPc - 1)
                    swiper.slideTo(slide);
                    console.log('Vimeo pc video is stop.');
                    isVpaly = false;
                }
            });
        } else {
            vimeoMoObj = new Vimeo.Player(element, options);
            vimeoMoObj.ready().then(function () {
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
            vimeoMoObj.getDuration().then(function (d) {
                // duration = the duration of the video in seconds
                durationMc = d;
            })
            // 비디오 재생이 끝나면 다음 슬라이드로 넘어갑니다.
            vimeoMoObj.on("ended", function () {
                // 다음 슬라이드로 넘어가고 autoplay를 재개합니다.
                if (isVmplay) {
                    vimeoMoObj.setCurrentTime(durationMc - 1)
                    swiper.slideTo(slide);
                    console.log('Vimeo mo video is stop.');
                    isVmplay = false;
                }

            });
        }


    }

    // YouTube Iframe API is ready
    window.onYouTubeIframeAPIReady = initializePlayers;
});
