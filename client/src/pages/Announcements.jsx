import { useState } from 'react';

const Announcements = () => {
  const [announcement, setAnnouncement] = useState('');
  const [recipients, setRecipients] = useState({
    scout: false,
    parent: false,
    leader: false,
  });

  const handleAnnouncementChange = (event) => {
    setAnnouncement(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setRecipients((prevRecipients) => ({
      ...prevRecipients,
      [name]: checked,
    }));
  };

  const handleSubmitAnnouncement = () => {
    // Check if the announcement is empty
    if (!announcement.trim()) {
      alert('يرجى كتابة الإعلان قبل الإرسال');
      return;
    }

    // Check if any recipient is selected
    const selectedRecipients = Object.keys(recipients).filter((recipient) => recipients[recipient]);

    if (selectedRecipients.length === 0) {
      alert('يرجى تحديد المستلمين للإعلان');
      return;
    }

    // Show a confirmation message
    alert(`تم إرسال الإعلان: "${announcement}" إلى: ${selectedRecipients.join(', ')}`);

    // Reset the form state
    setAnnouncement('');
    setRecipients({
      scout: false,
      parent: false,
      leader: false,
    });
  };

  const options = [
    { name: 'scout', label: 'إرسال إلى الكشافة' },
    { name: 'parent', label: 'إرسال إلى أولياء الأمور' },
    { name: 'leader', label: 'إرسال إلى القادة' },
  ];

  return (
    <div className="p-4">
      <textarea
        value={announcement}
        onChange={handleAnnouncementChange}
        className="w-full p-2 border border-gray-300 rounded mb-4 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
        rows="6"
        placeholder="اكتب إعلانك هنا..."
      />
      
      {/* Recipients Checkboxes */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">من سيرسل إليه الإعلان؟</label>
        <div className="space-y-4">
          {options.map((option) => (
            <label key={option.name} className="inline-flex items-center gap-x-2">
              <input
                type="checkbox"
                name={option.name}
                checked={recipients[option.name]}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <p className="ml-2">{option.label}</p>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitAnnouncement}
        className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
      >
        إرسال الإعلان
      </button>
    </div>
  );
};

export default Announcements;
