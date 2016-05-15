var mel = mel || {};

mel.init = function() {

  // initialize domNodes

  var microphoneDOM = getDomNode('microphone');
  var oscilloscopeDOM = getDomNode('oscilloscope');
  var masterVolumeDOM = getDomNode('master-volume');
  var micAmountDOM = getDomNode('mic-amount');
  var pinkAmountDOM = getDomNode('pink-amount');
  var navDom = getDomNode('nav');

  // initialize audio nodes

  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = new AudioContext();
  var microphone, oscilloscope, pinkNoise, masterVolume, nav;

  microphone = mel.microphone({
    audioCtx: audioCtx,
    domNode: microphoneDOM
  });

  oscilloscope = mel.oscilloscope({
    audioCtx: audioCtx,
    domNode: oscilloscopeDOM
  });

  pinkNoise = mel.pinkNoise({audioCtx: audioCtx});

  amplitudeDetector = mel.amplitudeDetector({audioCtx: audioCtx});

  masterVolume = mel.amount({
    audioCtx: audioCtx,
    domNode: masterVolumeDOM
  });

  micAmount = mel.amount({
    audioCtx: audioCtx,
    domNode: micAmountDOM
  });

  pinkAmount = mel.amount({
    audioCtx: audioCtx,
    domNode: pinkAmountDOM
  });

  nav = mel.nav({
    domNode: navDom
  });

  // async call to get usermedia (microphone) stream

  microphone.initNode(function(micStream) {

    // connect audio nodes

    var masterVolumeNode = masterVolume.initNode();
    var oscilNode = oscilloscope.initNode();
    var pinkNoiseNode = pinkNoise.initNode();
    var micAmountNode = micAmount.initNode();
    var pinkAmountNode = pinkAmount.initNode();
    var ampAnalyzerNode = amplitudeDetector.initAnalyzerNode();
    var ampGainNode = amplitudeDetector.initGainNode();

    micStream.connect(ampAnalyzerNode);
    micStream.connect(micAmountNode);
    micAmountNode.connect(masterVolumeNode);

    pinkNoiseNode.connect(ampGainNode);
    ampGainNode.connect(pinkAmountNode);
    pinkAmountNode.connect(masterVolumeNode);

    masterVolumeNode.connect(oscilNode);
    masterVolumeNode.connect(audioCtx.destination);
  });

  // animate

  var animate = function() {
    requestAnimationFrame(animate);
    oscilloscope.view();
  }

  animate();
}

// start app

window.onload = mel.init;

// utility functions

function getDomNode(id) {
  var node = document.getElementById(id);
  if (!node) {
    throw new Error('failed to get DOM node by id with ' + id);
  } else {
    return node;
  }
}
