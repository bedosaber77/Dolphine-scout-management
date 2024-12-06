import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ScoutsView = () => {
  const scouts = [
    { id: 1, name: 'أحمد', phone: '01012345678', leader: 'محمد', troop: 'Troop 1' },
    { id: 2, name: 'علي', phone: '01198765432', leader: 'سعيد', troop: 'Troop 2' },
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>الرقم</TableCell>
            <TableCell>اسم الكشاف</TableCell>
            <TableCell>رقم الهاتف</TableCell>
            <TableCell>القائد</TableCell>
            <TableCell>اسم أو رقم الفرقة</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scouts.map((scout) => (
            <TableRow key={scout.id}>
              <TableCell>{scout.id}</TableCell>
              <TableCell>{scout.name}</TableCell>
              <TableCell>{scout.phone}</TableCell>
              <TableCell>{scout.leader}</TableCell>
              <TableCell>{scout.troop}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ScoutsView;
