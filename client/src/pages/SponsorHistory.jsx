import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const SponsorHistory = () => {
  const sponsors = [
    { id: 1, name: 'شركة الخير', totalDonation: 1500 },
    { id: 2, name: 'شركة الأمل', totalDonation: 1200 },
    { id: 3, name: 'مؤسسة النور', totalDonation: 800 },
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>الرقم</TableCell>
            <TableCell>اسم الراعي</TableCell>
            <TableCell>إجمالي التبرعات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sponsors.map((sponsor) => (
            <TableRow key={sponsor.id}>
              <TableCell>{sponsor.id}</TableCell>
              <TableCell>{sponsor.name}</TableCell>
              <TableCell>{sponsor.totalDonation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SponsorHistory;
