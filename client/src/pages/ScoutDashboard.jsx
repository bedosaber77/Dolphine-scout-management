import "../styles/souctDashboard.css";
import { Container, Row, Col, Table } from "react-bootstrap";
import createTable from "../components/createTable";
import { useAuth } from "../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";

const ScoutDashboard = () => {
  const name = "أحمد";
  const groupName = "المجموعة الأولى";
  const groupLeader = "محمد";
  const auth = useAuth();
  const navigate = useNavigate();

  const arr = ["Achievement 1", "Achievement 2", "Achievement 3"];

  const Achievements = () => {
    return (
      <ul className="achievements-list">
        {arr.map((el) => (
          <li key={el}>{el}</li>
        ))}
      </ul>
    );
  };
  const arr2 = ["Event 1", "Event 2", "Event 3"];

  const Events = () => {
    return (
      <ul className="events-list">
        {arr2.map((el) => (
          <li key={el}>{el}</li>
        ))}
      </ul>
    );
  };

  const events = {
    3: "Event 1",
    10: "Event 2",
    15: "Event 3",
    20: "Event 4",
  };



  return (
    <>
      <Container fluid style={{ backgroundColor: "var(--bs-dark)", paddingLeft: "90px", paddingRight: "90px", }}>
        <button onClick={() => auth.logOut(path => navigate(path))} className="btn-submit">
          logout
        </button>
        {auth.user ? <h1>Welcome, {auth.user.name}</h1> : <h1>Loading...</h1>}
        <Row>
          <Col>
            <h1>الصفحة الشخصية</h1>
          </Col>
        </Row>
        <Row>
          <Col id="calendar">
            <h2>التقويم</h2>

            <Table className="custom-table table-bordered">
              <thead>
                <tr>
                  <th>الأحد</th>
                  <th>الإثنين</th>
                  <th>الثلاثاء</th>
                  <th>الأربعاء</th>
                  <th>الخميس</th>
                  <th>الجمعة</th>
                  <th>السبت</th>
                </tr>
              </thead>
              <tbody>{createTable(events)}</tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row>
              <Col id="info">
                <h2>معلوماتى</h2>
                <h4> الاسم: {name}</h4>
                <h4> اسم المجموعة: {groupName}</h4>
                <h4> قائد المجموعة: {groupLeader}</h4>
              </Col>
            </Row>
            <Row>
              <Col id="achievements">
                <h2>انجازاتى</h2>
                <Achievements />
              </Col>
            </Row>
          </Col>
          <Col id="Camps-Gatherings">
            <h2>الاجتماعات و المعسكرات</h2>
            <Events />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ScoutDashboard;
