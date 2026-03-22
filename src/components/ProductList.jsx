import { useEffect, useState } from 'react'
import axios from 'axios'
import { Alert, Badge, Button, Card, Col, Placeholder, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getApiErrorMessage } from '../utils/apiError'

const formatPrice = (value) => {
	const numericPrice = Number(value)

	if (!Number.isFinite(numericPrice)) {
		return 'N/A'
	}

	return `$${numericPrice.toFixed(2)}`
}

function ProductList() {
	const [products, setProducts] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')
	const [reloadKey, setReloadKey] = useState(0)

	useEffect(() => {
		const controller = new AbortController()

		const fetchProducts = async () => {
			try {
				setIsLoading(true)
				setError('')

				const response = await axios.get('https://fakestoreapi.com/products', {
					signal: controller.signal,
					timeout: 10000,
				})

				setProducts(response.data)
			} catch (requestError) {
				if (requestError.code !== 'ERR_CANCELED') {
					setError(getApiErrorMessage(requestError, 'Unable to load products right now. Please try again in a moment.'))
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsLoading(false)
				}
			}
		}

		fetchProducts()

		return () => {
			controller.abort()
		}
	}, [reloadKey])

	const renderLoadingCards = () => (
		<Row className="g-4">
			{Array.from({ length: 6 }).map((_, index) => (
				<Col key={index} md={6} xl={4}>
					<Card className="h-100 border-0 shadow-sm product-card">
						<div className="product-image-wrap product-image-skeleton">
							<Placeholder as="div" animation="glow" className="w-100 h-100" />
						</div>
						<Card.Body className="p-4 d-grid gap-3">
							<Placeholder as="div" animation="glow">
								<Placeholder xs={4} className="rounded" />
							</Placeholder>
							<Placeholder as="div" animation="glow">
								<Placeholder xs={10} />
								<Placeholder xs={8} />
							</Placeholder>
							<Placeholder as="div" animation="glow">
								<Placeholder xs={12} />
								<Placeholder xs={9} />
							</Placeholder>
							<Placeholder as="div" animation="glow" className="d-flex justify-content-between align-items-center">
								<Placeholder xs={3} />
								<Placeholder.Button variant="dark" xs={4} />
							</Placeholder>
						</Card.Body>
					</Card>
				</Col>
			))}
		</Row>
	)

	return (
		<section className="product-listing" aria-busy={isLoading}>
			<div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
				<div>
					<Badge bg="dark" className="mb-2 px-3 py-2">Product Listing</Badge>
					<h1 className="h2 fw-bold text-dark mb-2">Featured products</h1>
					<p className="text-secondary mb-0">
						Live product data from Fake Store API, arranged in a clear browsing layout with image, category, rating, and price details.
					</p>
				</div>
				<div className="d-flex flex-wrap gap-2">
					<Button as={Link} to="/add-product" variant="dark">
						Add Product
					</Button>
					<Button as={Link} to="/" variant="outline-dark">
						Back to Home
					</Button>
				</div>
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
				{isLoading ? 'Loading products...' : `Loaded ${products.length} products.`}
			</div>

			{isLoading ? renderLoadingCards() : null}

			{!isLoading && !error ? (
				<Row className="g-4">
					{products.map((product) => {
						const ratingRate = Number(product?.rating?.rate)
						const ratingCount = Number(product?.rating?.count)
						const ratingText = Number.isFinite(ratingRate) ? `${ratingRate} / 5` : 'No rating'
						const reviewsText = Number.isFinite(ratingCount) ? `${ratingCount} reviews` : 'No reviews yet'
						const productId = product?.id ?? 'unknown'

						return (
						<Col key={productId} md={6} xl={4}>
							<Card className="h-100 border-0 shadow-sm product-card overflow-hidden">
								<div className="product-image-wrap">
									<img
										src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
										alt={product.title || 'Product image'}
										className="product-image"
									/>
								</div>
								<Card.Body className="p-4 d-flex flex-column">
									<div className="d-flex justify-content-between align-items-start gap-3 mb-3">
										<Badge bg="warning" text="dark" className="text-capitalize product-category">
											{product.category}
										</Badge>
										<span className="product-rating">{ratingText}</span>
									</div>
									<Card.Title className="h5 text-dark product-title mb-3">
										{product.title || 'Untitled product'}
									</Card.Title>
									<div className="fw-bold fs-5 text-dark mb-3">{formatPrice(product.price)}</div>
									<div className="d-flex justify-content-between align-items-center mt-auto gap-3">
										<div className="small text-secondary">{reviewsText}</div>
										<Button as={Link} to={`/products/${productId}`} variant="dark" size="sm">
											View Details
										</Button>
									</div>
								</Card.Body>
							</Card>
						</Col>
						)
					})}
				</Row>
			) : null}
		</section>
	)
}

export default ProductList
