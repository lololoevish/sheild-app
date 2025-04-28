import * as faceapi from 'face-api.js';

// Загрузка моделей
export async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models'); 
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  await faceapi.nets.faceExpressionNet.loadFromUri('/models');
}

// Обнаружение лиц
export async function detectFaces(image: HTMLImageElement) {
  return await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors()
    .withFaceExpressions();
}

// Анализ состояния здоровья
export function analyzeHealth(expressions: faceapi.FaceExpressions) {
  const symptoms = [];
  if (expressions.sad > 0.7) symptoms.push('усталость');
  if (expressions.neutral > 0.9) symptoms.push('бледность');
  
  return {
    isSick: symptoms.length > 0,
    symptoms
  };
}