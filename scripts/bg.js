var items = { email:1, facebook:0, shaarli:0, twitter:1 };
items = !localStorage['settings.share.items'] ? items : JSON.parse(localStorage['settings.share.items']);
var suggests = [];
for (var item in items) {
  if (items[item]) {
    suggests.push({ content: item, description: item + ' &#8227; ' + chrome.i18n.getMessage('share_' + item) });
  }
}


chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
  if (items.email) {
    var c = /email\s+.*/i.test(text) ? text : 'email ' + text;
    var d = 'email &#8227; ' + chrome.i18n.getMessage('share_email') + ( text.length > 0 ? ' to ' + text : c);

    console.log(c, d);

    suggests[0] = { content: c, description: d };
  }
  suggest(suggests);
});

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(function(text) {
  chrome.tabs.query({ active: true }, function (tabs) {
    var result;
    // when email, address can be given
    if (/email\s+\w+@\w+\.\w+/i.test(text)) {
      var address = /email\s+(\w+@\w+\.\w+)/i.exec(text)[1];
      text = 'email';
      result = buildShareURL(text, tabs[0].url, tabs[0].title);
      result = result.replace(/mailto:/i, 'mailto:' + address);
    }
    else {
      result = buildShareURL(text, tabs[0].url, tabs[0].title);
    }
    var window_openable = text != 'email';
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
    else { alert('Unknow command!'); }
  });
});


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