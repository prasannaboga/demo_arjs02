$(document).ready(function () {
  if (false) {
    try {
      window.selectedCamera = '';
      navigator.mediaDevices.enumerateDevices()
        .then(function (result) {
          videoDevices = [];
          $(result).each(function (i, videoDevice) {
            if (videoDevice.kind === 'videoinput') {
              window.selectedCamera = videoDevice;
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
  }

});
