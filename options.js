document.addEventListener("DOMContentLoaded", function() {
    // Load values from storage and set them in the form inputs
    chrome.storage.sync.get(['maxTextSize', 'trimmedTextTemplate'], function(result) {
      document.getElementById('maxTextSize').value = result.maxTextSize || '';
      document.getElementById('trimmedTextTemplate').value = result.trimmedTextTemplate || '';
    });
  });
  
  document.getElementById('settings-form').onsubmit = function(e) {
    e.preventDefault();
  
    // Get values from form inputs
    let maxTextSize = document.getElementById('maxTextSize').value;
    let trimmedTextTemplate = document.getElementById('trimmedTextTemplate').value;
  
    // Save values to storage
    chrome.storage.sync.set({'maxTextSize': maxTextSize, 'trimmedTextTemplate': trimmedTextTemplate}, function() {
      console.log('Settings saved');
    });
  };
  