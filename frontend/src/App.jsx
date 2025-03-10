import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchFornecedores from './components/SearchFornecedores';
import CreateSupplier from './components/CreateSupplier';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';


const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql', 
  cache: new InMemoryCache(),
});


const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<SearchFornecedores />} />
          <Route path="/create-supplier" element={<CreateSupplier />} />
        </Routes>
      </div>
    </Router>
  </ApolloProvider>
);

export default App;
