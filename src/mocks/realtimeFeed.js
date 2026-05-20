// Simple mock realtime feed for vehicle updates
let intervalId = null;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mutateVehicle(v) {
  const newV = { ...v };
  if (newV.status === 'in-transit') {
    // adjust speed
    newV.speed = `${randomBetween(30, 65)} km/h`;
    // decrement fuel slowly
    newV.fuelLevel = Math.max(5, newV.fuelLevel - randomBetween(0, 3));
    // nudge coordinates slightly to simulate movement
    const latJitter = (Math.random() - 0.5) * 0.002;
    const lngJitter = (Math.random() - 0.5) * 0.002;
    newV.lat = +(newV.lat + latJitter).toFixed(6);
    newV.lng = +(newV.lng + lngJitter).toFixed(6);
    // update simple location display
    newV.location = `${newV.lat.toFixed(4)}, ${newV.lng.toFixed(4)}`;
  }
  return newV;
}

export function startMockFeed(onUpdate, opts = {}) {
  const ms = opts.intervalMs || 2500;
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    // request a full refresh payload
    onUpdate(prev => prev.map(mutateVehicle));
  }, ms);
}

export function stopMockFeed() {
  if (intervalId) { clearInterval(intervalId); intervalId = null; }
}

export default { startMockFeed, stopMockFeed };
