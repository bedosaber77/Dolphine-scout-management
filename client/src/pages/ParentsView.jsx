import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ParentsView = () => {
  const parents = [
    { id: 1, name: 'خالد', phone: '01234567890', children: ['أحمد', 'علي'] },
    { id: 2, name: 'حسن', phone: '01123456789', children: ['سارة'] },
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>الرقم</TableCell>
            <TableCell>اسم ولي الأمر</TableCell>
            <TableCell>رقم الهاتف</TableCell>
            <TableCell>الأبناء</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parents.map((parent) => (
            <TableRow key={parent.id}>
              <TableCell>{parent.id}</TableCell>
              <TableCell>{parent.name}</TableCell>
              <TableCell>{parent.phone}</TableCell>
              <TableCell>{parent.children.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ParentsView;
