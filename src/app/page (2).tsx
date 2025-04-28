'use client'
import CameraComponent from '../components/CameraComponent';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Система мониторинга здоровья</h1>
      <div className="max-w-2xl mx-auto">
        <CameraComponent />
      </div>
    </main>
  );
}