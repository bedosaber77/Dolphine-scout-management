import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../hooks/AuthProvider';

const AppHeader = () => {
  const auth = useAuth();
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>
          <Nav.Link as={NavLink} to="/">
            <img
              src="./src/assets/logo-dolphins-png.png"
              width="100"
              height="100"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={NavLink} to="/events">
              الاحداث
            </Nav.Link>
            <Nav.Link as={NavLink} to="/#news">
              الاخبار
            </Nav.Link>
            <Nav.Link as={NavLink} to="/aboutUs">
              من نحن
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        {!auth.isAuthenticated && (
          <Nav className="d-flex align-items-center gap-2">
            <Button variant="primary" as={NavLink} to="/login">
              تسجيل الدخول
            </Button>
            <Button variant="outline-secondary" as={NavLink} to="/register">
              انضم الينا
            </Button>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default AppHeader;
