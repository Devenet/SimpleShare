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
    suggests[0] = {content: 'email ' + text,
    description: 'email &#8227; ' + chrome.i18n.getMessage('share_email') + ' to ' + text };
  }
  suggest(suggests);
});

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(function(text) {
  alert('You could soon share with omnibox!');
});