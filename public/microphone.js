var mel = mel || {};

mel.microphone = function(opts) {

  if (!opts.audioCtx) {
    throw new Error('mel.microphone must be initialized with audioCtx');
  } else if (!opts.domNode) {
    throw new Error('mel.microphone must be initialized with a domNode');
  } else {

    var source;
    var audioCtx = opts.audioCtx;
    var domNode = opts.domNode;

    // to access client's microphone - browser implementations still vary
    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.msGetUserMedia);

    var initNode = function(cb) {
      if (navigator.getUserMedia) {
        navigator.getUserMedia( {video: false, audio: true}, function(stream) {
          source = audioCtx.createMediaStreamSource(stream);
          cb(source);
        }, function (err) {
          view(err.message);
        });


      // firefox implementation
      } else if (navigator.mediaDevices.getUserMedia) {

        navigator.mediaDevices.getUserMedia({audio: true, video: false})
          .then(function(stream) {
            window.doNotGC = audioCtx.createMediaStreamSource(stream); // works around firefox bug (stream gets garbage collected)
            source = window.doNotGC;
            cb(source);
          })
          .catch(function(err) {
            view(err.message);
          });

      } else {
        view('this browser does not support microphone access.');
      }
    }

    var view = function(msg) {
      domNode.textContent = msg;
    }

    return {
      initNode: initNode
    }
  }
}
