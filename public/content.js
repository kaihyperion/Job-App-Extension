/*global chrome*/

// General user information (to be provided dynamically or as part of form submission)


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

// Function to fill a form field based on the selector
function fillInput(selector, value) {
  let field = document.querySelector(selector);
  
  // Try different approaches if direct selection fails
  if (!field) {
    // Try matching by placeholder
    field = Array.from(document.querySelectorAll('input, textarea')).find(input => input.placeholder === selector);
  }
  if (!field) {
    // Try matching by label
    field = Array.from(document.querySelectorAll('input, textarea')).find(input => getLabelText(input) === selector);
  }
  
  if (field) {
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
    console.log(`Filled ${selector} with value: ${value}`);
  } else {
    console.log(`Field ${selector} not found.`);
  }
}

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureFields") {
      const formFields = captureFormFields();
      sendResponse({ fields: formFields });
  }

  if (request.action === "fillForm") {
      const fieldMapping = request.fieldMapping;
      console.log("Field Mapping: ", fieldMapping);

      // Handle full name fields
      if (fieldMapping["Full Name"]) {
          console.log("name part");
          if (fieldMapping.FullName.FirstName && fieldMapping.FullName.LastName) {
              fillInput(fieldMapping.FullName.FirstName, userData.firstName);
              fillInput(fieldMapping.FullName.LastName, userData.lastName);
          } else if (fieldMapping.FullName.FullName) {
              fillInput(fieldMapping.FullName.FullName, userData.fullName);
          }
      }

      // Handle phone number
      if (fieldMapping.PhoneNumber) {
          console.log("phone");
          fillInput(fieldMapping.PhoneNumber, userData.phoneNumber);
      }

      // Handle email address
      if (fieldMapping.EmailAddress) {
          console.log("email address aprt");
          fillInput(fieldMapping.EmailAddress, userData.email);
      }

      sendResponse({ status: "success" });
  }
});