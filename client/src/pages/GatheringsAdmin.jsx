import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const GatheringsAdmin = () => {
  const apiRequest = useApi();
  const { accessToken } = useAuthStore();
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
    GeneralOutcome: '',
    EducationalOutcome: '',
    PhysicalOutcome: '',
    ScientificOutcome: '',
    ArtOutcome: '',
    ExtraOutcome: '',
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
        url: `${import.meta.env.VITE_BASEURL}/api/gatherings/`,
        method: 'GET',
      });
    };
    const fetchLocations = async () => {
      return apiRequest({
        url: `${import.meta.env.VITE_BASEURL}/api/Locations/`,
        method: 'GET',
      });
    };

    const fetchScoutLeaders = async () => {
      return apiRequest({
        url: `${import.meta.env.VITE_BASEURL}/api/Scoutleaders/`,
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
    formData.append('GeneralOutcome', event.GeneralOutcome);
    formData.append('EducationalOutcome', event.EducationalOutcome);
    formData.append('PhysicalOutcome', event.PhysicalOutcome);
    formData.append('ScientificOutcome', event.ScientificOutcome);
    formData.append('ArtOutcome', event.ArtOutcome);
    formData.append('ExtraOutcome', event.ExtraOutcome);

    // Append images to FormData (assumes "images" is an array of File objects)
    images.forEach((image) => {
      formData.append('images', image); // Each image is appended under 'images'
    });
    // Debug: Log FormData content (this won't show up like an object in console)
    if (isEditMode && selectedEventID) {
      try {
        await axios.put(
          `${import.meta.env.VITE_BASEURL}/api/events/${selectedEventID}`,
          formData,
          {
            headers: {
              accessToken: accessToken,
            },
          }
        );
        await apiRequest({
          url: `${
            import.meta.env.VITE_BASEURL
          }/api/gatherings/${selectedEventID}`,
          method: 'PUT',
          data: event,
        });
        const updatedEvent = { ...event, Event_ID: selectedEventID };
        setEventsData(
          EventsData.map((evt) =>
            evt.Event_ID === selectedEventID ? updatedEvent : evt
          )
        );
      } catch (error) {
        console.error('Error updating event:', error);
      }
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASEURL}/api/events`,
          formData,
          {
            headers: {
              accessToken: accessToken,
            },
          }
        );
        const response2 = await apiRequest({
          url: `${import.meta.env.VITE_BASEURL}/api/gatherings/`,
          method: 'POST',
          data: { ...event, Event_ID: response.data.Event.Event_ID },
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
      GeneralOutcome: '',
      EducationalOutcome: '',
      PhysicalOutcome: '',
      ScientificOutcome: '',
      ArtOutcome: '',
      ExtraOutcome: '',
    });
    setImages([]);
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
        url: `${import.meta.env.VITE_BASEURL}/api/events/${selectedEventID}`,
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
          قائمة الاجتماعات
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
              GeneralOutcome: '',
              EducationalOutcome: '',
              PhysicalOutcome: '',
              ScientificOutcome: '',
              ArtOutcome: '',
              ExtraOutcome: '',
            });
            setIsModalOpen(true);
          }}
          className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
          style={{ background: 'var(--secondary-color)' }}
        >
          إضافة اجتماع
        </button>
      </div>

      {/* Events Table */}
      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : processedEvents.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">لا يوجد اجتماعات للعرض</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 mt-4">
            <thead
              className="sticky top-0 z-10"
              style={{ color: 'var(--secondary-color)' }}
            >
              <tr>
                <th className="border px-4 py-2 text-center">الاجتماع</th>
                <th className="border px-4 py-2 text-center">الميزانية</th>
                <th className="border px-4 py-2 text-center">التاريخ</th>
                <th className="border px-4 py-2 text-center">الموقع</th>
                <th className="border px-4 py-2 text-center">القائد</th>
                <th className="border px-4 py-2 text-center">المهارات</th>
                <th className="border px-4 py-2 text-center">التربوي</th>
                <th className="border px-4 py-2 text-center">الفني</th>
                <th className="border px-4 py-2 text-center">البدني</th>
                <th className="border px-4 py-2 text-center">العلمي</th>
                <th className="border px-4 py-2 text-center">
                  النتائج الإضافية
                </th>
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
                    {event.GeneralOutcome || 'لا توجد'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {event.EducationalOutcome || 'لا توجد'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {event.ArtOutcome || 'لا توجد'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {event.PhysicalOutcome || 'لا توجد'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {event.ScientificOutcome || 'لا توجد'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {event.ExtraOutcome || 'لا توجد'}
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
              {isEditMode ? 'تعديل' : 'إضافة'} اجتماع
            </h3>
            <form onSubmit={handleSubmitEvent} className="space-y-4">
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="Ename"
                >
                  اسم الاجتماع
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
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-xl font-medium mb-1"
                    htmlFor="GeneralOutcome"
                  >
                    المهارات
                  </label>
                  <input
                    type="text"
                    name="GeneralOutcome"
                    value={event?.GeneralOutcome}
                    onChange={onChange}
                    id="GeneralOutcome"
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    className="block text-xl font-medium mb-1"
                    htmlFor="EducationalOutcome"
                  >
                    التربوي
                  </label>
                  <input
                    type="text"
                    name="EducationalOutcome"
                    value={event?.EducationalOutcome}
                    onChange={onChange}
                    id="EducationalOutcome"
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    className="block text-xl font-medium mb-1"
                    htmlFor="ArtOutcome"
                  >
                    الفني
                  </label>
                  <input
                    type="text"
                    name="ArtOutcome"
                    value={event?.ArtOutcome}
                    onChange={onChange}
                    id="ArtOutcome"
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    className="block text-xl font-medium mb-1"
                    htmlFor="PhysicalOutcome"
                  >
                    البدني
                  </label>
                  <input
                    type="text"
                    name="PhysicalOutcome"
                    value={event?.PhysicalOutcome}
                    onChange={onChange}
                    id="PhysicalOutcome"
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    className="block text-xl font-medium mb-1"
                    htmlFor="ScientificOutcome"
                  >
                    العلمي
                  </label>
                  <input
                    type="text"
                    name="ScientificOutcome"
                    value={event?.ScientificOutcome}
                    onChange={onChange}
                    id="ScientificOutcome"
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    className="block text-xl font-medium mb-1"
                    htmlFor="ExtraOutcome"
                  >
                    النتائج الإضافية
                  </label>
                  <input
                    type="text"
                    name="ExtraOutcome"
                    value={event?.ExtraOutcome}
                    onChange={onChange}
                    id="ExtraOutcome"
                    className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  />
                </div>
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
                  onClick={() => {
                    // empty the form state
                    setIsModalOpen(false);
                    setImages([]);
                    setEvent({
                      Budget: '',
                      Ename: '',
                      Edate: '',
                      Location_ID: '',
                      ScoutLeader_ID: '',
                      GeneralOutcome: '',
                      EducationalOutcome: '',
                      PhysicalOutcome: '',
                      ScientificOutcome: '',
                      ArtOutcome: '',
                      ExtraOutcome: '',
                    });
                  }}
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
            <p>هل أنت متأكد أنك تريد حذف هذا الاجتماع ؟</p>
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
export default GatheringsAdmin;
