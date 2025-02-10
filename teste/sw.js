// sw.js
self.addEventListener("push", (event) => {
    const data = event.data ? event.data.text() : "Default notification message";

    const options = {
        body: "This notification works even when the app is closed!",
        icon: "https://via.placeholder.com/128", // Example icon
        badge: "https://via.placeholder.com/64", // Example badge
        data: { timestamp: Date.now() }, // Additional data
    };

    event.waitUntil(
        self.registration.showNotification("Game Notification", options)
    );
});

// Handle notification click (optional)
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow("/") // Opens the app when clicked
    );
});
// Simulate push from app
self.addEventListener("message", (event) => {
    if (event.data.action === "simulatePush") {
        self.registration.showNotification("Game Notification", {
            body: event.data.message,
            icon: "https://via.placeholder.com/128",
            badge: "https://via.placeholder.com/64",
        });
    }
});
