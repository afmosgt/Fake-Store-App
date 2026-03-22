import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function NavBar() {
	return (
		<Navbar expand="lg" className="app-navbar mb-4 mb-lg-5" sticky="top">
			<Container>
				<Navbar.Brand as={NavLink} to="/" className="navbar-brand fw-bold">
					<img src={`${import.meta.env.BASE_URL}favicon-chrome-badge.svg`} alt="" className="brand-icon" aria-hidden="true" />
					<span className="brand-text">The Fakest Store</span>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="main-navigation" aria-label="Toggle navigation menu" />
				<Navbar.Collapse id="main-navigation">
					<Nav className="ms-auto gap-lg-2">
						<Nav.Link as={NavLink} to="/" end className="nav-pill">
							Home
						</Nav.Link>
						<Nav.Link as={NavLink} to="/products" className="nav-pill">
							Product Listing
						</Nav.Link>
						<Nav.Link as={NavLink} to="/add-product" className="nav-pill">
							Add Product
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default NavBar
