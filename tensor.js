
const video3 = document.getElementsByClassName('input_video3')[0];
const out3 = document.getElementsByClassName('output3')[0];
const controlsElement3 = document.getElementsByClassName('control3')[0];
const canvasCtx3 = out3.getContext('2d');
sessionStorage.setItem("x", 0);
sessionStorage.setItem("y", 0);

function onResultsHands(results) {
  document.body.classList.add('loaded');
  if(results.multiHandLandmarks){
    if(results.multiHandLandmarks[0][12].x > 0.6){
    } else if(results.multiHandLandmarks[0][12].x < 0.4){
    }
    sessionStorage.setItem("x", results.multiHandLandmarks[0][12].x);
    sessionStorage.setItem("y", results.multiHandLandmarks[0][12].y);
} else {
    sessionStorage.setItem("x", 0);
    sessionStorage.setItem("y", 0);
}
  canvasCtx3.save();
  canvasCtx3.clearRect(0, 0, out3.width, out3.height);
  canvasCtx3.drawImage(
      results.image, 0, 0, out3.width, out3.height);
  if (results.multiHandLandmarks && results.multiHandedness) {
    for (let index = 0; index < results.multiHandLandmarks.length; index++) {
      const classification = results.multiHandedness[index];
      const isRightHand = classification.label === 'Right';
      const landmarks = results.multiHandLandmarks[index];
      drawConnectors(
          canvasCtx3, landmarks, HAND_CONNECTIONS,
          {color: isRightHand ? '#00FF00' : '#FF0000'}),
      drawLandmarks(canvasCtx3, landmarks, {
        color: isRightHand ? '#00FF00' : '#FF0000',
        fillColor: isRightHand ? '#FF0000' : '#00FF00',
        radius: (x) => {
          return lerp(x.from.z, -0.15, .1, 10, 1);
        }
      });
    }
  }
  canvasCtx3.restore();
}

const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
  }});
  hands.onResults(onResultsHands);
    const camera = new Camera(video3, {
    onFrame: async () => {
      await hands.send({image: video3});
    },
    width: 480,
    height: 480
  });
  camera.start();

  new ControlPanel(controlsElement3, {
    selfieMode: true,
    maxNumHands: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  })
  .add([
    new StaticText({title: 'MediaPipe Hands'}),
    new Toggle({title: 'Selfie Mode', field: 'selfieMode'}),
    new Slider(
        {title: 'Max Number of Hands', field: 'maxNumHands', range: [1, 4], step: 1}),
    new Slider({
      title: 'Min Detection Confidence',
      field: 'minDetectionConfidence',
      range: [0, 1],
      step: 0.01
    }),
    new Slider({
      title: 'Min Tracking Confidence',
      field: 'minTrackingConfidence',
      range: [0, 1],
      step: 0.01
    }),
  ])
  .on(options => {
    video3.classList.toggle('selfie', options.selfieMode);
    hands.setOptions(options);
  });

