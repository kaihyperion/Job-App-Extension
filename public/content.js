/*global chrome*/

// Function to capture all form fields on the page
function captureFormFields() {
  const inputs = document.querySelectorAll("input, textarea, select");
  const fields = Array.from(inputs).map(input => {
      return {
          tag: input.tagName,
          name: input.name || null,
          id: input.id || null,
          placeholder: input.placeholder || null,
          type: input.type || null,
          label: input.labels ? input.labels[0]?.innerText : null
      };
  });
  return fields;
}

// Listener for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureFields") {
      console.log('Message received in content script: capturing form fields');
      const formFields = captureFormFields();
      sendResponse({ fields: formFields });
  }
});