// pontos principais do arquivo — substitua seu generateFile.jsx por este se quiser já integrado
import React, { useEffect, useState } from "react";
import InstructionsModal from "../components/InstructionsModal";
import { generateContractFromTemplate } from "../utils/docx";
import { validateForm } from "../utils/validation";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { readJSON, readFile, listDocx } from "../storage/opfs";

export default function GenerateFile({ onBack }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [files, setFiles] = useState([]); // { name, source: 'server'|'opfs', url?, path? }
  const [selected, setSelected] = useState(null);
  const [keys, setKeys] = useState([]);
  const [form, setForm] = useState({});
  const [parsing, setParsing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const list = [];

      // 1) Itens do servidor (se houver /index.json)
      try {
        const res = await fetch("/index.json", { cache: "no-store" });
        if (res.ok) {
          const serverList = await res.json();
          if (Array.isArray(serverList)) {
            serverList.forEach((it) => {
              if (it?.url?.toLowerCase().endsWith(".docx")) {
                list.push({ name: it.name || it.url.split("/").pop(), source: "server", url: it.url });
              }
            });
          }
        }
      } catch { }

      // 2) Itens privados no OPFS (manifesto + descoberta do diretório)
      try {
        const manifest = await readJSON("index.json"); // pode estar vazio
        manifest.forEach((it) => {
          if (it?.path?.toLowerCase().endsWith(".docx")) {
            list.push({ name: it.name || it.path.split("/").pop(), source: "opfs", path: it.path });
          }
        });
        // (opcional) incluir arquivos “soltos” no OPFS:/files, caso não estejam no manifesto
        const discovered = await listDocx("files");
        discovered.forEach((f) => {
          if (!list.some((x) => x.source === "opfs" && x.path === f.path)) {
            list.push({ name: f.name, source: "opfs", path: f.path });
          }
        });
      } catch { }

      setFiles(list);
      setLoading(false);
    })();
  }, []);

  const pretty = (k) =>
    k.replace(/[_\-.]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, (c) => c.toUpperCase());

  async function parseTemplate(fileRef) {
    setParsing(true);
    try {
      let arrayBuffer;
      if (fileRef.source === "server") {
        const resp = await fetch(fileRef.url);
        arrayBuffer = await resp.arrayBuffer();
      } else {
        const file = await readFile(fileRef.path); // File (Blob) do OPFS
        arrayBuffer = await file.arrayBuffer();
      }

      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
      const fullText = doc.getFullText ? doc.getFullText() : "";
      const found = Array.from(fullText.matchAll(/\{([\w.\-]+)\}/g)).map((m) => m[1]);
      const unique = Array.from(new Set(found));

      setKeys(unique);
      setForm(Object.fromEntries(unique.map((k) => [k, ""])));
    } catch (e) {
      console.error(e);
      setKeys([]);
      setForm({});
      alert("Não foi possível ler o modelo selecionado.");
    } finally {
      setParsing(false);
    }
  }

  function handleSelect(e) {
    const idx = Number(e.target.value);
    const f = files[idx] || null;
    setSelected(f);
    setKeys([]);
    setForm({});
    if (f) parseTemplate(f);
  }

  function handleChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function handleGenerate() {
    if (!selected) return alert("Selecione um modelo.");
    if (!validateForm(form)) return alert("⚠️ Preencha todos os campos.");

    try {
      if (selected.source === "server") {
        await generateContractFromTemplate(form, selected.url); // URL
      } else {
        // OPFS: passamos o ArrayBuffer direto para o gerador
        const file = await readFile(selected.path);
        const ab = await file.arrayBuffer();
        await generateContractFromTemplate(form, ab); // ArrayBuffer
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar contrato, veja o console.");
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
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

      <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-2xl p-8 max-w-3xl w-full text-white">
        <div className="flex justify-center mb-6">
          <img src="/title-image.svg" alt="Título" className="max-w-full h-auto" />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm text-gray-300">Selecione um modelo (.docx)</label>
          <select
            onChange={handleSelect}
            className="w-full bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            defaultValue=""
            disabled={loading}
          >
            <option value="" disabled>
              {loading ? "Carregando..." : "Escolha um arquivo"}
            </option>
            {files.map((f, i) => (
              <option key={`${f.source}-${i}`} value={i}>
                {f.name} {f.source === "opfs" ? "• (local)" : ""}
              </option>
            ))}
          </select>

          {!loading && files.length === 0 && (
            <p className="mt-3 text-yellow-300 text-sm">
              Nenhum arquivo encontrado. Faça upload em <strong>Upload de arquivo</strong>.
            </p>
          )}
        </div>

        {selected && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">
              {parsing ? "Lendo chaves do modelo..." : `Preencha os campos (${keys.length})`}
            </h2>

            {parsing ? (
              <div className="text-gray-300 text-sm">Aguarde…</div>
            ) : keys.length === 0 ? (
              <div className="text-gray-300 text-sm">
                Nenhuma chave <code>{`{chave}`}</code> detectada.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {keys.map((k) => (
                  <input
                    key={k}
                    name={k}
                    placeholder={pretty(k)}
                    value={form[k] || ""}
                    onChange={handleChange}
                    className="bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                ))}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={parsing || keys.length === 0}
              className="w-full bg-purple-600 disabled:bg-purple-900/60 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg shadow-md transition"
            >
              ✨ Gerar e Baixar Contrato
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 px-6 py-2 border border-purple-400 rounded-full text-purple-200 hover:bg-purple-600/20 transition"
      >
        Veja como usar <span className="underline">clicando aqui</span>
      </button>

      <InstructionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
