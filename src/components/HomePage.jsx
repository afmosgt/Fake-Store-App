import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function HomePage() {
	return (
		<Container fluid className="px-0">
			<Card className="home-hero border-0 shadow-lg overflow-hidden">
				<Card.Body className="p-4 p-lg-5">
					<Row className="align-items-center g-4 g-lg-5">
						<Col lg={7}>
							<Badge bg="warning" text="dark" className="mb-3 px-3 py-2 hero-badge">
								Welcome to the Fakest Store
							</Badge>
							<h1 className="display-4 fw-bold text-dark mb-3">
								Shop everyday essentials with a faster, simpler storefront.
							</h1>
							<p className="lead text-secondary mb-4">
								Browse featured categories, discover popular items, and explore a clean shopping experience built for quick decisions.
							</p>
							<div className="d-flex flex-wrap gap-3">
								<Button
									as={Link}
									to="/products"
									variant="dark"
									size="lg"
									className="px-4"
								>
									View Product Listing
								</Button>
								<Button variant="outline-dark" size="lg" className="px-4" disabled>
									New arrivals soon
								</Button>
							</div>
						</Col>
						<Col lg={5}>
							<div className="hero-panel p-4 p-lg-5">
								<p className="text-uppercase small fw-semibold mb-3 text-muted">
									Why shop here
								</p>
								<div className="feature-stack">
									<div>
										<h2 className="h5 fw-semibold text-dark mb-1">Curated categories</h2>
										<p className="text-secondary mb-0">
											From fashion to electronics, start with the products shoppers look for most.
										</p>
									</div>
									<div>
										<h2 className="h5 fw-semibold text-dark mb-1">Clear product discovery</h2>
										<p className="text-secondary mb-0">
											A focused layout helps visitors move from landing page to listing page without friction.
										</p>
									</div>
									<div>
										<h2 className="h5 fw-semibold text-dark mb-1">Built with React Bootstrap</h2>
										<p className="text-secondary mb-0">
											Responsive components keep the interface consistent on desktop and mobile.
										</p>
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</Container>
	)
}

export default HomePage
