import { useEffect, useState } from 'react'
import axios from 'axios'
import {
	Alert,
	Badge,
	Button,
	Card,
	Col,
	Placeholder,
	Row,
	Spinner,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getApiErrorMessage } from '../utils/apiError'

const formatPrice = (value) => {
	const numericPrice = Number(value)

	if (!Number.isFinite(numericPrice)) {
		return 'N/A'
	}

	return `$${numericPrice.toFixed(2)}`
}

function AdditionalFeatures() {
	const [featuredProducts, setFeaturedProducts] = useState([])
	const [categories, setCategories] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')
	const [reloadKey, setReloadKey] = useState(0)

	useEffect(() => {
		const controller = new AbortController()

		const fetchFeatureData = async () => {
			try {
				setIsLoading(true)
				setError('')

				const [productsResponse, categoriesResponse] = await Promise.all([
					axios.get('https://fakestoreapi.com/products?limit=6', { signal: controller.signal, timeout: 10000 }),
					axios.get('https://fakestoreapi.com/products/categories', { signal: controller.signal, timeout: 10000 }),
				])

				setFeaturedProducts(productsResponse.data)
				setCategories(categoriesResponse.data)
			} catch (requestError) {
				if (requestError.code !== 'ERR_CANCELED') {
					setError(getApiErrorMessage(requestError, 'We are unable to load additional store features right now. Please refresh or try again shortly.'))
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsLoading(false)
				}
			}
		}

		fetchFeatureData()

		return () => {
			controller.abort()
		}
	}, [reloadKey])

	return (
		<section className="additional-features-page py-2 py-md-3" aria-busy={isLoading}>
			<div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
				<div>
					<Badge bg="dark" className="mb-2 px-3 py-2">Additional Features</Badge>
					<h1 className="h2 fw-bold text-dark mb-2">Extra storefront highlights</h1>
					<p className="text-secondary mb-0">
						A responsive view that demonstrates categories, quick stats, and featured picks.
					</p>
				</div>
				<Button as={Link} to="/products" variant="outline-dark">Back to Products</Button>
			</div>

			{error ? (
				<Alert variant="danger" className="d-flex flex-wrap align-items-center justify-content-between gap-3">
					<span>{error}</span>
					<Button variant="outline-danger" size="sm" onClick={() => setReloadKey((previous) => previous + 1)}>
						Retry
					</Button>
				</Alert>
			) : null}
			<div className="visually-hidden" aria-live="polite">
				{isLoading ? 'Loading additional feature data...' : 'Additional feature data loaded.'}
			</div>

			{isLoading ? (
				<>
					<div className="d-flex align-items-center gap-2 mb-3 text-secondary">
						<Spinner animation="border" size="sm" role="status" />
						<span>Loading feature data...</span>
					</div>
					<Row className="g-3 g-md-4 mb-4">
						{Array.from({ length: 3 }).map((_, index) => (
							<Col key={index} xs={12} md={6} xl={4}>
								<Card className="h-100 border-0 shadow-sm">
									<Card.Body className="p-4">
										<Placeholder as="div" animation="glow">
											<Placeholder xs={6} />
										</Placeholder>
										<Placeholder as="div" animation="glow">
											<Placeholder xs={12} />
											<Placeholder xs={9} />
										</Placeholder>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
				</>
			) : null}

			{!isLoading && !error ? (
				<>
					<Row className="g-3 g-md-4 mb-4">
						<Col xs={12} md={6} lg={4}>
							<Card className="h-100 border-0 shadow-sm">
								<Card.Body className="p-4">
									<p className="small text-secondary mb-1">Available categories</p>
									<h2 className="h3 fw-bold text-dark mb-0">{categories.length}</h2>
								</Card.Body>
							</Card>
						</Col>
						<Col xs={12} md={6} lg={4}>
							<Card className="h-100 border-0 shadow-sm">
								<Card.Body className="p-4">
									<p className="small text-secondary mb-1">Featured products shown</p>
									<h2 className="h3 fw-bold text-dark mb-0">{featuredProducts.length}</h2>
								</Card.Body>
							</Card>
						</Col>
						<Col xs={12} lg={4}>
							<Card className="h-100 border-0 shadow-sm">
								<Card.Body className="p-4">
									<p className="small text-secondary mb-2">Categories</p>
									<div className="d-flex flex-wrap gap-2">
										{categories.map((category) => (
											<Badge key={category} bg="warning" text="dark" className="text-capitalize">
												{category}
											</Badge>
										))}
									</div>
								</Card.Body>
							</Card>
						</Col>
					</Row>

					<Row className="g-3 g-md-4">
						{featuredProducts.map((product) => (
							<Col key={product.id} xs={12} sm={6} xl={4}>
								<Card className="h-100 border-0 shadow-sm overflow-hidden">
									<div className="product-image-wrap">
										<img src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'} alt={product.title || 'Product image'} className="product-image" />
									</div>
									<Card.Body className="p-4 d-flex flex-column">
										<Badge bg="warning" text="dark" className="text-capitalize align-self-start mb-2">
											{product.category}
										</Badge>
										<Card.Title className="h6 text-dark mb-2">{product.title || 'Untitled product'}</Card.Title>
										<p className="text-secondary small mb-3">{formatPrice(product.price)}</p>
										<Button as={Link} to={`/products/${product.id}`} variant="dark" size="sm" className="mt-auto align-self-start">
											View Details
										</Button>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
				</>
			) : null}
		</section>
	)
}

export default AdditionalFeatures
