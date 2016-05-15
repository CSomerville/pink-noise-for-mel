var mel = mel || {};

mel.nav = function(opts) {
  if (!opts.domNode) {
    throw new Error('mel.nav must be initialized with a domNode');
  } else {

    var domNode = opts.domNode;
    var about = document.getElementById('about');
    var pinkNoise = document.getElementById('pink-noise-for-mel');
    var navAbout = document.getElementById('nav-about');
    var navPink = document.getElementById('nav-pink');

    about.style.display = "none";

    navAbout.addEventListener('click', function() {
      about.style.display = "";
      pinkNoise.style.display = "none";
    });

    navPink.addEventListener('click', function() {
      pinkNoise.style.display = "";
      about.style.display = "none";
    });
  }
}
