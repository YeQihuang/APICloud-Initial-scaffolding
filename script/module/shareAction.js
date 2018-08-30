function shareAction() {
    api.showProgress({
        title: "",
        modal: true
    });
    download('url', function (ret, err) {
        api.hideProgress();
        if (ret.state == 1) {
            var sharedModule = api.require('shareAction');
            sharedModule.share({
                text: '分享图片',
                type: 'image',
                images: [ret.savePath]
            });
        } else {

        }
    })

}