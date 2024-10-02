/*global chrome*/
import React, { useState } from 'react';

function App() {
  // state declaration
   // const [state, setState] = useState(initialValue);
  const [jobUrl, setJobUrl] = useState('');
  const [resumeType, setResumeType] = useState('swe');
  const [status, setStatus] = useState('');


  // handleApply function is triggered when user clicks 'apply' button
  const handleApply = () => {
    // Check if the 'chrome' API is available beczu without chrome, it wshould't work
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      // Call the Chrome API to send a message to the background script
      chrome.runtime.sendMessage(
        {
          action: "apply",
          jobUrl: jobUrl,
          resumeType: resumeType
        },
        (response) => {
          setStatus(response.status);
        }
      );
    } else {
      // if not chrome API, send message to consloe
      console.log("Chrome API not available. This code only works inside a Chrome extension.");
      setStatus("Chrome API not available.");
    }
  };

  // our app(extension) will return the js rendering
  return (
    <div style={{ padding: '10px' }}>
      <h2>Job Application Automator</h2>
      <label htmlFor="job-url">Job URL:</label><br />
      <input
        type="text"
        id="job-url"
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
      /><br />
      <label htmlFor="resume">Resume Type:</label><br />
      <select
        id="resume"
        value={resumeType}
        onChange={(e) => setResumeType(e.target.value)}
      >
        <option value="swe">Software Engineer</option>
        <option value="mle">Machine Learning Engineer</option>
        <option value="ds">Data Scientist</option>
        <option value="analyst">Analyst</option>
        <option value="app">App Developer</option>
      </select><br /><br />
      {/* on the botton click, it will call the handleApply function */}
      <button onClick={handleApply}>Apply</button> 
      {status && <p>{status}</p>}
    </div>
  );
}

export default App;