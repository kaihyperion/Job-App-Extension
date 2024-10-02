chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "apply") {
        console.log("Applying to job at:", request.jobUrl);
        sendResponse({ status: "Job application started"});
    }
});

//background service worker (background script) is responsible for handling events and logic that need to run in the background, independently of the browser's tabs or user interaction
/*background service worker is event-driven. it waits for specific events (message or browser action) and reacts to them
in Manifest V3, background scripts have been replaced by service workers (efficient and needs less memory consumption) */