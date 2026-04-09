export default function TestApp() {
  return (
    <div className="w-screen h-screen bg-red-500 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">🚀 APP IS RENDERING!</h1>
        <p className="text-xl text-white">If you see this red screen, React is working!</p>
        <p className="text-lg text-white mt-4">Backend running: http://localhost:5000</p>
      </div>
    </div>
  );
}
