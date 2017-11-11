let running = {}
let clearing = {}
let count = 0

// click browserAction (icon) to toggle on/off
chrome.browserAction.onClicked.addListener((tab) => {
  if (!(tab.id in running)) {
    running[tab.id] = false
    count++
  }
  running[tab.id] = !running[tab.id]

  if (running[tab.id]) {
    turnOn(tab.id)
    clear(tab.id)
  }
  else {
    turnOff(tab.id)

    // for those with many tabs who never close chrome, add a small optimization
    if (count >= 50) {
      delete running[tab.id]
      count--
    }
  }
})

// ensure icon is updated even upon tab update or refresh!
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete' &&
  (tabId in running) && running[tabId]) {
    turnOn(tabId)
  }
})

// intercept request and clear cache before requesting
chrome.webRequest.onBeforeRequest.addListener((details) => {
  if (running[details.tabId]) {
    clear(details.tabId)
  }
}, { urls: ['<all_urls>'] })

// clears the cache
function clear(tabId) {
  if (!(tabId in clearing)) {
    clearing[tabId] = true
    chrome.browsingData.removeCache({ since: 0 }, () => {
      delete clearing[tabId]
    })
  }
}

function turnOn(tabId) {
  chrome.browserAction.setTitle({ tabId: tabId, title: "Cache clearer is ON; Click to turn off." })
  chrome.browserAction.setIcon({ tabId: tabId, path: 'icons/on.png' })
}

function turnOff(tabId) {
  chrome.browserAction.setTitle({ tabId: tabId, title: "Cache clearer is OFF; Click to turn on." })
  chrome.browserAction.setIcon({ tabId: tabId, path: 'icons/off.png' })
}
