var items = { email:1, facebook:0, shaarli:0, twitter:1 };
items = !localStorage['settings.share.items'] ? items : JSON.parse(localStorage['settings.share.items']);

var links = document.querySelectorAll('.i18n-share a');
for (var i=0, l=links.length; i<l; i++) {
  var method = links[i].getAttribute('href').substring(1);

  // item enabled
  if (items[method]) {
    // translation
    links[i].innerHTML = chrome.i18n.getMessage('share_' + method);

    //listener
    links[i].addEventListener("click", function(event) {
      event.preventDefault();

      method = event.path[0].hash.substring(1);
      chrome.tabs.query({ active: true }, function (tabs) {
        var result = buildShareURL(method, tabs[0].url, tabs[0].title);
        var window_openable = method != 'email';
        if (result) {
          if (window_openable && localStorage['settings.open.window'] == "true") {
            chrome.windows.create( {
              url: result,
              type: "popup",
              width: 450,
              height: 450
            });
          }
          else { chrome.tabs.create({url: result}); }
        }
      });

      return true;
    });
  }
  // item disabled
  else {
    links[i].parentNode.style.display = 'none';
  }
}

function buildShareURL(method, url, title) {
  var result = null;
  switch(method) {
    case 'shaarli':
      if (!localStorage['settings.shaarli.url']) {
        var share_msg = document.getElementById('share-msg');
        share_msg.innerHTML = '<p>' + chrome.i18n.getMessage('share_shaarli_missing_url') + ' &#8227; <a href="'
          + chrome.extension.getURL('options.html')
          + '" target="_blank">' + chrome.i18n.getMessage('settings_name') + '</a></p>';
        break;
      }
      result = localStorage['settings.shaarli.url'] + '/?post=' + encodeURI(url)
        + '&title=' + encodeURI(title);
      break;

    case 'email':
      result = 'mailto:?' + 'subject=' + encodeURI(title) + '&body=' + encodeURI(url);
      break;

    case 'twitter':
      result = 'https://twitter.com/intent/tweet' + '?text=' + encodeURI(title)
        + '&url=' + encodeURI(url);
      break;

    case 'facebook':
      result = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURI(url)
        + '&t=' + encodeURI(title);
      break;
  }
  return result;
}