/* =========================================================
   SHOHIN ENGLISH
   sw.js

   Service Worker
   Basic offline support

   SHOHIN BRAND COLORS — НЕ МЕНЯТЬ
========================================================= */

"use strict";

const CACHE_NAME = "shohin-english-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",

  "./css/style.css",
  "./css/components.css",

  "./js/app.js",
  "./js/storage.js",
  "./js/levels.js",
  "./js/lessons.js",
  "./js/lesson-player.js",
  "./js/exercises.js",
  "./js/tests.js",
  "./js/progress.js",

  "./data/lessons.json"
];

/* =========================================================
   INSTALL
========================================================= */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(APP_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

/* =========================================================
   FETCH
========================================================= */

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((networkResponse) => {

            if (
              !networkResponse ||
              networkResponse.status !== 200 ||
              networkResponse.type === "opaque"
            ) {
              return networkResponse;
            }

            const responseClone =
              networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });

            return networkResponse;
          })
          .catch(() => {
            return caches.match("./index.html");
          });
      })
  );
});

/* =========================================================
   MESSAGE
========================================================= */

self.addEventListener("message", (event) => {

  if (!event.data) {
    return;
  }

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

});