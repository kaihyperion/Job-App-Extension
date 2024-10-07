/*global chrome*/
async function callGPT4API(jobUrl, resumeType) {
    try {
        const formFields = captureFormFields();
        const response = await fetch('http://localhost:3000/call-openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jobUrl, resumeType, formFields })
        });

        const data = await response.json();
        console.log('Response from server:', data);
        return data.result;
    } catch (error) {
        console.error('Error calling backend server:', error);
        return null;
    }
}


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === 'apply') {
        const fieldMapping = await callGPT4API(request.jobUrl, request.resumeType);
        if (fieldMapping) {
            sendResponse({ status: 'success', data: fieldMapping });
        } else {
            sendResponse({ status: 'failure' });
        }
    }
    return true;  // Keep the connection open for async response
});
//background service worker (background script) is responsible for handling events and logic that need to run in the background, independently of the browser's tabs or user interaction
/*background service worker is event-driven. it waits for specific events (message or browser action) and reacts to them
in Manifest V3, background scripts have been replaced by service workers (efficient and needs less memory consumption) */