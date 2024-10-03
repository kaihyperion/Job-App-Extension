/*global chrome*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillForm") {
      console.log("Filling form on the job portal for:", request.jobUrl);

      const fieldMapping = request.fieldMapping;
      
      // const jobUrl = request.jobUrl;
      // const resumeType = request.resumeType;

      // just some simulation on filling out form
      // need to change this later (to adapt to other job portals)
      const nameInput = document.querySelector("input[name='name']");
      const emailInput = document.querySelector("input[name='email']");
      const resumeUploadInput = document.querySelector("input[type='file']");

      if (nameInput && emailInput && resumeUploadInput) {
        nameInput.value = "Kai Yun";
        emailInput.value = "kyperion.workmode@gmail.com";
        // resumeUploadInput.files = [new File(["resume"], `${resumeType}_resume.pdf`)];

        // some example form submission (CHANGE LATER)
        const submitButton = document.querySelector("button[type='submit']");
        if (submitButton) {
          submitButton.click();
        }

        // let background (service worker) know that form was filled succesfully
        sendResponse({ status: "success"});
        } else {
          console.log("Faild to find necessary form element");
          sendResponse({ status: "failure"});
        }
      }
    });