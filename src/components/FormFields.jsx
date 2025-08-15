import React from "react";

export default function FormFields({ handleChange }) {
  return (
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
  );
}
