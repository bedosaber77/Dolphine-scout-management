import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import useAuthStore from '../store/authStore';
import SendIcon from '@mui/icons-material/Send';
import useApi from '../hooks/useApi.jsx';
import '../styles/custom.css';
import axios from 'axios';

function Settings() {
  const user = useAuthStore((state) => state.user);
  const fetchUserDetails = useAuthStore((state) => state.fetchUserDetails);
  const [newuser, setNewUser] = useState({
    Fname: '',
    Lname: '',
    Phonenum: '',
  });
  const [isFirstNameDisabled, setIsFirstNameDisabled] = useState(true);
  const [isLastNameDisabled, setIsLastNameDisabled] = useState(true);
  const [isPhoneNumberDisabled, setIsPhoneNumberDisabled] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const apiRequest = useApi();

  useEffect(() => {
    setLoading(true);
    setNewUser({
      Fname: user?.Fname,
      Lname: user?.Lname,
      Phonenum: user?.Phonenum,
    });
    setLoading(false);
  }, [user]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const handleDialogSubmit = () => {
    const data = {
      email: user.email,
      oldPassword,
      newPassword,
    };
    axios
      .put(`${import.meta.env.VITE_BASEURL}/api/auth/updatePassword`, data, {
        headers: {
          accessToken: useAuthStore.getState().accessToken,
        },
      })
      .then((response) => {
        console.log('Response from changing password:', response);
        if (response.status === 200) {
          setSnackbarMessage('تم تغيير كلمة المرور بنجاح');
          setSnackbarSeverity('success');
        } else {
          console.log('hhhere');
          setSnackbarMessage('حدث خطأ أثناء تغيير كلمة المرور');
          setSnackbarSeverity('error');
        }
      })
      .catch((error) => {
        console.error('Error changing password:', error);
        setSnackbarMessage('حدث خطأ أثناء تغيير كلمة المرور');
        setSnackbarSeverity('error');
      })
      .finally(() => {
        setSnackbarOpen(true);
      });
  };

  const updateSettings = async () => {
    setLoading(true);
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `${import.meta.env.VITE_BASEURL}/api/users/${user?.User_ID}`,
        data: {
          Fname: newuser.Fname,
          Lname: newuser.Lname,
          Phonenum: newuser.Phonenum,
        },
      });
      if (response.status === 200) {
        fetchUserDetails(user.User_ID);
        setSnackbarMessage('تم تحديث البيانات بنجاح');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('حدث خطأ أثناء تحديث البيانات');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      setSnackbarMessage('حدث خطأ أثناء تحديث البيانات');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  return (
    <Container>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: 'Changa, Roboto', textAlign: 'center' }}
      >
        إعدادات الحساب
      </Typography>
      <Box sx={{ maxWidth: 600, margin: '0 auto' }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <form noValidate autoComplete="off">
            <div className="flex gap-6">
              <TextField
                label="الاسم الأول"
                variant="outlined"
                disabled={isFirstNameDisabled}
                fullWidth
                margin="normal"
                value={newuser.Fname}
                onBlur={() => setIsFirstNameDisabled(true)}
                onChange={(e) => {
                  setNewUser({ ...newuser, Fname: e.target.value });
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsFirstNameDisabled(false)}
              >
                تعديل
              </Button>
            </div>
            <div className="flex gap-6">
              <TextField
                label="اسم العائلة"
                variant="outlined"
                disabled={isLastNameDisabled}
                fullWidth
                margin="normal"
                value={newuser.Lname}
                onBlur={() => setIsLastNameDisabled(true)}
                onChange={(e) => {
                  setNewUser({ ...newuser, Lname: e.target.value });
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsLastNameDisabled(false)}
              >
                تعديل
              </Button>
            </div>
            <div className="flex gap-6">
              <TextField
                label="رقم الهاتف"
                variant="outlined"
                disabled={isPhoneNumberDisabled}
                fullWidth
                margin="normal"
                value={newuser.Phonenum}
                onBlur={() => setIsPhoneNumberDisabled(true)}
                onChange={(e) => {
                  setNewUser({ ...newuser, Phonenum: e.target.value });
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsPhoneNumberDisabled(false)}
              >
                تعديل
              </Button>
            </div>
          </form>
        )}
        <div className="flex justify-around">
          <Button
            variant="contained"
            color="primary"
            sx={{
              textAlign: 'center',
              fontSize: '1.5rem',
            }}
            onClick={() => {
              updateSettings();
            }}
            disabled={loading}
          >
            حفظ الاعدادات
            <SendIcon />
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              textAlign: 'center',
              fontSize: '1.5rem',
            }}
            onClick={handleDialogOpen}
            disabled={loading}
          >
            تغيير كلمة المرور
          </Button>
        </div>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>تغيير كلمة المرور</DialogTitle>
        <DialogContent>
          <DialogContentText>
            أدخل كلمة المرور الحالية وكلمة المرور الجديدة لتغيير كلمة المرور.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="كلمة المرور الحالية"
            type="password"
            fullWidth
            variant="outlined"
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="كلمة المرور الجديدة"
            type="password"
            fullWidth
            variant="outlined"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            إلغاء
          </Button>
          <Button
            onClick={() => {
              handleDialogSubmit();
              handleDialogClose();
            }}
            color="primary"
          >
            حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Settings;
