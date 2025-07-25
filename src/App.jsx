import React, { useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

export default function App() {
  const [form, setForm] = useState({
    nomeEscritorio: "",
    cnpj: "",
    endereco: "",
    valorImplemetacao: "",
    vencimentoImplementacao: "",
    plano: "",
    valorPlano: "",
    valorPlanoAvista: "",
    qtdParcelas: "",
    valorParcela: "",
    qtdBoletos: "",
    valorBoleto: "",
    dataVencimento: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    return Object.values(form).every((val) => val.trim() !== "");
  };

  const generateContract = async () => {
    if (!validateForm()) {
      alert("⚠️ Por favor, preencha todos os campos antes de gerar o contrato.");
      return;
    }

    try {
      const response = await fetch("/contrato_modelo.docx");
      const arrayBuffer = await response.arrayBuffer();
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      doc.render(form);
      const blob = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      saveAs(blob, "Contrato_Preenchido.docx");
    } catch (e) {
      console.error("Erro ao gerar contrato:", e);
      alert("Erro ao gerar contrato, veja o console.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-purple-900 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🫐 Gerar Contrato Base
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            name="nomeEscritorio"
            placeholder="Nome do Escritório"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="cnpj"
            placeholder="CNPJ"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="endereco"
            placeholder="Endereço"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="valorImplemetacao"
            placeholder="Valor Implementação"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="vencimentoImplementacao"
            placeholder="Vencimento Implementação"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="plano"
            placeholder="Plano"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="valorPlano"
            placeholder="Valor do Plano"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="valorPlanoAvista"
            placeholder="Valor Plano à Vista"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="qtdParcelas"
            placeholder="Qtd Parcelas"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="valorParcela"
            placeholder="Valor da Parcela"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="qtdBoletos"
            placeholder="Qtd Boletos"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="valorBoleto"
            placeholder="Valor do Boleto"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="dataVencimento"
            placeholder="Data do 1º Vencimento"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          onClick={generateContract}
          className="w-full bg-purple-900 hover:bg-purple-400 text-white font-semibold py-3 rounded-lg shadow-md transition"
        >
          ✨ Gerar e Baixar Contrato
        </button>
      </div>
    </div>
  );
}
