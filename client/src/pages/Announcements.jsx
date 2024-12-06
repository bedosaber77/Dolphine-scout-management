import { useState } from 'react';
import { Button, TextField, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

const Announcements = () => {
  const [message, setMessage] = useState('');
  const [sendToScouts, setSendToScouts] = useState(false);
  const [sendToParents, setSendToParents] = useState(false);
  const [sendToLeaders, setSendToLeaders] = useState(false);

  const handleAnnouncement = () => {
    console.log('Announcement:', message);
    console.log('Send to Scouts:', sendToScouts);
    console.log('Send to Parents:', sendToParents);
    console.log('Send to Leaders:', sendToLeaders);
    alert('الإعلان تم إرساله');
  };

  return (
    <div>
      <h1>إرسال إعلان</h1>
      <TextField
        label="الإعلان"
        multiline
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
      />
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={sendToScouts}
              onChange={(e) => setSendToScouts(e.target.checked)}
            />
          }
          label="إرسال إلى الكشافين"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={sendToParents}
              onChange={(e) => setSendToParents(e.target.checked)}
            />
          }
          label="إرسال إلى أولياء الأمور"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={sendToLeaders}
              onChange={(e) => setSendToLeaders(e.target.checked)}
            />
          }
          label="إرسال إلى القادة"
        />
      </FormGroup>
      <Button
        variant="contained"
        onClick={handleAnnouncement}
        disabled={!message || (!sendToScouts && !sendToParents && !sendToLeaders)}
      >
        إرسال الإعلان
      </Button>
    </div>
  );
};

export default Announcements;
