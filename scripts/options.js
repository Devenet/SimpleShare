var new_window = document.getElementById('new_window');
var shaarli_url = document.getElementById('shaarli_url');
var form = document.querySelector('button');

form.innerHTML = chrome.i18n.getMessage('global_save');
new_window.parentNode.querySelector('span').innerHTML = chrome.i18n.getMessage('settings_open_window');

if (localStorage['settings.shaarli.url']) {
  shaarli_url.value = localStorage['settings.shaarli.url'];
}
if (localStorage['settings.open.window']) {
  new_window.checked = localStorage['settings.open.window'];
}
form.addEventListener("click", function() {
  localStorage['settings.shaarli.url'] = shaarli_url.value;
  localStorage['settings.open.window'] = new_window.checked;
  return true;
});