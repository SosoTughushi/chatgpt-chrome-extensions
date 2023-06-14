console.log("Initializing text limiter.");
let maxTextSize;

// Fetch maxTextSize from storage
chrome.storage.sync.get(['maxTextSize'], function(result) {
  maxTextSize = result.maxTextSize || 5000;
  console.log("MaxTextSize = " + maxTextSize);
});

// Function to handle keydown events on textarea
function handleKeydown(e) {
  if (e.key == 'Enter' && !e.shiftKey) {
    let text = $(this).val();
    let words = text.match(/\b[-?(\w+)?]+\b/gi);
    if (words && words.length > maxTextSize) {
      let textToSubmit = words.slice(0, maxTextSize).join(' ');
      $(this).val(textToSubmit);
      let textToClipboard = words.slice(maxTextSize).join(' ');
      console.log("Text length over "+maxTextSize+"! Submitting first "+maxTextSize+" words, copying remaining words to clipboard.");
      // Send textToSubmit to ChatGPT API
      navigator.clipboard.writeText(textToClipboard);
    } else {
      console.log("Word count:", words ? words.length : 0);
      // Send text to ChatGPT API
    }
  }
}

// Function to handle mutations
function handleMutations(mutations) {
  let textarea = $('#prompt-textarea');
  if (textarea.length) {
    console.log('Textarea found:', textarea);
    textarea.on('keydown', handleKeydown);
    this.disconnect();  // stop observing once we've found the textarea and set up the event listener
  }
}

$(document).ready(function() {
  let observer = new MutationObserver(handleMutations);
  observer.observe(document.body, { childList: true, subtree: true });  // observe changes to the body and its descendants
});
