import React, { useEffect, useState } from "react";
import InstructionsModal from "../components/InstructionsModal";
import { generateContractFromTemplate } from "../utils/docx";
import { validateForm } from "../utils/validation";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { supabase } from "../libs/supabase"; // <-- certifique-se do caminho

export default function GenerateFile({ onBack }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [files, setFiles] = useState([]); // { name, url }
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null); // { name, url }
  const [keys, setKeys] = useState([]);
  const [form, setForm] = useState({});
  const [parsing, setParsing] = useState(false);

  // Carrega do Supabase Storage
  async function loadFromSupabase(force = false) {
    setLoading(true);
    try {
      const list = [];

      // 1) Lista objetos em /files do bucket
      const { data: objs, error } = await supabase
        .storage
        .from("contracts") // <-- bucket
        .list("files", { limit: 1000 });

      if (error) {
        console.error("Erro ao listar Supabase:", error);
      } else if (Array.isArray(objs)) {
        for (const o of objs) {
          if (!o || !o.name || !o.name.toLowerCase().endsWith(".docx")) continue;
          const path = `files/${o.name}`;

          // 2) URL pública (se bucket público). Se for privado, use createSignedUrl.
          const { data: pub } = supabase.storage.from("contracts").getPublicUrl(path);
          let url = pub?.publicUrl || null;

          if (url) {
            // 3) cache buster para forçar o refresh no CDN/navegador
            url += (url.includes("?") ? "&" : "?") + `v=${force ? Date.now() : ""}`;
            list.push({ name: o.name, url });
          }
        }
      }

      // Ordena por nome (ou o que preferir)
      list.sort((a, b) => a.name.localeCompare(b.name));

      setFiles(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFromSupabase(false);
  }, []);

  function pretty(k) {
    return k
      .replace(/[_\-.]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  async function parseTemplate(fileRef) {
    setParsing(true);
    setKeys([]);
    setForm({});

    try {
      // força no-store no fetch do template
      const resp = await fetch(fileRef.url, { cache: "no-store" });
      if (!resp.ok) throw new Error("Falha ao baixar template");
      const arrayBuffer = await resp.arrayBuffer();

      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

      const fullText = doc.getFullText ? doc.getFullText() : "";
      const found = Array.from(fullText.matchAll(/\{([\w.\-]+)\}/g)).map((m) => m[1]);
      const unique = Array.from(new Set(found));

      setKeys(unique);
      setForm(Object.fromEntries(unique.map((k) => [k, ""])));
    } catch (e) {
      console.error("parseTemplate error:", e);
      alert("Não foi possível ler o modelo selecionado.");
    } finally {
      setParsing(false);
    }
  }

  function handleSelect(e) {
    const idx = Number(e.target.value);
    const f = files[idx] || null;
    setSelected(f);
    if (f) parseTemplate(f);
  }

  function handleChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function handleGenerate() {
    if (!selected) return alert("Selecione um modelo.");
    if (!validateForm(form)) return alert("⚠️ Preencha todos os campos.");

    try {
      await generateContractFromTemplate(form, selected.url); // utils/docx já lida com URL
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
      {/* Voltar */}
      <button
        onClick={onBack}
        className="fixed top-4 left-4 z-[60] px-4 py-2 rounded-full border border-gray-500/60 text-gray-200 bg-black/40 hover:bg-black/60 backdrop-blur transition"
      >
        ← Voltar
      </button>

      <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-2xl p-8 max-w-3xl w-full text-white">
        <div className="flex justify-between items-center mb-6">
          <img src="/title-image.svg" alt="Título" className="max-w-[180px] h-auto" />
          <button
            onClick={() => loadFromSupabase(true)}
            className="px-4 py-2 border border-gray-500/60 rounded-full text-gray-200 bg-black/40 hover:bg-black/60 backdrop-blur transition"
          >
            ↻ Recarregar
          </button>
        </div>

        {/* Select de modelos */}
        <div className="mb-6">
          <label className="block mb-2 text-sm text-gray-300">
            Selecione um modelo (.docx) do Supabase
          </label>
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
              <option key={f.url} value={i}>
                {f.name}
              </option>
            ))}
          </select>

          {!loading && files.length === 0 && (
            <p className="mt-3 text-yellow-300 text-sm">
              Nenhum arquivo encontrado no bucket <code>contracts/files</code>.
              Faça upload e clique em <em>Recarregar</em>.
            </p>
          )}
        </div>

        {/* Inputs dinâmicos */}
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
