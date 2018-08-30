var host = "https://www.baidu.com";

function AJ(data) {
  alert(JSON.stringify(data, null, 2));
}

function httpError(err) {
  AJ(err.msg);
}

function httpErrorCode(ret) {
  alert(ret.msg);
  switch (ret.code) {
    case 4000:
      api.openWin({
        name: "login",
        url: "login.html"
      });
      break;
    default:
  }
}

function ajax(data, backcall) {
  api.showProgress({
    title: "",
    modal: true
  });
  api.ajax(data, function (ret, err) {
    api.hideProgress();
    if (!ret) {
      httpError(err);
      return;
    }
    if (ret.code != 0) {
      httpErrorCode(ret);
      return;
    }
    backcall(ret);
  });
}

function httpPost(url, data, backcall) {
  ajax({
    url: host + "/" + url,
    method: "post",
    dataType: "json",
    data: {
      values: data
    }
  }, backcall);
}

function httpGet(url, data, backcall) {
  ajax({
    url: host + "/" + url,
    method: "get",
    dataType: "json",
    data: {
      values: data
    }
  }, backcall);
}

function httpFile(url, data, files, backcall) {
  ajax({
    url: host + "/" + url,
    method: "post",
    dataType: "json",
    data: {
      values: data,
      files: files
    }
  }, backcall);
}

function upload(files, data, backcall) {
  api.showProgress({
    title: "上传中",
    modal: true
  });
  httpFile("/api/upload", data, files, backcall);
}

function download(url, backcall) {
  api.download({
    url: host + '/api/member/qrCode',
  }, function (ret, err) {
    backcall(ret, err)
  });
}