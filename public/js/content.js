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
          label: getLabelText(input)
      };
  });
  
  return fields;
}


// Helper function to get the label text associated with an input field
function getLabelText(input) {
  if (input.labels && input.labels.length > 0) {
      return input.labels[0].innerText.trim();
  }
  const label = input.closest('label') || document.querySelector(`label[for='${input.id}']`);
  return label ? label.innerText.trim() : null;
}

// Helper function to normalize the string by keeping it lowercased and no space
function normalizeString(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Function to fill a form field based on the selector
function fillInput(selector, value) {
  // let field = document.querySelector(selector);

  const normalizedSelector = normalizeString(selector);
  let field = Array.from(document.querySelectorAll('input, textarea, select')).find(input => {
    let labelText = getLabelText(input);
    let nameMatch = normalizeString(input.name || '') === normalizedSelector;
    let idMatch = normalizeString(input.id || '') === normalizedSelector;
    let placeholderMatch = normalizeString(input.placeholder || '') === normalizedSelector;
    let labelMatch = normalizeString(labelText || '') === normalizedSelector;
    return nameMatch || idMatch || placeholderMatch || labelMatch;
  });

  // if (!field) {
  //   console.log(`field: ${field} not found. trying different measures`);
  //   field = Array.from(document.querySelectorAll('input, textarea')).find(input => {
  //     // Normalize input name, id, placeholder, and label
  //     const normalizedInputName = normalizeString(input.name);
  //     const normalizedInputId = normalizeString(input.id);
  //     const normalizedPlaceholder = normalizeString(input.placeholder);
  //     const normalizedLabel = normalizeString(getLabelText(input));

  //     return normalizedInputName === normalizedSelector ||
  //             normalizedInputId === normalizedSelector ||
  //             normalizedPlaceholder === normalizedSelector ||
  //             normalizedLabel === normalizedSelector;
  //   });
  // }

  if (field) {
    console.log(`field: ${field} found`);
    field.value = value;
    field.dispatchEvent(new Event('input', {bubbles: true}));
    console.log(`Filled ${selector} with value: ${value}`);
  } else {
    console.log(`Field ${selector} not found.`);
  }
}
// function fillInput(selector, value) {
//   let field = document.querySelector(selector);
  
//   // Try different approaches if direct selection fails
//   if (!field) {
//     // Try matching by placeholder
//     field = Array.from(document.querySelectorAll('input, textarea')).find(input => input.placeholder === selector);
//   }
//   if (!field) {
//     // Try matching by label
//     field = Array.from(document.querySelectorAll('input, textarea')).find(input => getLabelText(input) === selector);
//   }
  
//   if (field) {
//     field.value = value;
//     field.dispatchEvent(new Event('input', { bubbles: true }));
//     console.log(`Filled ${selector} with value: ${value}`);
//   } else {
//     console.log(`Field ${selector} not found.`);
//   }
// }

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureFields") {
      const formFields = captureFormFields();
      sendResponse({ fields: formFields });
  }

  if (request.action === "fillForm") {
      const fieldMapping = request.fieldMapping;
      console.log("Field Mapping: ", fieldMapping);

      for (const[selector, value] of Object.entries(fieldMapping)) {
        fillInput(selector, value);
      }
      sendResponse({ status: "success" });
  }
});