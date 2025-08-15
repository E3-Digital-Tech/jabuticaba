import React, { useState } from "react";
import { ensureUniqueName, writeFile, readJSON, writeJSON } from "../storage/opfs";

function slugify(str) {
  return String(str)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function UploadFile({ onBack }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const supported =
    typeof window !== "undefined" &&
    "storage" in navigator &&
    !!navigator.storage.getDirectory;

  async function handleUpload() {
    setStatus("");
    if (!supported) {
      setStatus("Este navegador não suporta o armazenamento privado (OPFS). Use Chrome/Edge em desktop.");
      return;
    }
    if (!name.trim()) return setStatus("Informe um nome para o contrato.");
    if (!file) return setStatus("Selecione um arquivo .docx.");

    const extOk =
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      (file.name && file.name.toLowerCase().endsWith(".docx"));
    if (!extOk) return setStatus("Apenas arquivos .docx são permitidos.");

    setBusy(true);
    try {
      // garante nome único dentro de OPFS:/files
      const base = slugify(name) || "contrato";
      const unique = await ensureUniqueName(
        await (await navigator.storage.getDirectory()).getDirectoryHandle("files", { create: true }),
        base,
        ".docx"
      );
      const destPath = `files/${unique}`;

      // grava arquivo e atualiza manifesto em OPFS:/index.json
      await writeFile(destPath, file);

      const manifest = await readJSON("index.json"); // manifesto privado do app
      if (!manifest.some((it) => it && it.path === destPath)) {
        manifest.push({ name: name.trim(), path: destPath, source: "opfs" });
        await writeJSON("index.json", manifest);
      }

      setStatus(`✅ Enviado: ${name.trim()} → ${destPath}`);
      setName("");
      setFile(null);
    } catch (e) {
      setStatus(`❌ Erro ao enviar: ${e.message || e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage: "url('/teste.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <button
        onClick={onBack}
        className="fixed top-4 left-4 z-[60] px-4 py-2 rounded-full border border-gray-500/60 text-gray-200 bg-black/40 hover:bg-black/60 backdrop-blur transition"
      >
        ← Voltar
      </button>

      <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-2xl p-8 w-full max-w-xl text-white">
        <h1 className="text-2xl font-bold mb-4 text-center">⬆️ Upload de arquivo (front-only)</h1>
        <p className="text-gray-300 mb-6 text-center">
          Salva em armazenamento privado do site (OPFS), sem backend e sem escolher pasta.
        </p>

        {!supported && (
          <div className="mb-4 text-sm text-yellow-300">
            Seu navegador não suporta OPFS. Use Chrome/Edge em desktop (localhost ou HTTPS).
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome do contrato (ex.: Proposta Comercial)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <input
            type="file"
            accept=".docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:cursor-pointer hover:file:bg-blue-500"
          />

          {file && (
            <div className="text-sm text-gray-200">
              <div><strong>Selecionado:</strong> {file.name}</div>
              <div><strong>Tamanho:</strong> {(file.size / 1024).toFixed(1)} KB</div>
              <div><strong>Tipo:</strong> {file.type || "desconhecido"}</div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={busy || !supported}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            {busy ? "Enviando…" : "Enviar arquivo"}
          </button>

          {status && <p className="text-sm mt-2">{status}</p>}
        </div>

        <div className="mt-6 text-xs text-gray-400 leading-relaxed">
          <p>• Arquivos ficam em OPFS (<em>armazenamento privado</em>); o site acessa direto, sem backend.</p>
          <p>• O manifesto fica em <code>OPFS:/index.json</code>. Em produção você pode enviar um <code>/index.json</code> “base” no <code>public/</code> e mesclar com o do OPFS.</p>
        </div>
      </div>
    </div>
  );
}
