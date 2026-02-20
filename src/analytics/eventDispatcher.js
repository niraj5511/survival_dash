// src/analytics/eventDispatcher.js
export function logEvent(eventName, payload = {}) {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  events.push({
    id: Date.now() + Math.random().toString(16).slice(2),
    eventName,
    timestamp: new Date().toISOString(),
    payload,
  });
  localStorage.setItem("events", JSON.stringify(events.slice(-500))); // keep last 500 events
  console.log(`Event: ${eventName}`, payload);
}
