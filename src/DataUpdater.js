class DataUpdater {
  constructor() {

    this.elements = {
      cameraPosition: document.getElementById('dt-cam-pos'),
      time: document.getElementById('dt-time'),
      fps: document.getElementById('dt-fps')
    };

    this.data = {
      cameraPosition: { x: 0, y: 0, z: 0 },
      time: 0,
      fps: 0
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