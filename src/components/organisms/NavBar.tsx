import { Title } from "@solidjs/meta";
import { Container, Nav, Navbar } from "solid-bootstrap";

// the component itself can't have the same name as the bootstrap <Navbar> component
export default function NavBar(){
  return(
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand></Navbar.Brand>
        <Navbar.Toggle />
        <Nav class="me-auto">
          <Title>SolidStart - Basic</Title>
          <Nav.Link href="/">Index</Nav.Link>
          <Nav.Link href="/overview">Overview</Nav.Link>
        </Nav>
        <Navbar.Collapse class="justify-content-end">
          <Navbar.Text>Signed in as: <a href="#">me</a></Navbar.Text>
          {/*<Navbar.Text>Signed in as: <a href="#login">me</a></Navbar.Text>*/}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}