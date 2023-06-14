document.getElementById('settings-form').onsubmit = function(e){
    e.preventDefault();
    let maxTextSize = document.getElementById('maxTextSize').value;
    chrome.storage.sync.set({'maxTextSize': maxTextSize}, function() {
        console.log('Settings saved');
    });
}
