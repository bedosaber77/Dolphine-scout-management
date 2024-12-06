import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const LeadersView = () => {
  const leaders = [
    { id: 1, name: 'محمد', phone: '01099887766', troops: ['Troop 1', 'Troop 3'] },
    { id: 2, name: 'سعيد', phone: '01233445566', troops: ['Troop 2'] },
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>الرقم</TableCell>
            <TableCell>اسم القائد</TableCell>
            <TableCell>رقم الهاتف</TableCell>
            <TableCell>الفرق التي يقودها</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaders.map((leader) => (
            <TableRow key={leader.id}>
              <TableCell>{leader.id}</TableCell>
              <TableCell>{leader.name}</TableCell>
              <TableCell>{leader.phone}</TableCell>
              <TableCell>{leader.troops.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeadersView;
