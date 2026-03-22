import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Alert, Badge, Button, Card, Col, Placeholder, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { getApiErrorMessage } from '../utils/apiError'

const formatPrice = (value) => {
	const numericPrice = Number(value)

	if (!Number.isFinite(numericPrice)) {
		return 'N/A'
	}

	return `$${numericPrice.toFixed(2)}`
}

function ProductDetails() {
	const { productId } = useParams()
	const [product, setProduct] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')
	const [actionMessage, setActionMessage] = useState('')
	const [actionError, setActionError] = useState('')
	const [isAddingToCart, setIsAddingToCart] = useState(false)
	const [reloadKey, setReloadKey] = useState(0)
	const isMountedRef = useRef(true)
	const addToCartTimeoutRef = useRef(null)

	useEffect(() => {
		return () => {
			isMountedRef.current = false
			if (addToCartTimeoutRef.current) {
				clearTimeout(addToCartTimeoutRef.current)
			}
		}
	}, [])

	useEffect(() => {
		const controller = new AbortController()

		const fetchProduct = async () => {
			try {
				setIsLoading(true)
				setError('')
				setActionMessage('')
				setActionError('')

				const response = await axios.get(`https://fakestoreapi.com/products/${productId}`, {
					signal: controller.signal,
					timeout: 10000,
				})

				setProduct(response.data)
			} catch (requestError) {
				if (requestError.code !== 'ERR_CANCELED') {
					setError(getApiErrorMessage(requestError, 'Unable to load product details right now. Please try again in a moment.'))
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsLoading(false)
				}
			}
		}

		fetchProduct()

		return () => {
			controller.abort()
		}
	}, [productId, reloadKey])

	const handleAddToCart = async () => {
		setIsAddingToCart(true)
		setActionError('')

		try {
			// Simulated add-to-cart flow. Replace this with real cart state/store logic when available.
			await new Promise((resolve) => {
				addToCartTimeoutRef.current = setTimeout(resolve, 450)
			})

			if (isMountedRef.current) {
				setActionMessage('Product added to cart.')
			}
		} catch {
			if (isMountedRef.current) {
				setActionError('Unable to add this item to cart right now. Please try again.')
			}
		} finally {
			if (isMountedRef.current) {
				setIsAddingToCart(false)
			}
		}
	}

	const ratingRate = Number(product?.rating?.rate)
	const ratingCount = Number(product?.rating?.count)
	const ratingText = Number.isFinite(ratingRate) ? `${ratingRate} / 5 rating` : 'No rating available'
	const reviewsText = Number.isFinite(ratingCount) ? `${ratingCount} customer reviews` : 'No customer reviews yet'

	return (
		<section className="product-details-page" aria-busy={isLoading}>
			<div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
				<div>
					<Badge bg="dark" className="mb-2 px-3 py-2">Product Details</Badge>
					<h1 className="h2 fw-bold text-dark mb-2">Product overview</h1>
					<p className="text-secondary mb-0">
						View a larger image, full description, category, rating, and price for this item.
					</p>
				</div>
				<Button as={Link} to="/products" variant="outline-dark">
					Back to Products
				</Button>
			</div>

			{error ? (
				<Alert variant="danger" className="d-flex flex-wrap align-items-center justify-content-between gap-3">
					<span>{error}</span>
					<Button variant="outline-danger" size="sm" onClick={() => setReloadKey((previous) => previous + 1)}>
						Retry
					</Button>
				</Alert>
			) : null}
			{actionError ? <Alert variant="danger">{actionError}</Alert> : null}
			{actionMessage ? <Alert variant="success">{actionMessage}</Alert> : null}
			<div className="visually-hidden" aria-live="polite">
				{isLoading ? 'Loading product details...' : product ? `Loaded details for ${product.title}.` : ''}
			</div>

			{isLoading ? (
				<Card className="border-0 shadow-sm product-details-card">
					<Card.Body className="p-4 p-lg-5">
						<Row className="g-4 align-items-center">
							<Col lg={5}>
								<div className="product-detail-image-wrap product-image-skeleton">
									<Placeholder as="div" animation="glow" className="w-100 h-100" />
								</div>
							</Col>
							<Col lg={7}>
								<div className="d-grid gap-3">
									<Placeholder as="div" animation="glow"><Placeholder xs={3} /></Placeholder>
									<Placeholder as="div" animation="glow"><Placeholder xs={10} /><Placeholder xs={8} /></Placeholder>
									<Placeholder as="div" animation="glow"><Placeholder xs={12} /><Placeholder xs={11} /><Placeholder xs={9} /></Placeholder>
								</div>
							</Col>
						</Row>
					</Card.Body>
				</Card>
			) : null}

			{!isLoading && !error && product ? (
				<Card className="border-0 shadow-sm product-details-card overflow-hidden">
					<Card.Body className="p-4 p-lg-5">
						<Row className="g-4 g-lg-5 align-items-center">
							<Col lg={5}>
								<div className="product-detail-image-wrap">
									<img src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'} alt={product.title || 'Product image'} className="product-image" />
								</div>
							</Col>
							<Col lg={7}>
								<div className="d-flex flex-wrap align-items-center gap-3 mb-3">
									<Badge bg="warning" text="dark" className="text-capitalize product-category">
										{product.category}
									</Badge>
									<span className="product-rating">{ratingText}</span>
								</div>
								<h2 className="display-6 fw-bold text-dark mb-3">{product.title}</h2>
								<p className="text-secondary product-detail-description mb-4">{product.description}</p>
								<div className="product-detail-meta mb-4">
									<div>
										<div className="small text-secondary">Price</div>
										<div className="fw-bold fs-2 text-dark">{formatPrice(product.price)}</div>
									</div>
									<div>
										<div className="small text-secondary">Reviews</div>
										<div className="fw-semibold text-dark">{reviewsText}</div>
									</div>
								</div>
								<div className="d-flex flex-wrap gap-3">
									<Button variant="dark" onClick={handleAddToCart} disabled={isAddingToCart}>
										{isAddingToCart ? 'Adding...' : 'Add to Cart'}
									</Button>
									<Button as={Link} to={`/products/${productId}/edit`} variant="warning">
										Edit Product
									</Button>
									<Button as={Link} to={`/products/${productId}/delete`} variant="danger">
										Delete Product
									</Button>
									<Button as={Link} to="/products" variant="outline-dark">
										Browse More Products
									</Button>
									<Button as={Link} to="/" variant="outline-dark">
										Back Home
									</Button>
								</div>
							</Col>
						</Row>
					</Card.Body>
				</Card>
			) : null}
		</section>
	)
}

export default ProductDetails