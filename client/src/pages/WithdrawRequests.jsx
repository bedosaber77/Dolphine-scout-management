import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';

const WithdrawRequests = () => {
  const [requests, setRequests] = useState([
    { id: 1, leaderName: 'أحمد', amount: 500, date: '2024-12-06' },
    { id: 2, leaderName: 'محمود', amount: 300, date: '2024-12-05' },
    { id: 3, leaderName: 'سارة', amount: 200, date: '2024-12-04' },
  ]);

  const handleAccept = (id) => {
    console.log(`Request ${id} accepted`);
    setRequests(requests.filter((request) => request.id !== id));
  };

  const handleReject = (id) => {
    console.log(`Request ${id} rejected`);
    setRequests(requests.filter((request) => request.id !== id));
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        طلبات السحب الحالية
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الرقم</TableCell>
              <TableCell>اسم القائد</TableCell>
              <TableCell>المبلغ</TableCell>
              <TableCell>التاريخ</TableCell>
              <TableCell>العمليات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.leaderName}</TableCell>
                <TableCell>{request.amount}</TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAccept(request.id)}
                    sx={{ marginRight: 1 }}
                  >
                    قبول
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleReject(request.id)}
                  >
                    رفض
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default WithdrawRequests;
