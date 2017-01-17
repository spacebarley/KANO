// Saves options to chrome.storage.sync.
function save_options() {
  var query = document.getElementById('queryForPortal').value;
  var portal = document.getElementById('PORTAL ALARM').checked;
  var email = document.getElementById('EMAIL ALARM').checked;
  chrome.storage.sync.set({
    'query': query,
    'portalChecked': portal,
    'emailChecked': email,
    'queryChanged': true
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    query: '',
    portalChecked: true,
    emailChecked: true
  }, function(items) {
    document.getElementById('queryForPortal').value = items.query;
    document.getElementById('PORTAL ALARM').checked = items.portalChecked;
    document.getElementById('EMAIL ALARM').checked = items.emailChecked
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);