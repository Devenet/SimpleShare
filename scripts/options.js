var shaarli_url = document.getElementById('shaarli_url');
if (localStorage['shaarli.url']) {
  shaarli_url.value = localStorage['shaarli.url'];
}

var form = document.querySelector('button');
form.innerHTML = chrome.i18n.getMessage('global_save');
form.addEventListener("click", function() {
  localStorage['shaarli.url'] = shaarli_url.value;
  return true;
});