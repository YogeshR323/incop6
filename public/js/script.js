// let heart
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('rated') != null) {
    let elements = document.getElementById('rated')

    const userId = document.getElementById('rated').getAttribute('data-user-id')
    const locationId = document.getElementById('rated').getAttribute('data-location-id')
    const heartstate = document.getElementById('rated').getAttribute('data-heart-id')
    const serverUrl = 'http://localhost:2000/rating'
    const method = 'POST'
    const headers = { 'Content-Type': 'application/json' }

    elements.addEventListener('click', (e) => {
      fetch(serverUrl, {
        method,
        headers,
        body: JSON.stringify({ userId, locationId, heartstate }),
      }).then(() => {
        window.location.reload()
      })
    })
  }
})

//         fetch(serverUrl, {
//             method,
//             headers,
//             body: JSON.stringify({ userId, locationId, heartclass }),
//         }).then(() => {
//             console.log('hellllllo')
//             window.location.reload()
//         })
//     }

// for (let i = 0; i < elements.length; i++) {
//   elements[i].addEventListener('click', updateRateTable)
// }
