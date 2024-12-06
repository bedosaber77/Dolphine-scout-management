import { useState } from 'react';
import { TextField, Button, FormControlLabel, Checkbox, Box, Typography } from '@mui/material';

const AddLeaderAccount = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [id, setId] = useState('');
  const [troops, setTroops] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = () => {
    // Handle the logic for creating a new leader account here
    console.log('Leader Created:', { name, phone, id, troops, isAdmin });
    alert('تم إضافة القائد بنجاح');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        إضافة حساب قائد جديد
      </Typography>
      <TextField
        label="الاسم"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="رقم الهاتف"
        fullWidth
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="الرقم التعريفي"
        fullWidth
        value={id}
        onChange={(e) => setId(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="الفرقة التي يقودها"
        fullWidth
        value={troops}
        onChange={(e) => setTroops(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        }
        label="هل هو مدير؟"
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ marginTop: 2 }}>
        إضافة
      </Button>
    </Box>
  );
};

export default AddLeaderAccount;
