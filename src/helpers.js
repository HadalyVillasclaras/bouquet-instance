export const toDegrees = (radians) => {
  let normalizedRadians = radians % (2 * Math.PI);
  if (normalizedRadians > Math.PI) {
    normalizedRadians -= 2 * Math.PI;
  } else if (normalizedRadians < -Math.PI) {
    normalizedRadians += 2 * Math.PI;
  }
  return (normalizedRadians * (180 / Math.PI)).toFixed(2);
};

export const calculateMagnitudeRadians = (x, y, z) => {
  return Math.sqrt(x * x + y * y + z * z);
};

let lastLoggedRotation = { x: null, y: null, z: null };

export const getRotation = (currentRotation) => {
  const magnitudeRadians = calculateMagnitudeRadians(currentRotation.x, currentRotation.y, currentRotation.z);
  const magnitudeDegrees = toDegrees(magnitudeRadians);

  const xDegrees = toDegrees(currentRotation.x);
  const yDegrees = toDegrees(currentRotation.y);
  const zDegrees = toDegrees(currentRotation.z);

  if (lastLoggedRotation.x !== currentRotation.x ||
    lastLoggedRotation.y !== currentRotation.y ||
    lastLoggedRotation.z !== currentRotation.z) {
    lastLoggedRotation = { ...currentRotation };
    return {
      rad: magnitudeRadians.toFixed(2),
      deg: magnitudeDegrees,
      xDeg: xDegrees,
      yDeg: yDegrees,
      zDeg: zDegrees
    };
  }
  return null;
};

let fpsLastTime = performance.now();
let frameCount = 0;
export const updateFPS = (updateInterval) => {
  frameCount++;
  const now = performance.now();
  const elapsed = now - fpsLastTime;

  if (elapsed >= updateInterval) {
    const fps = frameCount;
    frameCount = 0;
    fpsLastTime = now;
    return fps;
  }
  return null;
};
