~function (pro) {
    function queryURL() {
        let reg = /([^?#&]+)=([^?#&]+)/g,
            result = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2]
        })
        return result;
    }

    pro.queryURL = queryURL;


}(String.prototype)

let start = (function () {
    let $start = $(".start").eq(0),
        $run = $start.find(".run").eq(0),
        imgList = ["img/icon.png", "img/music.jpg", "img/zf_concatAddress.png", "img/zf_concatInfo.png", "img/zf_concatPhone.png", "img/zf_course.png", "img/zf_course1.png", "img/zf_course2.png", "img/zf_course3.png", "img/zf_course4.png", "img/zf_course5.png", "img/zf_course6.png", "img/zf_cube1.png", "img/zf_cube2.png", "img/zf_cube3.png", "img/zf_cube4.png", "img/zf_cube5.png", "img/zf_cube6.png", "img/zf_cubeBg.jpg", "img/zf_cubeTip.png", "img/zf_emploment.png", "img/zf_messageArrow1.png", "img/zf_messageArrow2.png", "img/zf_messageChat.png", "img/zf_messageKeyboard.png", "img/zf_messageLogo.png", "img/zf_messageStudent.png", "img/zf_outline.png", "img/zf_phoneBg.jpg", "img/zf_phoneDetail.png", "img/zf_phoneListen.png", "img/zf_phoneLogo.png", "img/zf_return.png", "img/zf_styleTip1.png", "img/zf_styleTip2.png", "img/zf_teacherTip.png"],

        [total, cur] = [imgList.length, 0];

    function progress() {
        imgList.forEach(function (item) {
            let img = new Image();
            img.src = item;
            img.onload = function () {
                img = null;
                cur++;
                computer(cur);

            }
        })
    }

    function computer(cur) {
        let current = cur / total * 100 + "%";
        $run.css("width", current);
        if (cur >= total) {
            let timer = setTimeout(() => {
                $start.remove();
                answer.init();
                clearTimeout(timer);
            }, 1000)


        }

    }

    return {
        init: function () {
            $start.css("display", "block");
            progress();
        }
    }
})();

let answer = (function () {
    let $answer = $(".answer").eq(0),
        $listen = $answer.find(".listen").eq(0),
        $timeCount = $answer.find(".title-time").eq(0),
        $listenA = $listen.find("a").eq(0),
        $listening = $answer.find(".listening").eq(0),
        $listeningA = $listening.find("a").eq(0),
        answerBell = $answer.find("audio")[0],
        answerIntro = $answer.find("audio")[1],
        answerTimer = null;


    //标题上面的计时器
    let count = function () {
        $timeCount.css("display", "block");
        console.log(1);
        let duration = answerIntro.duration,
            cur = answerIntro.currentTime;
        answerTimer = setInterval(() => {
            cur = answerIntro.currentTime;
            let m = Math.floor(cur / 60),
                s = Math.floor(cur % 60);
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;
            console.log(m, s);
            $timeCount.html(m + ":" + s);
            if (answerIntro.ended) {
                clearTimeout(answerTimer);
                answerIntro.pause();
                listeningAF();
            }

        }, 1000)
    };
    // 接听中点击事件
    let listeningAF = function () {
        $answer.remove();
        message.init()

    }
    // 接听页面点击事件
    let listenAF = function () {
        $listen.remove();
        answerBell.pause();
        answerIntro.play();
        $listening.css({"transform": "translateY(0)", "display": "block"});
        count();
    }
    return {
        init: function () {
            $answer.css("display", "block");
            answerBell.play();
            $listen.css("transform", "translateY(0)");
            $listenA.singleTap(listenAF);
            $listeningA.singleTap(listeningAF);
        }
    }
})();
let message = (function () {
    let $message = $(".message").eq(0),
        $messageBox = $message.find(".message-box").eq(0),
        $liList = $messageBox.find("li"),
        $keyboard = $message.find(".message-keyboard").eq(0),
        talkText = $keyboard.find("span")[0],
        $btn = $keyboard.find("a"),
        audio = $message.find("audio")[0],
        messageTimer = null,
        step = 0;
    let talkRun = function () {
        let translateY = 0;
        messageTimer = setInterval(() => {
            step !== 3 ? $liList.eq(step).css({"opacity": "1", "transform": "translateY(0)"}) : null;
            step === 3 ? talking() : null;
            step++;

            if (step > 5) {
                translateY -= 2;
                $messageBox.css("transform", "translateY(" + translateY + "rem)");
            }
            if (step > $liList.length) {
                clearTimeout(messageTimer);
                $message.remove();
                cube.init();

            }
        }, 1000);
    }

    //第三幅图出现后的动作
    let talking = function () {
        clearInterval(messageTimer);
        $keyboard.css("transform", "translateY(0)");
        let text = talkText.dataset.talk,
            curStep = 0;
        let talkTimeout = setTimeout(() => {
            clearTimeout(talkTimeout);
            let talkTimer = setInterval(() => {
                talkText.innerHTML += text.charAt(curStep);
                curStep++;
                if (!text.charAt(curStep)) {
                    clearInterval(talkTimer);
                    $btn.css("display", "block");
                }
            }, 100)
        }, 500)

    };
    //点击发送按钮
    $btn.singleTap(() => {
        talkText.style.display = "none";
        $keyboard.css("transform", "translateY(3.7rem)");
        step--;
        $liList.eq(step).css({"opacity": "1", "transform": "translateY(0)"});
        step++;
        talkRun();
    })
    return {
        init: function () {
            $message.css("display", "block");
            audio.play();
            talkRun();
        }

    }
})();
let cube = (function () {
    let $cube = $(".cube"),
        $box = $cube.find("ul");

    let start = function (e) {
        let touch = e.touches[0];
        $box.attr({"startX": touch.clientX, "startY": touch.clientY});

    }
    let move = function (e) {
        let touch = e.touches[0],
            changeX = touch.clientX - $box.attr("startX"),
            changeY = touch.clientY - $box.attr("startY");
        $box.attr({"changeX": changeX, "changeY": changeY});
    }
    let end = function (e) {
        let changeX = $box.attr("changeX"),
            changeY = $box.attr("changeY"),
            rotateX = $box.attr("rotateX"),
            rotateY = $box.attr("rotateY");

        if (Math.abs(changeX) > 10 || Math.abs(changeY) > 10) {
            rotateX = rotateX - 0 - changeY / 3,
                rotateY = rotateY - 0 + changeX / 3;
            $box.attr({
                "rotateX": rotateX,
                "rotateY": rotateY
            });
            $box.css("transform", "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(.6)");

        }

    }
    return {
        init: function () {
            $cube.css("display", "block");
            $box.attr({
                "rotateX": 25,
                "rotateY": -20
            }).on({"touchstart": start, "touchmove": move, "touchend": end})
            $box.find("li").singleTap(function () {
                let index = $(this).index();
                $cube.css("display", "none")
                examples.init(index);
            })
        }
    }
})();
let examples = (function () {
    let $examples = $(".examples"),
        $comeBack = $examples.find(".come-back"),
        $makisu = $("#makisu"),
        slideExamples = null;
    let comeBack = function () {
        cube.init();
        $examples.css("display", "none");
    }
    let change = function (example) {
        let {slides: slidesAry, activeIndex} = example;
        if (slidesAry === 0) {
        } else {
        }

    }
    return {
        init: function (index = 0) {
            $examples.css("display", "block");

            if (!slideExamples) {
                $comeBack.singleTap(comeBack)
                slideExamples = new Swiper(".swiper-container", {
                    "effect": "coverflow",
                    "onTransitionEnd": change,
                    "onInit": change
                })
            }
            // index是索引，0是速度
            slideExamples.slideTo(index, 0)

        }
    }
})();
answer.init();
