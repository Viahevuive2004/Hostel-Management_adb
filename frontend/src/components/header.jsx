import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Route, useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import SearchBox from "./searchBox";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
    history.push("/login");
  };
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Giải Pháp NSD</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {userInfo && (
              <Route render={({ history }) => <SearchBox history={history} />} />
            )}
            <Nav className="ml-auto">
              {userInfo && (
                <NavDropdown title="Thêm">
                  <LinkContainer to="/attendance">
                    <NavDropdown.Item>Điểm Danh</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/addStudent">
                    <NavDropdown.Item>Thêm Sinh Viên</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/analysis">
                    <NavDropdown.Item>Xem Phân Tích</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/ai-chat">
                    <NavDropdown.Item>🤖 Trợ lý AI</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Hồ Sơ</NavDropdown.Item>
                  </LinkContainer>
                  {userInfo.isAdmin && (
                    <LinkContainer to="/userList">
                      <NavDropdown.Item>Danh Sách Người Dùng</NavDropdown.Item>
                    </LinkContainer>
                  )}
                  <NavDropdown.Item onClick={logoutHandler}>
                    Đăng Xuất
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Đăng Nhập
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
