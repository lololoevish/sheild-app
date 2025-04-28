'use client'
import { useEffect, useRef, useState } from 'react';
import { loadModels, detectFaces, analyzeHealth } from '../lib/face-recognition';
import { sendSecurityAlert } from '../lib/telegram-bot';
import { getFaceProfile, createHealthEvent } from '../lib/supabase';

interface CameraDevice {
  deviceId: string;
  label: string;
}


interface FaceDetectionResult {
  descriptor: Float32Array;
  detection: { score: number };
  expressions: { [key: string]: number };
}

export default function CameraComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [lastAlertTime, setLastAlertTime] = useState<number>(0);
  const [lastStrangerAlertTime, setLastStrangerAlertTime] = useState<number>(0);
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [cameraAccess, setCameraAccess] = useState<boolean>(false);
  useEffect(() => {
    async function getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices
          .filter(device => device.kind === 'videoinput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Камера ${availableCameras.length + 1}`
          }));
        setAvailableCameras(cameras);
        if (cameras.length > 0) {
          setSelectedCamera(cameras[0].deviceId);
        }
      } catch (error) {
        console.error('Ошибка получения списка камер:', error);
      }
    }

    getCameras();
  }, []);

  useEffect(() => {
    async function initCamera() {
      try {
        await loadModels();
        if (!selectedCamera) return;
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
            width: 640,
            height: 480
          }
        });
        setCameraAccess(true);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          startDetection();
        }
      } catch (error) {
        console.error('Camera error:', error);
      }
    }

    function startDetection() {
      intervalRef.current = setInterval(async () => {
        if (videoRef.current && canvasRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const img = new Image();
            img.src = canvas.toDataURL('image/jpeg');
            await new Promise(resolve => img.onload = resolve);
            const detections = await detectFaces(img);
            
            if (detections) {
              for (const detection of detections) {
                // Проверяем авторизацию
                const descriptor = Array.from(detection.descriptor).map(Number);
                const profile = await getFaceProfile(descriptor);
            
            if (!profile) {
              if (Date.now() - lastStrangerAlertTime > 60000) {
                sendSecurityAlert(
                  `🚨 Обнаружен незнакомец! Уверенность: ${(detection.detection.score * 100).toFixed(2)}%`
                );
                setLastStrangerAlertTime(Date.now());
              }
              continue;
            }
            
            const healthAnalysis = analyzeHealth(detection.expressions);
            
            if (healthAnalysis.isSick && Date.now() - lastAlertTime > 30000) {
              await createHealthEvent({
                face_id: profile.id,
                is_sick: true,
                confidence: detection.detection.score,
                symptom: healthAnalysis.symptoms
              });
              
              sendSecurityAlert(
                `⚠️ Обнаружены признаки болезни у ${profile.name}: ${healthAnalysis.symptoms.join(', ')}`
              );
              setLastAlertTime(Date.now());
            }
          }
        }
      }, 5000); // Проверка каждые 5 секунд
    }

    initCamera();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [lastAlertTime]);

  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
  };

  return (
    <div className="relative">
      {!cameraAccess && (
        <div className="p-4 bg-yellow-100 text-yellow-800 mb-4">
          Для работы приложения требуется доступ к камере. Пожалуйста, разрешите доступ.
        </div>
      )}
      
      {availableCameras.length > 0 && (
        <select
          value={selectedCamera}
          onChange={(e) => handleCameraChange(e.target.value)}
          className="mb-4 p-2 border-2 border-black"
        >
          {availableCameras.map(camera => (
            <option key={camera.deviceId} value={camera.deviceId}>
              {camera.label}
            </option>
          ))}
        </select>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="border-2 border-black rounded-lg"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 pointer-events-none"
      />
    </div>
  );
}