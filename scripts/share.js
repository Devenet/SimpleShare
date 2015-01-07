var links = document.querySelectorAll("li a");
for (var i=0, l=links.length; i<l; i++) {
  var method = links[i].getAttribute('href').substring(1);

  // translation
  links[i].innerHTML = chrome.i18n.getMessage('share_' + method);

  //listener
  links[i].addEventListener("click", function() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var result;
      var url = tabs[0].url;
      var title = tabs[0].title;

      switch(method) {
        case 'shaarli':
          if (!localStorage['shaarli.url']) {
            alert('Merci de configurer l\'URL du Shaarli.');
            break;
          }
          result = localStorage['shaarli.url'] + "/?post=" + url
            + "&title=" + title;
          break;

        case 'email':
          result = "mailto:?" + "subject=" + title + "&body=" + url;
          break;
      }

      if (result) {
        chrome.tabs.create({url: encodeURI(result)});
      }
    });
  });
}