import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const CampsAdmin = () => {
  const apiRequest = useApi();
  const [loading, setLoading] = useState(true);

  const [locations, setLocations] = useState([]);
  const [scoutLeaders, setScoutLeaders] = useState([]);
  const [EventsData, setEventsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [event, setEvent] = useState({
    Budget: '',
    Ename: '',
    Edate: '',
    Location_ID: '',
    ScoutLeader_ID: '',
    Season: '',
    Duration: '',
  });

  const [images, setImages] = useState([]);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    setImages(files);
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEventID, setSelectedEventID] = useState(null);
  const [processedEvents, setProcessedEvents] = useState([]);

  useEffect(() => {
    const processEvents = () => {
      const processed = EventsData.map((event) => {
        const location = locations.find(
          (loc) => loc.Location_ID === event.Location_ID
        );
        const leader = scoutLeaders.find(
          (leader) => leader.User_ID === event.ScoutLeader_ID
        );

        return {
          ...event,
          LocationName: location ? location.LocationName : 'Unknown',
          LeaderName: leader ? `${leader.Fname} ${leader.Lname}` : 'Unknown',
        };
      });
      setProcessedEvents(processed);
    };

    if (EventsData.length && locations.length && scoutLeaders.length) {
      processEvents();
    }
  }, [EventsData, locations, scoutLeaders]);

  useEffect(() => {
    const fetchEventsData = async () => {
      return apiRequest({
        url: 'http://localhost:3000/api/camps/',
        method: 'GET',
      });
    };
    const fetchLocations = async () => {
      return apiRequest({
        url: 'http://localhost:3000/api/Locations/',
        method: 'GET',
      });
    };

    const fetchScoutLeaders = async () => {
      return apiRequest({
        url: 'http://localhost:3000/api/Scoutleaders/',
        method: 'GET',
      });
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const eventsResponse = await fetchEventsData();
        const locationsResponse = await fetchLocations();
        const scoutLeadersResponse = await fetchScoutLeaders();
        setEventsData(eventsResponse.data);
        setLocations(locationsResponse.data);
        setScoutLeaders(scoutLeadersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiRequest]);

  // Add or update an event
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append event fields to FormData
    formData.append('Budget', event.Budget);
    formData.append('Ename', event.Ename);
    formData.append('Edate', event.Edate);
    formData.append('Location_ID', event.Location_ID);
    formData.append('ScoutLeader_ID', event.ScoutLeader_ID);
    formData.append('Season', event.Season);
    formData.append('Duration', event.Duration);

    // Append images to FormData (assumes "images" is an array of File objects)
    images.forEach((image) => {
      formData.append('images', image); // Each image is appended under 'images'
    });
    if (isEditMode && selectedEventID) {
      try {
        await apiRequest({
          url: `http://localhost:3000/api/events/${selectedEventID}`,
          method: 'PUT',
          data: formData,
        });
        await apiRequest({
          url: `http://localhost:3000/api/camps/${selectedEventID}`,
          method: 'PUT',
          data: { ...event, Duration: `${event.Duration} days` },
        });
        setEventsData((prevData) =>
          prevData.map((eve) =>
            eve.Event_ID === selectedEventID ? event : eve
          )
        );
      } catch (error) {
        console.error('Error updating event:', error);
      }
    } else {
      try {
        const response = await apiRequest({
          url: 'http://localhost:3000/api/events/',
          method: 'POST',
          data: formData,
        });
        const response2 = await apiRequest({
          url: 'http://localhost:3000/api/camps/',
          method: 'POST',
          data: {
            ...event,
            Duration: `${event.Duration} days`,
            Event_ID: response.data.Event.Event_ID.toString(),
          },
        });
        const newEvent = { ...response.data.Event, ...response2.data };
        setEventsData([...EventsData, newEvent]);
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
    setEvent({
      Budget: '',
      Ename: '',
      Edate: '',
      Location_ID: '',
      ScoutLeader_ID: '',
      Season: '',
      Duration: '',
    });
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  // Open delete confirmation dialog
  const handleDelete = (Event_ID) => {
    setSelectedEventID(Event_ID);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await apiRequest({
        url: `http://localhost:3000/api/events/${selectedEventID}`,
        method: 'DELETE',
      });
      setEventsData(
        EventsData.filter((event) => event.Event_ID !== selectedEventID)
      );
      setIsDeleteDialogOpen(false);
      selectedEventID(null);
    } catch (error) {
      console.error(error);
    }
  };

  const onChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  // Handle edit
  const handleEdit = (Event_ID) => {
    setSelectedEventID(Event_ID);
    const selectedEvent = processedEvents.find(
      (event) => event.Event_ID === Event_ID
    );
    setEvent(selectedEvent);
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  return (
    <div className="p-4 rounded-2xl">
      <div className="flex justify-between justify-center">
        <h2
          className="mb-4 text-3xl font-bold"
          style={{ color: 'var(--secondary-color)' }}
        >
          قائمة المعسكرات
        </h2>

        {/* Add event Button */}
        <button
          onClick={() => {
            // Clear the form state for adding new equipment
            setEvent({
              Budget: '',
              Ename: '',
              Edate: '',
              Location_ID: '',
              ScoutLeader_ID: '',
              Season: '',
              Duration: '',
            });
            setIsModalOpen(true);
          }}
          className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
          style={{ background: 'var(--secondary-color)' }}
        >
          إضافة معسكر
        </button>
      </div>

      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : processedEvents.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">لا يوجد معسكرات للعرض</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 mt-4">
            <thead
              className="sticky top-0 z-10"
              style={{ color: 'var(--secondary-color)' }}
            >
              <tr>
                <th className="border px-4 py-2 text-center">المعسكر</th>
                <th className="border px-4 py-2 text-center">الميزانية</th>
                <th className="border px-4 py-2 text-center">التاريخ</th>
                <th className="border px-4 py-2 text-center">الموقع</th>
                <th className="border px-4 py-2 text-center">القائد</th>
                <th className="border px-4 py-2 text-center">المدة (يوم)</th>
                <th className="border px-4 py-2 text-center">الموسم</th>
                <th className="border px-4 py-2 text-center">تعديل</th>
                <th className="border px-4 py-2 text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
              {processedEvents.map((event) => (
                <tr key={event.Event_ID} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">
                    <a
                      href={`/events/${event.Event_ID}`}
                      className="text-blue-500 hover:underline"
                    >
                      {event.Ename}
                    </a>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {event.Budget || 'لا توجد'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {new Date(event?.Edate).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) || 'لا توجد'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {event.LocationName || 'لا توجد'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {event.LeaderName || 'لا يوجد'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {event?.Duration?.days || 'لا توجد'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {event.Season || 'لا توجد'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(event.Event_ID)}
                      className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                      style={{ background: 'var(--secondary-color)' }}
                    >
                      تعديل
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(event.Event_ID)}
                      className="bg-red-500 text-white hover:text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto hide-scrollbar">
            <h3
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: 'var(--secondary-color)' }}
            >
              {isEditMode ? 'تعديل' : 'إضافة'} معسكر
            </h3>
            <form onSubmit={handleSubmitEvent} className="space-y-4">
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="Ename"
                >
                  اسم المعسكر
                </label>
                <input
                  type="text"
                  name="Ename"
                  value={event?.Ename}
                  onChange={onChange}
                  id="Ename"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="Budget"
                >
                  الميزانية
                </label>
                <input
                  type="number"
                  name="Budget"
                  value={event?.Budget}
                  onChange={onChange}
                  id="Budget"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="Edate"
                >
                  التاريخ
                </label>
                <input
                  type="date"
                  name="Edate"
                  value={event?.Edate?.split('T')[0]}
                  onChange={onChange}
                  id="Edate"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="Duration"
                >
                  المدة
                </label>
                <input
                  type="number"
                  name="Duration"
                  value={event?.Duration?.days}
                  onChange={onChange}
                  id="Duration"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="Season"
                >
                  الموسم
                </label>
                <input
                  type="text"
                  name="Season"
                  value={event?.Season}
                  onChange={onChange}
                  id="Season"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="Location"
                ></label>
                <select
                  name="Location_ID"
                  onChange={onChange}
                  value={event?.Location_ID}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                >
                  <option value="" disabled>
                    اختر الموقع
                  </option>
                  {locations.map((location) => (
                    <option
                      key={location.Location_ID}
                      value={location.Location_ID}
                    >
                      {location.LocationName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="Leader"
                ></label>
                <select
                  name="ScoutLeader_ID"
                  onChange={onChange}
                  value={event?.ScoutLeader_ID}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                >
                  <option value="" disabled>
                    اختر القائد
                  </option>
                  {scoutLeaders.map((scoutLeader) => (
                    <option
                      key={scoutLeader.User_ID}
                      value={scoutLeader.User_ID}
                    >
                      {scoutLeader.Fname + ' ' + scoutLeader.Lname}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="imageUpload"
                >
                  رفع الصور
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="imageUpload"
                  name="images"
                  multiple
                  onChange={handleImageChange}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  {isEditMode ? 'تعديل' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm mx-4 text-center">
            <h3
              className="text-xl mb-4 font-bold"
              style={{ color: 'var(--secondary-color)' }}
            >
              تأكيد الحذف
            </h3>
            <p>هل أنت متأكد أنك تريد حذف هذا المعسكر ؟</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white hover:text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampsAdmin;
