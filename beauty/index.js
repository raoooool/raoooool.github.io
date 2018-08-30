//Useragent test and judge
// alert(navigator.userAgent);
if (navigator.userAgent.search("MicroMessenger") != -1 || navigator.userAgent.search("QQ") != -1) {
    $("#useragent").show();
}

const getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

if (!getUserMedia) {
    alert("浏览器不支持,详情请点击“没调用摄像头？”查看。");
} else {
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: "user"
        },
        audio: false
    }).then((stream) => {
        $("#img_camera")[0].srcObject = stream;
        $("#img_camera")[0].play();
        $("#img_camera").show();
        $("#img_hint").hide();
    }, (err) => {
        alert(err);
    });
}

document.body.addEventListener('touchmove', (ev) => {
    ev.preventDefault();
}, false);

let echart = echarts.init($("#data_pie")[0]);
echart.showLoading({
    text: '',
    textColor: '#a9a9a9',
    maskColor: 'none',
    color: '#ee9ca7'
});

//修复播放按钮
// $("#btn_camera").on("click", () => {
//     $("#img_camera")[0].play();
// })

$('[data-toggle="popover"]').popover();

let ctx = $("#img_canvas")[0].getContext("2d");
let imgData = $("#img_canvas")[0].toDataURL("img/png").substr(22);

let interval = setInterval(() => {
    ctx.drawImage($("#img_camera")[0], 0, 0, 200, 150);
    imgData = $("#img_canvas")[0].toDataURL("img/png").substr(22);
}, 500);

$("#btn_submit").on("click", () => {
    $.ajax({
        url: "https://api-cn.faceplusplus.com/facepp/v3/detect",
        type: "POST",
        data: {
            api_key: "3xME1UDV5MLzVAmiSgT8Rq-CEVQWKMu6",
            api_secret: "6l2D14sgc91boa3I6CO-tixfn9fmDKCG",
            image_base64: imgData,
            return_landmark: 0,
            return_attributes: "gender,age,beauty"
        },
        success: (data) => {
            if (data.faces.length != 0) {
                $("#data_result").show();
            }
            console.log(data);
            if (data.faces[0].attributes.gender.value == "Male") {
                $("#user_gender").text("小哥哥");
            } else if (data.faces[0].attributes.gender.value == "Female") {
                $("#user_gender").text("小姐姐");
            } else {
                $("#user_gender").text("出错啦～");
            }

            $("#user_age").text(data.faces[0].attributes.age.value);
            echart.hideLoading();
            echart.setOption({
                title: {},
                tooltip: {},
                xAxis: {
                    data: ["男生打分", "女生打分", "满分"]
                },
                yAxis: {},
                series: [{
                    name: '分数',
                    type: 'bar',
                    data: [parseInt(data.faces[0].attributes.beauty.male_score + 20), parseInt(data.faces[0].attributes.beauty.female_score + 20), 100],
                    barMaxWidth: "50px",
                    label: {
                        show: true
                    }
                }],
                color: ["#ee9ca7"]
            });
        },
        error: (err) => {
            alert(err.statusText);
        }
    })
})