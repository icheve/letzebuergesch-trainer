const CACHE = 'letz-28-v5'
const SHELL = [
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './images/picture-training/sport-park.jpg',
  './images/picture-training/london.jpg',
  './images/picture-training/living-room.jpg',
  './images/picture-training/rome.jpg',
  './images/picture-training/garden-argument.jpg',
]
const LOD_AUDIO_MANIFEST = './audio/lod/manifest.json'

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE)
    await cache.addAll(SHELL)
    const response = await fetch('./index.html')
    await cache.put('./index.html', response.clone())
    const html = await response.text()
    const assets = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^\"]+)"/g)].map((match) => match[1])
    if (assets.length) await cache.addAll(assets)

    const audioManifestResponse = await fetch(LOD_AUDIO_MANIFEST)
    if (!audioManifestResponse.ok) throw new Error('LOD audio manifest is unavailable')
    await cache.put(LOD_AUDIO_MANIFEST, audioManifestResponse.clone())
    const audioFiles = await audioManifestResponse.json()
    await cache.addAll(audioFiles.map((file) => `./audio/lod/${file}`))
  })())
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((response) => {
        const copy = response.clone()
        caches.open(CACHE).then((cache) => cache.put('./index.html', copy))
        return response
      }).catch(() => caches.match('./index.html'))
    )
    return
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone()
      caches.open(CACHE).then((cache) => cache.put(event.request, copy))
      return response
    }).catch(() => Response.error()))
  )
})
