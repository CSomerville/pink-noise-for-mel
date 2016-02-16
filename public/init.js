var mel = mel || {};

mel.init = function() {

  // initialize domNodes

  var microphoneDOM = getDomNode('microphone');
  var oscilloscopeDOM = getDomNode('oscilloscope');

  // initialize audio nodes

  var audioCtx = new AudioContext();
  var microphone, oscilloscope, pinkNoise;

  microphone = mel.microphone({
    audioCtx: audioCtx,
    domNode: microphoneDOM
  });

  oscilloscope = mel.oscilloscope({
    audioCtx: audioCtx,
    domNode: oscilloscopeDOM
  });

  pinkNoise = mel.pinkNoise({audioCtx: audioCtx});

  microphone.initNode(function(micStream) {
    pinkNoise.initNode().connect(oscilloscope.initNode());
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
