/*global chrome*/



// Visual effects to extensions
// Function to create and show the loading overlay
function showLoadingOverlay(status = 'Loading...') {
  let overlay = document.getElementById('extension-loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'extension-loading-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.fontSize = '24px';
    overlay.style.color = '#fff';
    overlay.style.transition = 'opacity 0.5s';

    document.body.appendChild(overlay);
  }
  overlay.innerHTML = status;
  overlay.style.opacity = '1'; // Ensure it's visible
}

// Function to hide the loading overlay
function hideLoadingOverlay() {
  const overlay = document.getElementById('extension-loading-overlay');
  if (overlay) {
    overlay.style.opacity = '0'; // Smoothly fade out
    setTimeout(() => {
      overlay.remove();
    }, 500); // Remove the overlay after the fade-out completes
  }
}


// Function to capture all form fields on the page
function captureFormFields() {
  const inputs = document.querySelectorAll("input, textarea, select");
  
  const fields = Array.from(inputs).map(input => {
    let options = null;

    // If it's a select element (dropdown), capture options
    if (input.tagName.toLowerCase() === 'select') {
      options = Array.from(input.options).map(option => ({
        value: option.value,
        text: option.text
      }));
    }
      return {
          tag: input.tagName,
          name: input.name || null,
          id: input.id || null,
          placeholder: input.placeholder || null,
          type: input.type || null,
          label: getLabelText(input),
          options: options 
      };
  });
  
  return fields;
}

function smoothScrollToElement(element) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
}

function simulateClick(element){
  if (element) {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(clickEvent);
    console.log('Simulated click on:', element);
  }
}
// Helper function to simulate dropdown menus and clickiting
function simulateClickAndCaptureOptions(selector) {
  console.log(`Attempting to click dropdown for field: ${selector.id || selector.name}`);
  simulateClick(selector);

  console.log('Dropdown clicked, attempting to capture options...');

  return new Promise(resolve => {
    setTimeout(() => {
      const options = Array.from(selector.querySelectorAll('option')).map(option => ({
        value: option.value,
        text: option.textContent.trim()
      }));
      console.log('Captured options:', options);
      resolve(options);
    }, 500);
  });
  // const dropdown = document.querySelector(selector);
  // if (dropdown) {
  //     dropdown.click(); // clicking to simulate

  //     // wait for options to appear
  //     setTimeout(() => {
  //       const options = document.querySelectorAll('.select2-result');
  //       const optionList = Array.from(options).map(option => ({
  //         value: option.value || option.getAttribute('aria-selected'),
  //         text: option.innerText.trim()
  //       }));

  //       console.log('Caputred dropdown options:', optionList);
  //       return optionList;
  //     }, 500); // currently set 500 for delay
  // }
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


// Helper function to handle radio buttons
function handleRadioButton(selector, value) {
  const radios = document.querySelectorAll(`input[name="${selector}"]`);
  for (const radio of radios){
    if (radio.value.toLowerCase() === value.toLowerCase()) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true}));
      console.log(`Radio Button "${selector}" set to "${value}".`);
      return;
    }
  }
  console.log(`No matching radio button found for "${selector}" with value "${value}".`);
}


async function fillInput(selector, value) {
  showLoadingOverlay("Filling form...");

  const normalizedSelector = normalizeString(selector);
  let field = Array.from(document.querySelectorAll('input, textarea, select')).find(input => {
      let labelText = getLabelText(input);
      let nameMatch = normalizeString(input.name || '') === normalizedSelector;
      let idMatch = normalizeString(input.id || '') === normalizedSelector;
      let placeholderMatch = normalizeString(input.placeholder || '') === normalizedSelector;
      let labelMatch = normalizeString(labelText || '') === normalizedSelector;
      return nameMatch || idMatch || placeholderMatch || labelMatch;
  });

  if (field) {
      console.log(`Field: ${field.tagName} with selector: ${selector} found`);

      // Scroll to the field smoothly
      smoothScrollToElement(field);

      // Add a short delay to mimic user interaction
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (field.tagName.toLowerCase() === 'select' || field.classList.contains('select2-hidden-accessible')) {
          console.log(`Handling Select2 dropdown for field: ${field.name || field.id}`);

          // Open the Select2 dropdown
          const select2Choice = document.querySelector(`#s2id_${field.id} .select2-choice`);
          if (select2Choice) {
              select2Choice.click(); // Trigger the click to open the dropdown

              // Wait for the dropdown to open
              await new Promise(resolve => setTimeout(resolve, 500));

              // Set the value using Select2 API
              field.value = value;
              const event = new Event('change', { bubbles: true });
              field.dispatchEvent(event);
              console.log(`Set Select2 dropdown value for ${field.name || field.id} to ${value}`);
          }
      } else if (field.tagName.toLowerCase() === 'select') {
          console.log(`Handling regular dropdown for field: ${field.name || field.id}`);
          field.value = value;
          field.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
          console.log(`Filling text field with value: ${value}`);
          field.value = value;
          field.dispatchEvent(new Event('input', { bubbles: true }));
      }
  } else {
      console.log(`Field ${selector} not found.`);
  }
  await new Promise(resolve => setTimeout(resolve, 1000));
  hideLoadingOverlay();
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