import React, { useState, useEffect } from 'react';
import { request } from 'graphql-request';

const SearchFornecedores = () => {
  const [consumo, setConsumo] = useState('');
  const [estado, setEstado] = useState('');
  const [custoKwh, setCustoKwh] = useState('');
  const [limiteMinimoKwh, setLimiteMinimoKwh] = useState('');
  const [fornecedores, setFornecedores] = useState([]);
  const [message, setMessage] = useState('');
  const [estados, setEstados] = useState([]);  
  
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const query = `
          query {
            fornecedores {
              state
            }
          }
        `;
        const response = await request('http://localhost:5000/graphql', query);
        console.log(response); 
        
        const estadosUnicos = [...new Set(response.fornecedores.map(fornecedor => fornecedor.state))];
        setEstados(estadosUnicos);  
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchEstados();
  }, []);
  

  const handleSearch = async () => {
    try {
      const query = `
        query {
          fornecedores {
            id
            name
            cnpj
            state
            costPerKwh
            minKwhLimit
            numClients
            averageRating
          }
        }
      `;
      
      const response = await request('http://localhost:5000/graphql', query);
      
      let filteredFornecedores = response.fornecedores;
  
      if (estado) {
        filteredFornecedores = filteredFornecedores.filter(fornecedor => 
          fornecedor.state && fornecedor.state.toLowerCase && fornecedor.state.toLowerCase().includes(estado.toLowerCase())
        );
      }
  
      if (custoKwh) {
        filteredFornecedores = filteredFornecedores.filter(fornecedor => 
          fornecedor.costPerKwh && fornecedor.costPerKwh <= parseFloat(custoKwh)
        );
      }
      if (limiteMinimoKwh) {
        filteredFornecedores = filteredFornecedores.filter(fornecedor => 
          fornecedor.minKwhLimit && fornecedor.minKwhLimit >= parseFloat(limiteMinimoKwh)
        );
      }
      if (filteredFornecedores.length === 0) {
        setMessage('Nenhum fornecedor encontrado para os critérios fornecidos.');
      } else {
        setMessage('');
      }
  
      setFornecedores(filteredFornecedores);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Pesquisa de Fornecedores</h1>

        <div className="mb-4">
            <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full mb-2"
            >
            <option value="">Selecione o estado</option>
            {estados.map((estadoItem, index) => (
                <option key={index} value={estadoItem}>
                {estadoItem}
                </option>
            ))}
            </select>

        
       

          <input
            type="number"
            value={custoKwh}
            onChange={(e) => setCustoKwh(e.target.value)}
            onKeyPress={handleKeyPress}
            className="p-2 border border-gray-300 rounded w-full mb-2"
            placeholder="Custo por kWh"
          />
          
          <input
            type="number"
            value={limiteMinimoKwh}
            onChange={(e) => setLimiteMinimoKwh(e.target.value)}
            onKeyPress={handleKeyPress}
            className="p-2 border border-gray-300 rounded w-full mb-2"
            placeholder="Limite mínimo"
          />

          <button
            onClick={handleSearch}
            className="mt-4 w-full py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Buscar
          </button>
        </div>

        {message && <p className="text-red-500 text-center mb-4">{message}</p>}

        <div>
          {fornecedores.length === 0 ? (
            <p className="text-center text-gray-500">Não há fornecedores para os critérios selecionados.</p>
          ) : (
            fornecedores.map((fornecedor) => (
              <div key={fornecedor.cnpj} className="p-4 bg-gray-50 mb-4 rounded shadow-md">
                <h2 className="text-xl font-semibold">{fornecedor.name}</h2>
                <p>Estado: {fornecedor.state}</p>
                <p>Custo kWh: {fornecedor.costPerKwh}</p>
                <p>Limite mínimo kWh: {fornecedor.minKwhLimit}</p>
                <p>Clientes: {fornecedor.numClients}</p>
                <p>Avaliação média: {fornecedor.averageRating}</p>

                <a
                  href={`https://wa.me/5584999533663?text=Olá, gostaria de saber mais sobre o fornecedor ${fornecedor.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-green-500 hover:underline"
                >
                  Entrar em contato via WhatsApp
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFornecedores;
