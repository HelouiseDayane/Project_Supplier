import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, TextField } from '@mui/material';

const GET_SUPPLIERS = gql`
  query {
    fornecedores {
      id
      name
      cnpj
      state
      costPerKwh
      numClients
      averageRating
      logo
    }
  }
`;

const UPDATE_SUPPLIER = gql`
  mutation updateSupplier(
    $id: ID!
    $name: String!
    $cnpj: String!
    $state: String!
    $costPerKwh: Float!
    $numClients: Int!
    $averageRating: Float!
    $logo: String!
  ) {
    updateSupplier(
      id: $id
      name: $name
      cnpj: $cnpj
      state: $state
      costPerKwh: $costPerKwh
      numClients: $numClients
      averageRating: $averageRating
      logo: $logo
    ) {
      supplier {
        id
        name
        cnpj
        state
        costPerKwh
        numClients
        averageRating
        logo
      }
    }
  }
`;

const DELETE_SUPPLIER = gql`
  mutation deleteSupplier($id: Int!) {
    deleteSupplier(id: $id) {
      success  
    }
  }
`;

const Tabela = () => {
  const { loading, error, data } = useQuery(GET_SUPPLIERS);
  const [updateSupplier] = useMutation(UPDATE_SUPPLIER);
  const [deleteSupplier] = useMutation(DELETE_SUPPLIER);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    state: '',
    costPerKwh: 0,
    numClients: 0,
    averageRating: 0,
    logo: '',
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      cnpj: supplier.cnpj,
      state: supplier.state,
      costPerKwh: supplier.costPerKwh,
      numClients: supplier.numClients,
      averageRating: supplier.averageRating,
      logo: supplier.logo,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDelete = async (id) => {
    console.log("ID recebido:", id);
  
    if (!id || isNaN(parseInt(id))) {
      console.error("ID inválido!");
      return;
    }
  
    try {
      await deleteSupplier({ variables: { id: parseInt(id, 10) } });
      console.log("Fornecedor deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar fornecedor", error);
    }
  };
  
  
  const handleSubmit = async () => {
    await updateSupplier({
      variables: {
        id: selectedSupplier.id,
        name: formData.name,
        cnpj: formData.cnpj,
        state: formData.state,
        costPerKwh: formData.costPerKwh,
        numClients: formData.numClients,
        averageRating: formData.averageRating,
        logo: formData.logo,
      },
    });
    setOpenModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>CNPJ</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Custo KWh</TableCell>
            <TableCell>Num. Clientes</TableCell>
            <TableCell>Avaliação Média</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.fornecedores.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell>{supplier.name}</TableCell>
              <TableCell>{supplier.cnpj}</TableCell>
              <TableCell>{supplier.state}</TableCell>
              <TableCell>{supplier.costPerKwh}</TableCell>
              <TableCell>{supplier.numClients}</TableCell>
              <TableCell>{supplier.averageRating}</TableCell>
              <TableCell>
                <Button variant="outlined" color="primary" onClick={() => handleEdit(supplier)}>
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  style={{ marginLeft: '10px' }}
                  onClick={() => handleDelete(supplier.id)}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal para Editar Fornecedor */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            margin: '50px auto',
            maxWidth: '500px',
            borderRadius: '8px',
          }}
        >
          <h2>Editar Fornecedor</h2>
          <TextField
            name="name"
            label="Nome"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="cnpj"
            label="CNPJ"
            value={formData.cnpj}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="state"
            label="Estado"
            value={formData.state}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="costPerKwh"
            label="Custo KWh"
            type="number"
            value={formData.costPerKwh}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="numClients"
            label="Número de Clientes"
            type="number"
            value={formData.numClients}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="averageRating"
            label="Avaliação Média"
            type="number"
            value={formData.averageRating}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="logo"
            label="Logo"
            value={formData.logo}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
            Atualizar Fornecedor
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Tabela;
