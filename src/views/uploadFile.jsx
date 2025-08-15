import React, { useState } from "react";
import { supabase } from "../libs/supabase";

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

  async function readManifest() {
    const { data, error } = await supabase
      .storage.from("contracts")
      .download("index.json");
    if (error) return [];
    try {
      const text = await data.text();
      const json = JSON.parse(text);
      return Array.isArray(json) ? json : [];
    } catch {
      return [];
    }
  }

  async function writeManifest(list) {
    const blob = new Blob([JSON.stringify(list, null, 2)], {
      type: "application/json",
    });
    // upsert = true para sobrescrever/gerar
    const { error } = await supabase
      .storage.from("contracts")
      .upload("index.json", blob, { upsert: true, contentType: "application/json" });
    if (error) throw error;
  }

  async function ensureUniquePath(base, ext = ".docx") {
    let candidate = `files/${base}${ext}`;
    // tenta listar prefixo pra ver se já existe nome
    const { data, error } = await supabase
      .storage.from("contracts")
      .list("files", { search: `${base}` });
    if (error || !data) return candidate;

    let i = 1;
    const filenames = new Set(data.map((o) => o.name));
    while (filenames.has(`${base}${i === 1 ? "" : `-${i}`}${ext}`)) i++;
    candidate = `files/${base}${i === 1 ? "" : `-${i}`}${ext}`;
    return candidate;
  }

  async function handleUpload() {
    setStatus("");
    if (!name.trim()) return setStatus("Informe um nome para o contrato.");
    if (!file) return setStatus("Selecione um arquivo .docx.");
    const isDocx =
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      (file.name && file.name.toLowerCase().endsWith(".docx"));
    if (!isDocx) return setStatus("Apenas .docx são permitidos.");

    setBusy(true);
    try {
      const base = slugify(name) || "contrato";
      const path = await ensureUniquePath(base, ".docx");

      // 1) Upload do arquivo
      const { error: upErr } = await supabase
        .storage.from("contracts")
        .upload(path, file, {
          upsert: false, // se quiser sobrescrever: true (requer policy de update)
          contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

      if (upErr) {
        console.error("Upload error:", upErr); // veja a msg completa no console
        throw new Error(upErr.message || upErr.error || "Falha no upload");
      }

      // 2) URL pública do arquivo
      const { data: pub } = supabase.storage.from("contracts").getPublicUrl(path);
      const url = pub?.publicUrl || null;

      // 3) Atualiza manifesto index.json no bucket
      const list = await readManifest();
      if (!list.some((it) => it.url === url)) {
        list.push({ name: name.trim(), url });
        await writeManifest(list);
      }

      setStatus(`✅ Enviado: ${name.trim()} → ${url || path}`);
      setName("");
      setFile(null);
    } catch (e) {
      setStatus(`❌ Erro: ${e.message || e}`);
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
        <h1 className="text-2xl font-bold mb-4 text-center">⬆️ Upload (compartilhado)</h1>
        <p className="text-gray-300 mb-6 text-center">
          O arquivo é salvo no <strong>Supabase Storage</strong> e o manifesto <code>index.json</code> é atualizado no mesmo bucket.
        </p>

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
            disabled={busy}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            {busy ? "Enviando…" : "Enviar arquivo"}
          </button>

          {status && <p className="text-sm mt-2">{status}</p>}
        </div>
      </div>
    </div>
  );
}
