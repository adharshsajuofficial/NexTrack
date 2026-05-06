importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyC1qEAfobMSPKmhsRAHYp2QN8_f0S4o_jY",
  authDomain: "nextrack-63fff.firebaseapp.com",
  projectId: "nextrack-63fff",
  storageBucket: "nextrack-63fff.firebasestorage.app",
  messagingSenderId: "616540139798",
  appId: "1:616540139798:web:b7b2af72a7bedf61072037",
  measurementId: "G-8SJH7DH9TW"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
