import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

const TransactionsView = () => {
  const transactions = [
    { id: 1, name: 'محمد', type: 'داخل', amount: 500, date: '2024-12-06' },
    { id: 2, name: 'خالد', type: 'خارج', amount: 300, date: '2024-12-05' },
    { id: 3, name: 'سارة', type: 'داخل', amount: 200, date: '2024-12-04' },
  ];

  const totalBalance = transactions.reduce((total, transaction) => {
    if (transaction.type === 'داخل') {
      return total + transaction.amount;
    } else if (transaction.type === 'خارج') {
      return total - transaction.amount;
    }
    return total;
  }, 0);

  return (
    <div>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">إجمالي الرصيد: {totalBalance} جنيه</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الرقم</TableCell>
              <TableCell>اسم الراعي أو القائد</TableCell>
              <TableCell>النوع</TableCell>
              <TableCell>المبلغ</TableCell>
              <TableCell>التاريخ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.name}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TransactionsView;
