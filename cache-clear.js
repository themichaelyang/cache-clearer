if (!window.cacheClearer) {
  window.cacheClearer = true

  alert('running!')

  window.addEventListener('load', () => {
    alert('window loaded!')
  })
}
