var new_window = document.getElementById('new_window');
var shaarli_url = document.getElementById('shaarli_url');
var share_items = document.querySelectorAll('.i18n-item');
var more_shaarli = document.getElementById('more_shaarli');
var form_msg = document.getElementById('form_msg');
var items = { email:1, facebook:0, shaarli:0, twitter:1 };
var close_btn = document.getElementById('i18n-close');

// translation
document.querySelector('h1').innerHTML = chrome.i18n.getMessage('settings_name');
document.getElementById('i18n-services').innerHTML = chrome.i18n.getMessage('settings_services');
document.getElementById('i18n-advanced').innerHTML = chrome.i18n.getMessage('settings_advanced');
document.getElementById('i18n-save').innerHTML = chrome.i18n.getMessage('global_save');
close_btn.innerHTML = chrome.i18n.getMessage('global_close');

for (var i=0, l=share_items.length; i<l; i++) {
  share_items[i].querySelector('span').innerHTML = chrome.i18n.getMessage(share_items[i].getAttribute('for'));
}
new_window.parentNode.querySelector('span').innerHTML = chrome.i18n.getMessage('settings_open_window');

// utils
function loadData() {
  items = !localStorage['settings.share.items'] ? items : JSON.parse(localStorage['settings.share.items']);

  for (var i=0, l=share_items.length; i<l; i++) {
    share_items[i].querySelector('input').checked = items[share_items[i].getAttribute('for').substring(6)];
  }

  more_shaarli.style.display = items['shaarli'] ? 'block' : 'none';
  shaarli_url.required = items['shaarli'];
  if (localStorage['settings.shaarli.url']) {
    shaarli_url.value = localStorage['settings.shaarli.url'];
  }
  if (localStorage['settings.open.window']) {
    new_window.checked = localStorage['settings.open.window'] == "true";
  }
}

function saveData() {
  for (var i=0, l=share_items.length; i<l; i++) {
    items[share_items[i].getAttribute('for').substring(6)] = share_items[i].querySelector('input').checked;
  }
  localStorage['settings.share.items'] = JSON.stringify(items);
  localStorage['settings.shaarli.url'] = shaarli_url.value;
  localStorage['settings.open.window'] = new_window.checked;
}

// load and save data
document.addEventListener('DOMContentLoaded', loadData);
document.addEventListener("submit", function(e) {
  e.preventDefault();

  saveData();
  form_msg.textContent = chrome.i18n.getMessage('global_saved');
  setTimeout(function() { form_msg.textContent = ''; }, 3500);

  return false;
});

// listeners
close_btn.addEventListener('click', function() {
  window.close();
});
document.getElementById('share_shaarli').addEventListener('change', function() {
  more_shaarli.style.display = this.checked ? 'block' : 'none';
  shaarli_url.required = this.checked;
});
