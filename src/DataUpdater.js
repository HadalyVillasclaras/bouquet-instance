class DataUpdater {
  constructor() {

    this.elements = {
      cameraPosition: document.getElementById('dt-cam-pos'),
      time: document.getElementById('dt-time'),
      fps: document.getElementById('dt-fps'),
      rotation: document.getElementById('dt-rotation'),
      rotationMagnitude: document.getElementById('dt-rotation-mag'),
      rotationAxis: document.getElementById('dt-rotation-axis')

    };

    this.data = {
      cameraPosition: { x: 0, y: 0, z: 0 },
      time: 0,
      fps: 0,
      rotation: { x: 0, y: 0, z: 0 }
    };
  }

  setCameraPosition(x, y, z) {
    const formattedX = x.toFixed(1);
    const formattedY = y.toFixed(1);
    const formattedZ = z.toFixed(1);
    const formattedPosition = `${formattedX}x,${formattedY}y,${formattedZ}z`;
    if (this.data.cameraPosition.x !== x || this.data.cameraPosition.y !== y || this.data.cameraPosition.z !== z) {
      this.data.cameraPosition = { x, y, z };
      this.updateUI('cameraPosition', formattedPosition);
    }
  }


  setTime(time) {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    const milliseconds = Math.floor((time % 1) * 100).toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}:${milliseconds}`;
    if (this.data.time !== formattedTime) {
      this.data.time = formattedTime;
      this.updateUI('time', formattedTime);
    }
  }

  setRotation(rotationData) {
    const degNumber = Number(rotationData.deg);
    const radNumber = Number(rotationData.rad);
    const xDegNumber = Number(rotationData.xDeg);
    const yDegNumber = Number(rotationData.yDeg);
    const zDegNumber = Number(rotationData.zDeg);

    const rotationMagnitude = `${radNumber.toFixed(2)} rad`;
    const formattedRotation = `${radNumber.toFixed(2)} rad (${degNumber.toFixed(2)}°) | X: ${xDegNumber.toFixed(2)}°, Y: ${yDegNumber.toFixed(2)}°, Z: ${zDegNumber.toFixed(2)}°`;

    if (this.data.rotation.deg !== degNumber || this.data.rotation.rad !== radNumber ||
      this.data.rotation.xDeg !== xDegNumber || this.data.rotation.yDeg !== yDegNumber || this.data.rotation.zDeg !== zDegNumber) {
      this.data.rotation = {
        deg: degNumber,
        rad: radNumber,
        xDeg: xDegNumber,
        yDeg: yDegNumber,
        zDeg: zDegNumber
      };
      this.updateUI('rotation', '·');
      this.updateUI('rotationMagnitude', rotationMagnitude);

      if (this.elements.rotationAxis) {
        this.elements.rotationAxis.innerHTML = `
          <p class="p2">X: ${xDegNumber.toFixed(2)}°</p>
          <p class="p2">Y: ${yDegNumber.toFixed(2)}°</p>
          <p class="p2">Z: ${zDegNumber.toFixed(2)}°</p>
        `;
      }
      
    }
  }


  setFPS(fps) {
    if (this.data.fps !== fps) {
      this.data.fps = fps;
      this.updateUI('fps', `${fps}`);
    }
  }

  updateUI(id, value) {
    const element = this.elements[id];
    if (element) {
      element.textContent = value;
    } else {
      console.warn(`UI element for ${id} not found.`);
    }
  }
}


export default DataUpdater;