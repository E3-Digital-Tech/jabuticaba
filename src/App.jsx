import React, { useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: "url('/teste.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-black/40 backdrop-blur-md shadow-lg rounded-2xl p-8 max-w-3xl w-full">
        <div className="flex justify-center mb-6">
          <img
            src="/title-image.svg"
            alt="Título"
            className="max-w-full h-auto"
          />
        </div>

        {/* Inputs com fundo transparente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            name="nomeEscritorio"
            placeholder="Nome do Escritório"
            onChange={handleChange}
            className="bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="cnpj"
            placeholder="CNPJ"
            onChange={handleChange}
            className="bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"

          />
          <input
            name="endereco"
            placeholder="Endereço"
            onChange={handleChange}
            className="bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"

          />
          <input
            name="valorImplemetacao"
            placeholder="Valor Implementação"
            onChange={handleChange}
            className="bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"

          />
          <input
            name="vencimentoImplementacao"
            placeholder="Vencimento Implementação"
            onChange={handleChange}
            className="bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"

          />
          <input
            name="plano"
            placeholder="Plano"
            onChange={handleChange}
            className="bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"

          />
          <input
            name="valorPlano"
            placeholder="Valor do Plano"
            onChange={handleChange}
            className="bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"

          />
          <input
            name="valorPlanoAvista"
            placeholder="Valor Plano à Vista"
            onChange={handleChange}
            className="bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"

          />
          <input
            name="qtdParcelas"
            placeholder="Qtd Parcelas"
            onChange={handleChange}
            className="bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"

          />
          <input
            name="valorParcela"
            placeholder="Valor da Parcela"
            onChange={handleChange}
            className="bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"

          />
          <input
            name="qtdBoletos"
            placeholder="Qtd Boletos"
            onChange={handleChange}
            className="bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"

          />
          <input
            name="valorBoleto"
            placeholder="Valor do Boleto"
            onChange={handleChange}
            className="bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"

          />
          <input
            name="dataVencimento"
            placeholder="Data do 1º Vencimento"
            onChange={handleChange}
            className="bg-black/30 text-gray-200 border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"

          />
        </div>

        <button
          onClick={generateContract}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg shadow-md transition"
        >
          ✨ Gerar e Baixar Contrato
        </button>
      </div>
      {/* Botão estilo do print */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 px-6 py-2 border border-purple-400 rounded-full text-purple-200 hover:bg-purple-600/20 transition"
      >
        Veja como usar <span className="underline">clicando aqui</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black text-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            {/* Botão de fechar */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h1 className="text-2xl font-bold mb-4">📝 Instruções para Preenchimento dos Campos</h1>
            <p className="mb-4 text-gray-300">
              Este projeto gera automaticamente um contrato .docx a partir de um modelo base.<br />
              <span className="text-yellow-400 font-semibold">
                ⚠️ Para que o contrato seja gerado corretamente, é necessário preencher TODOS os campos seguindo exatamente o padrão abaixo.
              </span>
            </p>

            <hr className="my-4 border-gray-700" />

            <h2 className="text-xl font-semibold mb-2">📌 Padrão de Preenchimento dos Campos</h2>
            <table className="w-full border border-gray-700 text-sm mb-6">
              <thead className="bg-gray-800">
                <tr>
                  <th className="border border-gray-700 p-2">Campo</th>
                  <th className="border border-gray-700 p-2">Exemplo de Preenchimento</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-700 p-2">nomeEscritorio</td><td className="border border-gray-700 p-2">RX gestão tributária</td></tr>
                <tr><td className="border border-gray-700 p-2">cnpj</td><td className="border border-gray-700 p-2">43.555.776/0001-80</td></tr>
                <tr><td className="border border-gray-700 p-2">endereco</td><td className="border border-gray-700 p-2">Avenida Senador Lemos, Nº 791, sala 604, CEP: 66050-005, Belém, PA</td></tr>
                <tr><td className="border border-gray-700 p-2">valorImplemetacao</td><td className="border border-gray-700 p-2">R$ 400,00 (quatrocentos reais)</td></tr>
                <tr><td className="border border-gray-700 p-2">vencimentoImplementacao</td><td className="border border-gray-700 p-2">25/07/2025</td></tr>
                <tr><td className="border border-gray-700 p-2">plano</td><td className="border border-gray-700 p-2">ligth</td></tr>
                <tr><td className="border border-gray-700 p-2">valorPlano</td><td className="border border-gray-700 p-2">R$ 7000,00 (sete mil reais)</td></tr>
                <tr><td className="border border-gray-700 p-2">valorPlanoAvista</td><td className="border border-gray-700 p-2">R$ 7000,00</td></tr>
                <tr><td className="border border-gray-700 p-2">qtdParcelas</td><td className="border border-gray-700 p-2">7 (sete)</td></tr>
                <tr><td className="border border-gray-700 p-2">valorParcela</td><td className="border border-gray-700 p-2">R$ 1.000,00</td></tr>
                <tr><td className="border border-gray-700 p-2">qtdBoletos</td><td className="border border-gray-700 p-2">4</td></tr>
                <tr><td className="border border-gray-700 p-2">valorBoleto</td><td className="border border-gray-700 p-2">R$ 1.750,00 (mil setecentos e cinquenta reais)</td></tr>
                <tr><td className="border border-gray-700 p-2">dataVencimento</td><td className="border border-gray-700 p-2">10/08/2025</td></tr>
              </tbody>
            </table>

            <h2 className="text-xl font-semibold mb-2">✅ Regras Importantes</h2>
            <ul className="list-disc list-inside text-gray-300 mb-6">
              <li>✨ Todos os campos são obrigatórios.</li>
              <li>✨ Siga <strong>exatamente</strong> os formatos acima (inclusive pontuação e símbolos como R$ e vírgulas).</li>
              <li>✨ Valores monetários devem incluir o número e o valor por extenso entre parênteses, quando especificado.</li>
              <li>✨ Datas no formato <em>dd/mm/aaaa</em>.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2">📄 Exemplo Completo</h2>
            <pre className="bg-gray-900 p-3 rounded text-sm mb-6 overflow-x-auto text-gray-300">
              nomeEscritorio: RX gestão tributária
              cnpj: 43.555.776/0001-80
              endereco: Avenida Senador Lemos, Nº 791, sala 604, CEP: 66050-005, Belém, PA
              valorImplemetacao: R$ 400,00 (quatrocentos reais)
              vencimentoImplementacao: 25/07/2025
              plano: ligth
              valorPlano: R$ 7000,00 (sete mil reais)
              valorPlanoAvista: R$ 7000,00
              qtdParcelas: 7 (sete)
              valorParcela: R$ 1.000,00
              qtdBoletos: 4
              valorBoleto: R$ 1.750,00 (mil setecentos e cinquenta reais)
              dataVencimento: 10/08/2025
            </pre>

            <h2 className="text-xl font-semibold mb-2">⚠️ Dicas para Evitar Erros</h2>
            <ul className="list-disc list-inside text-gray-300">
              <li>✅ Copie os exemplos e altere apenas os valores.</li>
              <li>✅ Revise os campos antes de gerar o contrato.</li>
              <li>✅ Campos fora do padrão podem impedir a geração correta.</li>
            </ul>

            <p className="mt-6 text-green-400 font-semibold">
              ✨ Seguindo essas instruções, seu contrato será gerado sem erros! 🚀
            </p>
          </div>
        </div>
      )}

    </div>
  );
}