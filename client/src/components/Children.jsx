import { useNavigate } from 'react-router-dom';
import '../styles/parentDashboard.css';

const Children = ({ childrenData }) => {
  const navigate = useNavigate();

  const handleChildClick = (childId) => {
    navigate(`/dashboard/parent/child/${childId}`);
  };

  return (
    <div className="children-container flex flex-col  gap-4">
      {childrenData.map((child) => (
        <div
          key={child.User_ID}
          className="child-card h-36 p-4 bg-gray-100 shadow-md rounded-lg cursor-pointer "
          onClick={() => handleChildClick(child.User_ID)}
        >
          <h2 className="text-lg font-bold text-gray-800">
            {child.Fname} {child.Lname}
          </h2>
          <p className="text-gray-600">Rank: {child.rank}</p>
          <p className="text-gray-600">Academic Year: {child.academicYear}</p>
          <p className="text-gray-600">
            Join Date: {new Date(child.joinDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Children;
