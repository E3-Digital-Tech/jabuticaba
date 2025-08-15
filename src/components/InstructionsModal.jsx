import React from "react";

export default function InstructionsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black text-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
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
          {`nomeEscritorio: RX gestão tributária
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
dataVencimento: 10/08/2025`}
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
  );
}
