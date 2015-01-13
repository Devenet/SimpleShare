var links = document.querySelectorAll("li a");
for (var i=0, l=links.length; i<l; i++) {
  var method = links[i].getAttribute('href').substring(1);

  // translation
  links[i].innerHTML = chrome.i18n.getMessage('share_' + method);

  //listener
  links[i].addEventListener("click", function(event) {

    method = event.path[0].hash.substring(1);
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var result;
      var url = tabs[0].url;
      var title = tabs[0].title;

      switch(method) {
        case 'shaarli':
          if (!localStorage['settings.shaarli.url']) {
            alert('Merci de configurer l\'URL du Shaarli.');
            break;
          }
          result = localStorage['shaarli.url'] + '/?post=' + encodeURI(url)
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

      if (result) {
        if (localStorage['settings.open.window']) {
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
  });
}