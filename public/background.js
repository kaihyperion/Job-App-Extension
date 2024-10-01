chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "apply") {
        console.log("Applying to job at:", request.jobUrl);
        sendResponse({ status: "Job application started"});
    }
});