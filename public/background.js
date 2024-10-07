/*global chrome*/

// Function to send a message to the content script to capture form fields
async function getFormFieldsFromContentScript(tabId) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, { action: "captureFields" }, (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(response.fields);
            }
        });
    });
}

// Function to call the GPT-4 API via your backend server
async function callGPT4API(jobUrl, resumeType, formFields) {
    try {
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

// Inject content script manually into the active tab if not already injected
async function injectContentScript(tabId) {
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        });
        console.log('Content script injected successfully.');
    } catch (error) {
        console.error('Failed to inject content script:', error);
    }
}

// Listener for "apply" action from the popup or frontend
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === 'apply') {
        try {
            // Get the active tab
            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

            // Inject content script before messaging
            await injectContentScript(activeTab.id);

            // Capture form fields from the content script
            const formFields = await getFormFieldsFromContentScript(activeTab.id);
            console.log("Captured form fields:", formFields);

            // Send the form fields and other data to the backend (LLM)
            const fieldMapping = await callGPT4API(request.jobUrl, request.resumeType, formFields);

            if (fieldMapping) {
                sendResponse({ status: 'success', data: fieldMapping });
            } else {
                sendResponse({ status: 'failure' });
            }
        } catch (error) {
            console.error('Error:', error);
            sendResponse({ status: 'failure', message: error.message });
        }
    }
    return true;  // Keeps the async communication open
});