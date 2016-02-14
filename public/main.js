// the pink noise implementation is Zach Denton's:
// http://noisehack.com/generate-noise-web-audio-api/


window.onload = init;

function init() {
  mel = noisy();
  mel.sing();
  mel.animate();
}

function noisy() {
  var audioCtx = audioCtx || new AudioContext;
  var bufferSize = 4096;

  var canvas = document.getElementById('oscilloscope');
  var toAnimate = [];

  var pinkNoise = function pinkNoise() {
    var b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    var node = audioCtx.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = function(e) {
      var output, white;
      output = e.outputBuffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }
    }
    return node;
  }

  var oscilloscopeInit = function oscilloscopeInit(canvas) {
    // takes canvas DOM element. Returns a web audio analyzer node as well
    // as a draw function.
    var analyzer, bufferLength, dataArray, canvasCtx;

    analyzer = audioCtx.createAnalyser();
    analyzer.fftsize = 4096;
    bufferLength = analyzer.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    canvasCtx = canvas.getContext('2d');

    var draw = function draw() {
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
      analyzer: analyzer,
      draw: draw
    }
  }

  return {
    sing: function sing() {
      var pink = pinkNoise();
      var oscilloscope = oscilloscopeInit(canvas);
      toAnimate.push(oscilloscope.draw);

      pink.connect(oscilloscope.analyzer);
      pink.connect(audioCtx.destination);
    },

    animate: function animate() {
      requestAnimationFrame(animate);
      for (var i = 0; i < toAnimate.length; i++) {
        toAnimate[i]();
      }
    }
  }
}
