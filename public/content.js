chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillForm") {
      console.log("Filling form with data:", request.fieldMappings);
      
    }
  });