"use strict";

~function (pro) {
    function queryURL() {
        var reg = /([^?#&]+)=([^?#&]+)/g,
            result = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return result;
    }

    pro.queryURL = queryURL;
}(String.prototype);

var start = function () {
    var $start = $(".start").eq(0),
        $run = $start.find(".run").eq(0),
        srcList = ["img/ability1.png", "img/ability14.png", "img/ability2.png", "img/ability3.png", "img/ability5.png", "img/css3.png", "img/cubeBg.jpg", "img/cubeTip.png", "img/jquery.png", "img/messageArrow1.png", "img/messageArrow2.png", "img/messageChat.png", "img/messageKeyboard.png", "img/phoneBg.jpg", "img/phoneDetail.png", "img/phoneListen.png", "img/return.png", "img/wx-boss.png", "img/wx-zpp.jpg", "img/zpp_cube1.png", "img/zpp_cube2.png", "img/zpp_cube3.png", "img/zpp_cube4.png", "img/zpp_cube5.png", "img/zpp_cube6.png"],
        _ref = [srcList.length, 0],
        total = _ref[0],
        cur = _ref[1];


    function progress() {
        srcList.forEach(function (item) {
            var img=new Image;
            img.src=item;
            img.onload=function(){
                img = null;
                cur++;
                computer(cur);
            }
        })
    }
    function computer(cur) {
        var current = cur / total * 100 + "%";
        $run.css("width", current);
        if (cur >= total) {
            var timer = setTimeout(function () {
                $start.remove();
                answer.init();
                clearTimeout(timer);
            }, 1000);
        }
    }

    return {
        init: function init() {
            $start.css("display", "block");
            progress();
        }
    }
}();

var answer = function () {
    var $answer = $(".answer").eq(0),
        $listen = $answer.find(".listen").eq(0),
        $timeCount = $answer.find(".title-time").eq(0),
        $listenA = $listen.find("a").eq(0),
        $listening = $answer.find(".listening").eq(0),
        $listeningA = $listening.find("a").eq(0),
        answerBell = $answer.find("audio")[0],
        answerIntro = $answer.find("audio")[1],
        answerTimer = null;

    //标题上面的计时器
    var count = function count() {
        $timeCount.css("display", "block");

        var duration = answerIntro.duration,
            cur = answerIntro.currentTime;
        answerTimer = setInterval(function () {
            cur = answerIntro.currentTime;
            var m = Math.floor(cur / 60),
                s = Math.floor(cur % 60);
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;

            $timeCount.html(m + ":" + s);
            if (answerIntro.ended) {
                clearTimeout(answerTimer);
                answerIntro.pause();
                listeningAF();
            }
        }, 1000);
    };
    // 接听中点击事件
    var listeningAF = function listeningAF() {
        $answer.remove();
        message.init();
    };
    // 接听页面点击事件
    var listenAF = function listenAF() {
        $listen.remove();
        answerBell.pause();
        answerIntro.play();
        $listening.css({ "transform": "translateY(0)", "display": "block" });
        count();
    };
    return {
        init: function init() {
            $answer.css("display", "block");
            answerBell.play();
            $listen.css("transform", "translateY(0)");
            $listenA.click(listenAF);
            $listeningA.click(listeningAF);
        }
    };
}();
var message = function () {
    var $message = $(".message").eq(0),
        $messageBox = $message.find(".message-box").eq(0),
        $liList = $messageBox.find("li"),
        $keyboard = $message.find(".message-keyboard").eq(0),
        talkText = $keyboard.find("span")[0],
        $btn = $keyboard.find("a"),
        audio = $message.find("audio")[0],
        messageTimer = null,
        step = 0;
    var talkRun = function talkRun() {
        var translateY = 0;
        messageTimer = setInterval(function () {
            step !== 3 ? $liList.eq(step).css({ "opacity": "1", "transform": "translateY(0)" }) : null;
            step === 3 ? talking() : null;
            step++;

            if (step > 4) {
                translateY -= 2;
                $messageBox.css("transform", "translateY(" + translateY + "rem)");
            }
            if (step >= $liList.length) {
                clearTimeout(messageTimer);
                var timer = setTimeout(function () {
                    $message.remove();
                    cube.init();
                    clearTimeout(timer);
                }, 3000);
            }
        }, 1000);
    };

    //第三幅图出现后的动作
    var talking = function talking() {
        clearInterval(messageTimer);
        $keyboard.css("transform", "translateY(0)");
        var text = talkText.dataset.talk,
            curStep = 0;
        var talkTimeout = setTimeout(function () {
            clearTimeout(talkTimeout);
            var talkTimer = setInterval(function () {
                talkText.innerHTML += text.charAt(curStep);
                curStep++;
                if (!text.charAt(curStep)) {
                    clearInterval(talkTimer);
                    $btn.css("display", "block");
                }
            }, 100);
        }, 500);
    };
    //点击发送按钮
    $btn.click(function () {
        talkText.style.display = "none";
        $keyboard.css("transform", "translateY(3.7rem)");
        step--;
        $liList.eq(step).css({ "opacity": "1", "transform": "translateY(0)" });
        step++;
        talkRun();
    });
    return {
        init: function init() {
            $message.css("display", "block");
            audio.play();
            talkRun();
        }

    };
}();
var cube = function () {
    var $cube = $(".cube"),
        $box = $cube.find("ul");

    var start = function start(e) {
        var touch = e.touches[0];
        console.log(e);
        $box.attr({ "startX": touch.clientX, "startY": touch.clientY });
        e.preventDefault();
    };
    var move = function move(e) {
        var touch = e.touches[0],
            changeX = touch.clientX - $box.attr("startX"),
            changeY = touch.clientY - $box.attr("startY");
        $box.attr({ "changeX": changeX, "changeY": changeY });
        e.preventDefault();
    };
    var end = function end(e) {
        e.preventDefault();
        var changeX = $box.attr("changeX"),
            changeY = $box.attr("changeY"),
            rotateX = $box.attr("rotateX"),
            rotateY = $box.attr("rotateY");

        if (Math.abs(changeX) > 10 || Math.abs(changeY) > 10) {
            rotateX = rotateX - 0 - changeY / 3, rotateY = rotateY - 0 + changeX / 3;
            $box.attr({
                "rotateX": rotateX,
                "rotateY": rotateY
            });
            $box.css("transform", "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) ");
        }
    };
    return {
        init: function init() {
            $cube.css("display", "block");
            $box.attr({
                "rotateX": 25,
                "rotateY": -20
            }).on({ "touchstart": start, "touchmove": move, "touchend": end });
            $(window).on("touchstart touchmove touchend",function(e){e.preventDefault();})
            $box.find("li").click(function () {
                var index = $(this).index();
                $cube.css("display", "none");
                details.init(index);
            });
        }
    };
}();
var details = function () {
    var $details = $(".details"),
        $comeBack = $details.find(".come-back"),
        slideExamples = null;
    var comeBack = function comeBack() {
        cube.init();
        $details.css("display", "none");
    };

    var change = function change(example) {
        var slides = example.slides,
            activeIndex = example.activeIndex;
        $(slides[activeIndex]).addClass("active").siblings().removeClass("active")
    };
    return {
        init: function init() {
            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            $details.css("display", "block");
            if (!slideExamples) {
                $comeBack.click(comeBack);
                slideExamples = new Swiper(".swiper-container", {
                    "effect": "coverflow",
                    mousewheel: true,
                    on:{
                        init: function() {
                            this.myIndex = 0;//activeIndex在滑动到一半时会切换，改用滑动完再切换的myIndex
                        },
                        progress: function() {
                            for (var i = 0; i < this.slides.length; i++) {
                                var slide=this.slides.eq(i);
                                var progress = this.slides[i].progress;
                                var translate, boxShadow;
                                translate = progress * this.height * 0.8;
                                scale = 1 - Math.min(Math.abs(progress * 0.2), 1);
                                if (i == this.myIndex) {
                                    slide.transform('translate3d(0,' + (translate) + 'px,0) scale(' + scale + ')');
                                    slide.css({'z-index':0,'boxShadow':'0px 0px 10px rgba(0,0,0,.5)'});
                                }
                            }
                        },
                        transitionEnd: function() {
                            this.myIndex = this.activeIndex;
                            for (var i = 0; i < this.slides.length; i++) {
                                var slide=this.slides.eq(i);
                                slide.transform('');
                                slide.css('z-index',1);
                            }
                            this.mousewheel.enable();
                        },
                        setTransition: function(speed) {
                            for (var i = 0; i < this.slides.length; i++) {
                                var slide=this.slides.eq(i);
                                slide.transition(speed + 'ms');
                            }
                            this.mousewheel.disable();
                        }
                    }
                });
            }
            slideExamples.slideTo(index, 0);
        }
    };
}();
start.init();
