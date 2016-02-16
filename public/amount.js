var mel = mel || {};

mel.amount = function(opts) {

  if (!opts.audioCtx) {
    throw new Error('mel.amount must be initialized with audioCtx');
  } else if (!opts.domNode) {
    throw new Error('mel.amount must be initialized with a domNode');
  } else {

    var audioCtx = opts.audioCtx;
    var domNode = opts.domNode;
    var gainNode = audioCtx.createGain();
    var amount = 0;

    var updateAmount = function() {
      gainNode.gain.value = amount;
    }

    var initNode = function() {
      return gainNode;
    }

    var view = function() {
      var slider = domNode.children[0];
      var bounds = domNode.getBoundingClientRect();

      var draggable = new Draggabilly(slider, {
        containment: domNode
      });

      draggable.on('dragMove', function(e, pointer, moveVector) {
        var y = pointer.pageY;
        if (y <= bounds.bottom && y >= bounds.top) {
          amount = 1.0 - ((y - bounds.top) / bounds.height);
          updateAmount();
        }
      });

      // makes sure amount is correctly set on mouse move is too fast.
      // lower bound is nonzero for oscilloscope.
      // TO DO: change 380px to rely on slider domNodes
      draggable.on('dragEnd', function(e, pointer) {
        if (slider.style.top === '380px') {
          amount = 0.0000000001;
          updateAmount();
        } else if (slider.style.top === '0px') {
          amount = 1.0;
          updateAmount();
        }
      });
    }

    updateAmount();
    view();

    return {
      initNode: initNode
    }
  }
}
