import React, { useState } from 'react';

function App() {
  const [jobUrl, setJobUrl] = useState('');
  const [resumeType, setResumeType] = useState('swe');
  const [status, setStatus] = useState('');

  const handleApply = () => {
    chrome.runtime.sendMessage({
      action: "apply",
      jobUrl: jobUrl,
      resumeType: resumeType
    }, (response) => {
      setStatus(response.status);
    });
  };

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
      </select><br /><br />
      <button onClick={handleApply}>Apply</button>
      {status && <p>{status}</p>}
    </div>
  );
}

export default App;