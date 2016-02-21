var mel = mel || {};

mel.oscilloscope = function(opts) {

  if (!opts.audioCtx) {
    throw new Error('mel.oscilloscope must be initialized with audioCtx');
  } else if (!opts.domNode || opts.domNode.tagName !== 'CANVAS') {
    throw new Error('mel.oscilloscope must be initialized with a canvas domNode');
  } else {

    var audioCtx = opts.audioCtx;
    var canvas = opts.domNode;

    var analyzer, bufferLength, dataArray, canvasCtx;

    analyzer = audioCtx.createAnalyser();
    analyzer.fftsize = 4096;
    bufferLength = analyzer.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    canvasCtx = canvas.getContext('2d');

    var initNode = function() {
      return analyzer;
    }

    var view = function() {

      var sliceWidth, x, y, v;

      analyzer.getByteTimeDomainData(dataArray);

      // clear canvas
      canvasCtx.fillStyle = 'pink';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      // init draw
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'black';
      canvasCtx.beginPath();

      sliceWidth = canvas.width * 1.0 / bufferLength;
      x = 0;

      for (var i = 0; i < bufferLength; i++) {
        v = dataArray[i] / 128.0;
        y = v * canvas.height - canvas.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
    }

    return {
      initNode: initNode,
      view: view
    }
  }
}
