console.log("Initializing text limiter.");
let maxTextSize;

// Fetch maxTextSize from storage
chrome.storage.sync.get(['maxTextSize'], function(result) {
  maxTextSize = result.maxTextSize || 5000;
  console.log("MaxTextSize = " + maxTextSize);
});

let trimmedTextTemplate;
// Fetch trimmedTextTemplate from storage
chrome.storage.sync.get(['trimmedTextTemplate'], function(result) {
  trimmedTextTemplate = result.trimmedTextTemplate || "{0} \n I will provide continuation of this in next message. For now, reply with 'READ'";
  console.log("trimmedTextTemplate = " + trimmedTextTemplate);
});

// Function to handle keydown events on textarea
function handleKeydown(e) {
  if (e.key == 'Enter' && !e.shiftKey) {
      trimText();
  }
}

let observer; // Declare observer here


function trimText() {
  let textarea = $('#prompt-textarea');
  let text = textarea.val();
  if (text && text.length > maxTextSize) {
      let lastSpacePosition = text.lastIndexOf(" ", maxTextSize);
      let textToSubmit = text.substring(0, lastSpacePosition);
      // Apply template here
      textToSubmit = trimmedTextTemplate.replace('{0}', textToSubmit);
      textarea.val(textToSubmit);
      let textToClipboard = text.substring(lastSpacePosition + 1);
      console.log(`Text length over ${maxTextSize}! Submitting first ${maxTextSize} characters, copying remaining characters to clipboard.`);
      // Send textToSubmit to ChatGPT API
      navigator.clipboard.writeText(textToClipboard);
  } else {
      console.log("Character count:", text ? text.length : 0);
      // Send text to ChatGPT API
  }
}

// Function to handle mutations
function handleMutations(mutations) {
  let textarea = $('#prompt-textarea');
  if (textarea.length) {
    console.log('Textarea found:', textarea);
    textarea.on('keydown', handleKeydown);

    // Get the parent div of the textarea and find the button inside it
    let button = textarea.parent().find('button');
    if (button.length) {
      console.log('Button found:', button);
      button.on('mousedown', function(e) {
        setTimeout(trimText, 0);
      });
    }

    this.disconnect();  // stop observing once we've found the textarea and set up the event listener
  }
}

$(document).ready(function() {
  observer = new MutationObserver(handleMutations); // Now observer is defined before we use it
  observer.observe(document.body, { childList: true, subtree: true });  // observe changes to the body and its descendants
});
