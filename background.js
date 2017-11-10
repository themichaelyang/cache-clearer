let running = {}

chrome.browserAction.onClicked.addListener((tab) => {
  if (!(tab.id in running)) {
    running[tab.id] = false
  }
  running[tab.id] = !running[tab.id]

  if (running[tab.id]) {
    clear(tab.id)
  }
  else {
    chrome.browserAction.setIcon({ tabId: tab.id, path: 'icons/off.png' })
  }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete' &&
  (tabId in running) && running[tabId]) {
    clear(tabId)
  }
})

function clear(tabId) {
  chrome.browserAction.setIcon({ tabId: tabId, path: 'icons/on.png' })
  chrome.browsingData.removeCache({}, () => {
    alert('cleared!')
  })
}
