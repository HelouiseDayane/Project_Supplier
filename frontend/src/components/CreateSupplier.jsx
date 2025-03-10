import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { TextField, Button, Card, CardContent, Typography, Grid, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert } from '@mui/material';
import InputMask from 'react-input-mask';
import Tabela from './Tabela'; 

const CREATE_SUPPLIER = gql`
  mutation createSupplier(
    $name: String!,
    $cnpj: String!,
    $state: String!,
    $custoKwh: Float!,
    $limiteMinimoKwh: Float!,
    $numClients: Int!,
    $avaliacaoMedia: Float!,
    $logo: Upload!
  ) {
    createSupplier(
      name: $name,
      cnpj: $cnpj,
      state: $state,
      custoKwh: $custoKwh,
      limiteMinimoKwh: $limiteMinimoKwh,
      numClients: $numClients,
      avaliacaoMedia: $avaliacaoMedia,
      logo: $logo
    ) {
      supplier {
        id
        name
        cnpj
        state
        costPerKwh
        minKwhLimit
        numClients
        averageRating
        logo
      }
    }
  }
`;

const CreateSupplier = () => {
  const [createSupplier] = useMutation(CREATE_SUPPLIER);
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    state: '',
    custoKwh: '',
    limiteMinimoKwh: '',
    numClients: '',
    avaliacaoMedia: '',
    logo: null 
  });

  const [estados, setEstados] = useState([]);
  const [fornecedores, setFornecedores] = useState([]); 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(''); 
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetch("https://brasilapi.com.br/api/ibge/uf/v1")
      .then((res) => res.json())
      .then((data) => setEstados(data));

  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value, 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newFormData = {
      ...formData,
      custoKwh: parseFloat(formData.custoKwh),
      avaliacaoMedia: parseFloat(formData.avaliacaoMedia),
      limiteMinimoKwh: parseFloat(formData.limiteMinimoKwh),  
    };
    
    const formDataWithLogo = new FormData();
    Object.keys(newFormData).forEach((key) => {
      if (key === "logo" && formData.logo) {
        formDataWithLogo.append(key, formData.logo);
      } else {
        formDataWithLogo.append(key, newFormData[key]);
      }
    });
    
    try {
      const { data } = await createSupplier({
        variables: {
          name: newFormData.name,
          cnpj: newFormData.cnpj,
          state: newFormData.state,
          custoKwh: newFormData.custoKwh,
          limiteMinimoKwh: newFormData.limiteMinimoKwh,
          numClients: newFormData.numClients,
          avaliacaoMedia: newFormData.avaliacaoMedia,
          logo: formData.logo,
        }
      });
      setSnackbarMessage('Fornecedor criado com sucesso!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      setFornecedores((prev) => [...prev, data.createSupplier.supplier]);

      setFormData({
        name: '',
        cnpj: '',
        state: '',
        custoKwh: '',
        limiteMinimoKwh: '',
        numClients: '',
        avaliacaoMedia: '',
        logo: null
      });

    } catch (error) {
      console.error('Error creating supplier', error);
      const errorMessage = error?.graphQLErrors?.[0]?.message || 'Erro desconhecido';
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px' }}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Criar Fornecedor
          </Typography>
          <form onSubmit={handleSubmit}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nome"
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputMask
                  mask="99.999.999/9999-99"
                  value={formData.cnpj}
                  onChange={handleChange}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      label="CNPJ"
                      variant="outlined"
                      fullWidth
                      name="cnpj"
                      required
                    />
                  )}
                </InputMask>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Estado</InputLabel>
                  <Select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      label="Estado"
                  >
                      {estados.map((estado) => (
                        <MenuItem key={estado.id} value={estado.nome}>
                          {estado.nome} 
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Custo KWh"
                  variant="outlined"
                  fullWidth
                  name="custoKwh"
                  value={formData.custoKwh}
                  onChange={handleChange}
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Limite Mínimo KWh"
                  variant="outlined"
                  fullWidth
                  name="limiteMinimoKwh"
                  value={formData.limiteMinimoKwh}
                  onChange={handleChange}
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Número de Clientes"
                  variant="outlined"
                  fullWidth
                  name="numClients"
                  value={formData.numClients}
                  onChange={handleChange}
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Avaliação Média"
                  variant="outlined"
                  fullWidth
                  name="avaliacaoMedia"
                  value={formData.avaliacaoMedia}
                  onChange={handleChange}
                  required
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  className="bg-green-500 text-white hover:bg-blue-700"
                >
                  Criar Fornecedor
                </Button>
              </Grid>
            </Grid>
          </form>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Tabela fornecedores={fornecedores} />
    </div>
  );
};

export default CreateSupplier;
