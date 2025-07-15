(function() {
  function onStylesReady() {
    document.body.style.visibility = '';
  }
  if (document.readyState === 'complete') {
    onStylesReady();
  } else {
    window.addEventListener('load', onStylesReady);
  }
})();
