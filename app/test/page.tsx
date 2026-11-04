export default function TestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Testing Page</h1>
      <p className="text-xl text-gray-300">If you can see this, the styling is working!</p>
      <div className="glassmorphism p-8 rounded-xl max-w-md">
        <p className="mb-4">This is a glassmorphism card</p>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
          Test Button
        </button>
      </div>
    </div>
  )
}
