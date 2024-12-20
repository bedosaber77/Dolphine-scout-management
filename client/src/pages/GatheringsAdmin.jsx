import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const GatheringsAdmin = () => {
  const apiRequest = useApi();

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
        const date = new Date(event.Edate).toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        return {
          ...event,
          Edate: date,
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
        url: 'http://localhost:3000/api/gatherings/',
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
        const [eventsResponse, locationsResponse, scoutLeadersResponse] =
          await Promise.all([
            fetchEventsData(),
            fetchLocations(),
            fetchScoutLeaders(),
          ]);
        setEventsData(eventsResponse.data);
        setLocations(locationsResponse.data);
        setScoutLeaders(scoutLeadersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [apiRequest]);

  // Add or update an event
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    if (isEditMode && selectedEventID) {
      try {
        await apiRequest({
          url: `http://localhost:3000/api/events/${selectedEventID}`,
          method: 'PUT',
          data: { ...event, images },
        });
        await apiRequest({
          url: `http://localhost:3000/api/gatherings/${selectedEventID}`,
          method: 'PUT',
          data: event,
        });
        setProcessedEvents((prevData) =>
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
          data: { ...event, images },
        });
        const response2 = await apiRequest({
          url: 'http://localhost:3000/api/gatherings/',
          method: 'POST',
          data: { ...event, Event_ID: response.data.Event.Event_ID },
        });
        setEventsData([...EventsData, response.data, response2.data]);
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
      setProcessedEvents(
        processedEvents.filter((event) => event.Event_ID !== selectedEventID)
      );
      setIsDeleteDialogOpen(false);
      selectedEventID(null);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(event);
  console.log('locs', locations);
  console.log('scoutLeaders', scoutLeaders);
  const onChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  console.log('process', processedEvents);
  // Handle edit
  const handleEdit = (Event_ID) => {
    setSelectedEventID(Event_ID);
    const selectedEvent = processedEvents.find(
      (event) => event.Event_ID === Event_ID
    );
    console.log('sel', selectedEvent);
    setEvent(selectedEvent);
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2
        className="mb-4 text-2xl font-bold"
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

      {/* Events Table */}
      <table className="min-w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">الاجتماع</th>
            <th className="border px-4 py-2">الميزانية</th>
            <th className="border px-4 py-2">التاريخ</th>
            <th className="border px-4 py-2">الموقع</th>
            <th className="border px-4 py-2">القائد</th>
            <th className="border px-4 py-2">المهارات</th>
            <th className="border px-4 py-2">التربوي</th>
            <th className="border px-4 py-2">الفني</th>
            <th className="border px-4 py-2">البدني</th>
            <th className="border px-4 py-2">العلمي</th>
            <th className="border px-4 py-2">النتائج الإضافية</th>
            <th className="border px-4 py-2">تعديل</th>
            <th className="border px-4 py-2">حذف</th>
          </tr>
        </thead>
        <tbody>
          {processedEvents.map((event) => (
            <tr key={event.Event_ID} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{event.Ename}</td>
              <td className="border px-4 py-2">{event.Budget || 'لا توجد'}</td>
              <td className="border px-4 py-2">{event.Edate || 'لا توجد'}</td>
              <td className="border px-4 py-2">
                {event.LocationName || 'لا توجد'}
              </td>
              <td className="border px-4 py-2">
                {event.LeaderName || 'لا يوجد'}
              </td>
              <td className="border px-4 py-2">
                {event.GeneralOutcome || 'لا توجد'}
              </td>
              <td className="border px-4 py-2">
                {event.EducationalOutcome || 'لا توجد'}
              </td>
              <td className="border px-4 py-2">
                {event.ArtOutcome || 'لا توجد'}
              </td>
              <td className="border px-4 py-2">
                {event.PhysicalOutcome || 'لا توجد'}
              </td>
              <td className="border px-4 py-2">
                {event.ScientificOutcome || 'لا توجد'}
              </td>
              <td className="border px-4 py-2">
                {event.ExtraOutcome || 'لا توجد'}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(event.Event_ID)}
                  className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  تعديل
                </button>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(event.Event_ID)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:text-white"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-1/3">
            <h3 className="text-xl mb-4 font-bold">
              {isEditMode ? 'تعديل' : 'إضافة'} اجتماع
            </h3>
            <form onSubmit={handleSubmitEvent}>
              <div className="mb-4">
                <label
                  htmlFor="Ename"
                  className="block text-sm font-medium text-gray-700"
                >
                  اسم الاجتماع
                </label>
                <input
                  type="text"
                  name="Ename"
                  value={event?.Ename}
                  onChange={onChange}
                  id="Ename"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="Budget"
                  className="block text-sm font-medium text-gray-700"
                >
                  الميزانية
                </label>
                <input
                  type="number"
                  name="Budget"
                  value={event?.Budget}
                  onChange={onChange}
                  id="Budget"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="Edate"
                  className="block text-sm font-medium text-gray-700"
                >
                  التاريخ
                </label>
                <input
                  type="date"
                  name="Edate"
                  value={event?.Edate}
                  onChange={onChange}
                  id="Edate"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label
                    htmlFor="GeneralOutcome"
                    className="block text-sm font-medium text-gray-700"
                  >
                    المهارات
                  </label>
                  <input
                    type="text"
                    name="GeneralOutcome"
                    value={event?.GeneralOutcome}
                    onChange={onChange}
                    id="GeneralOutcome"
                    className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="EducationalOutcome"
                    className="block text-sm font-medium text-gray-700"
                  >
                    التربوي
                  </label>
                  <input
                    type="text"
                    name="EducationalOutcome"
                    value={event?.EducationalOutcome}
                    onChange={onChange}
                    id="EducationalOutcome"
                    className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="ArtOutcome"
                    className="block text-sm font-medium text-gray-700"
                  >
                    الفني
                  </label>
                  <input
                    type="text"
                    name="ArtOutcome"
                    value={event?.ArtOutcome}
                    onChange={onChange}
                    id="ArtOutcome"
                    className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="PhysicalOutcome"
                    className="block text-sm font-medium text-gray-700"
                  >
                    البدني
                  </label>
                  <input
                    type="text"
                    name="PhysicalOutcome"
                    value={event?.PhysicalOutcome}
                    onChange={onChange}
                    id="PhysicalOutcome"
                    className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="ScientificOutcome"
                    className="block text-sm font-medium text-gray-700"
                  >
                    العلمي
                  </label>
                  <input
                    type="text"
                    name="ScientificOutcome"
                    value={event?.ScientificOutcome}
                    onChange={onChange}
                    id="ScientificOutcome"
                    className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="ExtraOutcome"
                    className="block text-sm font-medium text-gray-700"
                  >
                    النتائج الإضافية
                  </label>
                  <input
                    type="text"
                    name="ExtraOutcome"
                    value={event?.ExtraOutcome}
                    onChange={onChange}
                    id="ExtraOutcome"
                    className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="Location"
                  className="block text-sm font-medium text-gray-700"
                ></label>
                <select
                  name="Location_ID"
                  onChange={onChange}
                  value={event?.Location_ID}
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl"
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
              <div className="mb-4">
                <label
                  htmlFor="Leader"
                  className="block text-sm font-medium text-gray-700"
                ></label>
                <select
                  name="ScoutLeader_ID"
                  onChange={onChange}
                  value={event?.ScoutLeader_ID}
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl"
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
              <div className="mb-4">
                <label
                  htmlFor="imageUpload"
                  className="block text-sm font-medium text-gray-700"
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
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-1/3">
            <h3 className="text-xl mb-4 font-bold">تأكيد الحذف</h3>
            <p>هل أنت متأكد أنك تريد حذف هذا الحدث؟</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:text-white"
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
