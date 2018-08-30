function decodeImgToBase64(src, fun) {

    api.showProgress({
        title: "",
        modal: true
    });

    var trans = api.require("trans");

    trans.decodeImgToBase64({
            imgPath: src
        },
        function (ret, err) {
            api.hideProgress();
            if (ret.status) {
                fun(ret);
            } else {
                api.hideProgress();
                alert(JSON.stringify(err));
            }
        }
    );
}

/**
 * @method
 * @param {string} src 文件地址
 * @param {string} suffix 文件后缀
 * @param {int} size 文件大小
 * @param {function} backcall 回调
 * @desc 根据目标对象获取运营商
 */
function converted_base64_img_upload(src, suffix, size, backcall) {
    if (size > 1024 * 1024 * 1) {
        decodeImgToBase64(src, function (ret) {
            var base64Str = "data:image/" + suffix + ";base64," + ret.base64Str;
            compressPhoto(base64Str, function (base) {
                httpPost(
                    "/api/base64_upload", {
                        base64_file: base,
                        base64_file_name: src.substring(src.lastIndexOf("/") + 1)
                    },
                    function (res) {
                        backcall(res);
                    }
                );
            });
        });
    } else {
        upload({
            file: src
        }, {}, function (ret) {
            backcall(ret);
        });
    }
}

function compressPhoto(imgBase64Str, fun) {
    var img = new Image();

    // 缩放图片需要的canvas
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    // base64地址图片加载完毕后
    img.onload = function () {
        // 图片原始尺寸
        var originWidth = this.width;
        var originHeight = this.height;
        // 目标尺寸
        var targetWidth = originWidth,
            targetHeight = originHeight;
        // var targetWidth = originWidth*3/4, targetHeight = originHeight*3/4;
        var maxWidth = 1280,
            maxHeight = 1280;
        if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
            } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
            }
        }
        // canvas对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight);

        var base = canvas.toDataURL("image/jpeg", 0.7); //canvas转码为base64
        fun(base); //返回处理
    };

    img.src = imgBase64Str;
}