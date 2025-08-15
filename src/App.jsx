import React, { useState } from "react";
import UploadFile from "./views/uploadFile";
import GenerateFile from "./views/generateFile";

export default function App() {
  const [view, setView] = useState(null); // 'upload' | 'generate' | null

  if (view === "upload") return <UploadFile onBack={() => setView(null)} />;
  if (view === "generate") return <GenerateFile onBack={() => setView(null)} />;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 gap-6"
      style={{
        backgroundImage: "url('/teste.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-2xl p-10 w-full max-w-xl text-center text-white">
        <img src="/title-image.svg" alt="Título" className="mx-auto mb-8 max-w-xs h-auto" />
        <h1 className="text-2xl font-bold mb-6">O que você deseja fazer?</h1>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => setView("upload")}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            ⬆️ Upload de arquivo
          </button>

          <button
            onClick={() => setView("generate")}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            ✨ Geração de arquivo
          </button>
        </div>
      </div>
    </div>
  );
}
