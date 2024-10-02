/*global chrome*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // listen for "apply" message from popup
    if (request.action === "apply") {
        console.log("Received apply request for job at:", request.jobUrl);

        // Find active and currently opened window tab and send a message to content script
        chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
            const activeTabId = tabs[0].id;

            // send message to content script to fill out the form on job portal
            chrome.tabs.sendMessage(activeTabId, {
                action: "fillForm",
                jobUrl: request.jobUrl,
                resumeType: request.resumeType
            }, (response) => {
                // Handle async respons from content script
                if (response && response.status === "success") {
                    console.log("Job application process started.");
                    sendResponse({status: "Job application successful!"});
                } else {
                    console.log("Failed to fill job application form.");
                    sendResponse({ status: "Job Application failed"});
                }
            });
        });
        // return true to indicate my want to response async
        return true;
    }
});

//background service worker (background script) is responsible for handling events and logic that need to run in the background, independently of the browser's tabs or user interaction
/*background service worker is event-driven. it waits for specific events (message or browser action) and reacts to them
in Manifest V3, background scripts have been replaced by service workers (efficient and needs less memory consumption) */