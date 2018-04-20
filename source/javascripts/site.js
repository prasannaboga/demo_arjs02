$(document).ready(function () {
  try {
    window.selectedCamera = '';
    navigator.mediaDevices.enumerateDevices()
      .then(function (result) {
        var videoDevices = [];
        $(result).each(function (i, videoDevice) {
          if (i === 0) {
            window.selectedCamera = videoDevice;
          }
          if (videoDevice.kind === 'videoinput') {
            videoDevices.push(videoDevice);
            $('#listCameras').append($("<option>", {value: videoDevice.deviceId, html: videoDevice.label}));
          }
        });
        //console.log(videoDevices);
      })
      .catch(function (error) {
        alert(error.message);
        console.error(error);
      });
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
});
