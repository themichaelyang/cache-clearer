let running = {}
let clearing = {}
let count = 0

chrome.browserAction.onClicked.addListener((tab) => {
  if (!(tab.id in running)) {
    running[tab.id] = false
    // count++
  }
  running[tab.id] = !running[tab.id]

  if (running[tab.id]) {
    chrome.browserAction.setIcon({ tabId: tab.id, path: 'icons/on.png' })
    clear(tab.id)
  }
  else {
    chrome.browserAction.setIcon({ tabId: tab.id, path: 'icons/off.png' })
    // if (count >= 50) { // for those who never close chrome
      // delete running[tab.id]
      // count--
    // }
  }
})

chrome.webRequest.onBeforeRequest.addListener((details) => {
  if (running[details.tabId]) {
    clear(details.tabId)
  }
}, { urls: ['<all_urls>'] })

function clear(tabId) {
  if (!(tabId in clearing)) {
    clearing[tabId] = true
    chrome.browsingData.removeCache({ since: 0 }, () => {
      delete clearing[tabId]
    })
  }
}
