var mel = mel || {};

mel.amplitudeDetector = function(opts) {

  if (!opts.audioCtx) {
    throw new Error('mel.amplitudeDetector must be initialized with audioCtx');
  } else {


    var audioCtx = opts.audioCtx;

    var analyzer, gain, amount, processor;

    amount = 0.0;

    analyzer = audioCtx.createAnalyser();
    analyzer.fftsize = 1028;
    analyzer.smoothingTimeConstant = 0.3;
    bufferLength = analyzer.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    gain = audioCtx.createGain();

    processor = audioCtx.createScriptProcessor(2048, 1, 1);

    analyzer.connect(processor);
    processor.connect(audioCtx.destination);

    processor.onaudioprocess = function() {
      var average;
      var sum = 0;

      analyzer.getByteFrequencyData(dataArray);

      for (var i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }

      average = sum / dataArray.length;
      amount = average / 150.0
      updateGainNode();
    }

    var initAnalyzerNode = function() {
      return analyzer;
    }

    var initGainNode = function() {
      return gain;
    }

    var updateGainNode = function() {
      gain.gain.value = amount;
    }

    updateGainNode();

    return {
      initAnalyzerNode: initAnalyzerNode,
      initGainNode: initGainNode
    }
  }
}
