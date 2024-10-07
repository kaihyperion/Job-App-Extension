/*global chrome*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillForm") {
      console.log("Filling form on the job portal for:", request.jobUrl);

      const fieldMapping = request.fieldMapping;
      let formFilled = false;


      // Helper function to fill in an input field by name or placeholder
      function fillInputField(selector, value) {
        const field = document.querySelector(selector);
        if (field) {
          field.value = value;
          field.dispatchEvent(new Event('input', { bubbles: true}));
          formFilled = true;
        }
      }

      // Helper function to fill in dropdown (select) fields
      function selectDropdown(selector, value) {
        const dropdown = document.querySelector(selector);
        if (dropdown) {
          Array.from(dropdown.options).forEach(option => {
            if (option.text === value) {
              dropdown.value = option.value; // set dropdown value
              dropdown.dispatchEvent(new Event('change', { bubbles: true })); // trigger change event
              formFilled = true;
            }
          })
        }
      }

      // Helper function to select radio buttons
      function selectRadio(selector, value) {
        const radioButton = document.querySelector(`input[name='${selector}'][value='${value}']`);
        if (radioButton) {
          radioButton.checked = true;
          radioButton.dispatchEvent(new Event('change', { bubbles: true })); // trigger change event
          formFilled = true;
        }
      }

      // Helper function to handle file upload
      function uploadFile(selector, filePath) {
        const fileInput = document.querySelector(selector);
        if (fileInput) {
          fileInput.value = filePath;
          formFilled = true;
        }
      }


      // Dynamically map based on field names or placeholder
      fillInputField("input[name='first_name']", fieldMapping.firstName || "Kai");
      fillInputField("input[name='last_name']", fieldMapping.lastName || "Yun");
      fillInputField("input[name='email']", fieldMapping.email || "Kyperion.workmode@gmail.com");
      fillInputField("input[name='address_line']", fieldMapping.address || "5225 NW 85th Ave.");
      fillInputField("input[name='city']", fieldMapping.city || "Doral");
      fillInputField("input[name='postal_code']", fieldMapping.postalCode || "33166");
      fillInputField("input[name='phone']", fieldMapping.phone || "+17739642148");

      // Select dropdowns (e.g. state, country)
      selectDropdown("select[name='state']", fieldMapping.state || "FL");
      selectDropdown("select[name='country']", fieldMapping.country || "United States");


      // select voluntary disclosure options (radio buttons)
      selectRadio('gender', fieldMapping.gender || "male");
      selectRadio('ethnicity', fieldMapping.ethnicity || "East Asian");
      selectRadio('disability', fieldMapping.disability || "no");
      selectRadio('veteran_status', fieldMapping.veteranStatus || "no");
      

      // checking for submit buttons
      const submitButton = document.querySelector("button[type='submit'], input[type='submit']");
      if (submitButton && formFilled) {
        submitButton.click();
        sendResponse({ status: "success" });
      } else {
        sendResponse({ status: "failture", message: "Failed to find form elements" });
      }
    }
  });