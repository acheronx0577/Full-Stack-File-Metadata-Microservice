document.addEventListener('DOMContentLoaded', function() {
  const uploadBtn = document.getElementById('upload');
  const fileInput = document.getElementById('upfile');
  const fileDisplay = document.getElementById('fileDisplay');
  const fileName = document.getElementById('fileName');
  const output = document.getElementById('output');
  const resultDiv = document.getElementById('result');
  const outputStatus = document.getElementById('outputStatus');
  const statusDisplay = document.getElementById('status');

  // File input display handling - FIXED
  fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      const file = this.files[0];
      fileName.textContent = file.name;
      fileDisplay.classList.add('has-file');
      
      // Update status
      statusDisplay.textContent = 'FILE_SELECTED';
      statusDisplay.style.color = 'var(--accent-success)';
    } else {
      fileName.textContent = 'NO_FILE_SELECTED';
      fileDisplay.classList.remove('has-file');
      statusDisplay.textContent = 'READY';
      statusDisplay.style.color = '';
    }
  });

  // Upload button click handler
  uploadBtn.addEventListener('click', function() {
    if (!fileInput.files || !fileInput.files[0]) {
      showError('Please select a file first!');
      return;
    }

    const file = fileInput.files[0];
    
    // Show loading state
    output.classList.remove('hide');
    outputStatus.textContent = 'UPLOADING';
    outputStatus.style.color = 'var(--accent-warning)';
    resultDiv.innerHTML = '<div style="text-align: center; color: var(--text-dim);">UPLOADING_FILE...</div>';
    uploadBtn.disabled = true;
    statusDisplay.textContent = 'UPLOADING';
    statusDisplay.style.color = 'var(--accent-warning)';

    // Create FormData and send request
    const formData = new FormData();
    formData.append('upfile', file);

    fetch('/api/fileanalyse', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Success
      outputStatus.textContent = 'SUCCESS';
      outputStatus.style.color = 'var(--accent-success)';
      statusDisplay.textContent = 'COMPLETED';
      statusDisplay.style.color = 'var(--accent-success)';
      
      // Format and display JSON response
      const formattedJson = JSON.stringify(data, null, 2)
        .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
        .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>')
        .replace(/: (\d+)/g, ': <span class="json-number">$1</span>');
      
      resultDiv.innerHTML = `
        <div style="margin-bottom: 12px;">
          <span style="color: var(--accent-success);">✓ FILE_ANALYZED_SUCCESSFULLY</span>
        </div>
        <div class="json-output">${formattedJson}</div>
        <div style="margin-top: 12px; color: var(--text-dim); font-size: 0.9em;">
          FILE: ${data.name}<br>
          TYPE: ${data.type}<br>
          SIZE: ${formatFileSize(data.size)}
        </div>
      `;
    })
    .catch(error => {
      // Error handling
      outputStatus.textContent = 'ERROR';
      outputStatus.style.color = 'var(--accent-error)';
      statusDisplay.textContent = 'ERROR';
      statusDisplay.style.color = 'var(--accent-error)';
      
      resultDiv.innerHTML = `
        <div style="color: var(--accent-error); margin-bottom: 8px;">
          ✗ UPLOAD_FAILED
        </div>
        <div style="color: var(--text-dim); font-size: 0.9em;">
          ${error.message}
        </div>
      `;
    })
    .finally(() => {
      uploadBtn.disabled = false;
    });
  });

  function showError(message) {
    output.classList.remove('hide');
    outputStatus.textContent = 'ERROR';
    outputStatus.style.color = 'var(--accent-error)';
    resultDiv.innerHTML = `<div style="color: var(--accent-error);">${message}</div>`;
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
});