import { useEffect, useState } from 'react'
import axios from 'axios'
import { Alert, Badge, Button, Card, Modal, Placeholder } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { getApiErrorMessage } from '../utils/apiError'

const formatPrice = (value) => {
	const numericPrice = Number(value)

	if (!Number.isFinite(numericPrice)) {
		return 'N/A'
	}

	return `$${numericPrice.toFixed(2)}`
}

function DeleteProduct() {
	const { productId } = useParams()
	const [product, setProduct] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isDeleting, setIsDeleting] = useState(false)
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [error, setError] = useState('')
	const [successMessage, setSuccessMessage] = useState('')
	const [reloadKey, setReloadKey] = useState(0)

	useEffect(() => {
		const controller = new AbortController()

		const fetchProduct = async () => {
			try {
				setIsLoading(true)
				setError('')

				const response = await axios.get(`https://fakestoreapi.com/products/${productId}`, {
					signal: controller.signal,
					timeout: 10000,
				})

				setProduct(response.data)
			} catch (requestError) {
				if (requestError.code !== 'ERR_CANCELED') {
					setError(getApiErrorMessage(requestError, 'Unable to load product details for deletion. Please try again.'))
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

	const handleDelete = async () => {
		if (isDeleting) {
			return
		}

		setIsDeleting(true)
		setError('')

		try {
			await axios.delete(`https://fakestoreapi.com/products/${productId}`, { timeout: 10000 })
			setSuccessMessage('Product deletion request succeeded in FakeStoreAPI test mode. The response is simulated and does not permanently remove data.')
			setShowConfirmModal(false)
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to delete this product right now. Please try again.'))
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<section className="delete-product-page">
			<div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
				<div>
					<Badge bg="dark" className="mb-2 px-3 py-2">Delete Product</Badge>
					<h1 className="h2 fw-bold text-dark mb-2">Confirm product deletion</h1>
					<p className="text-secondary mb-0">
						Review the item below, then confirm deletion in the modal dialog.
					</p>
				</div>
				<div className="d-flex flex-wrap gap-2">
					<Button as={Link} to={`/products/${productId}`} variant="outline-dark">
						Back to Details
					</Button>
					<Button as={Link} to="/products" variant="outline-secondary">
						Back to Products
					</Button>
				</div>
			</div>

			{error ? (
				<Alert variant="danger" className="d-flex flex-wrap align-items-center justify-content-between gap-3">
					<span>{error}</span>
					{isLoading ? null : (
						<Button variant="outline-danger" size="sm" onClick={() => setReloadKey((previous) => previous + 1)}>
							Retry
						</Button>
					)}
				</Alert>
			) : null}
			{successMessage ? <Alert variant="success">{successMessage}</Alert> : null}

			{isLoading ? (
				<Card className="border-0 shadow-sm delete-product-card">
					<Card.Body className="p-4 p-lg-5 d-grid gap-3">
						<Placeholder as="div" animation="glow"><Placeholder xs={4} /></Placeholder>
						<Placeholder as="div" animation="glow"><Placeholder xs={10} /><Placeholder xs={8} /></Placeholder>
						<Placeholder as="div" animation="glow"><Placeholder.Button xs={3} /></Placeholder>
					</Card.Body>
				</Card>
			) : null}

			{!isLoading && product ? (
				<Card className="border-0 shadow-sm delete-product-card overflow-hidden">
					<Card.Body className="p-4 p-lg-5">
						<div className="d-grid gap-3">
							<div className="d-flex flex-wrap align-items-center gap-3">
								<Badge bg="warning" text="dark" className="text-capitalize">{product.category}</Badge>
								<span className="text-secondary small">Product ID: {product.id}</span>
							</div>
							<h2 className="h4 fw-bold text-dark mb-0">{product.title}</h2>
							<p className="text-secondary mb-0">{formatPrice(product.price)}</p>
							<Button variant="danger" className="justify-self-start" onClick={() => setShowConfirmModal(true)} disabled={Boolean(successMessage)}>
								Delete Product
							</Button>
						</div>
					</Card.Body>
				</Card>
			) : null}

			<Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered animation={false} aria-labelledby="delete-product-modal-title">
				<Modal.Header closeButton>
					<Modal.Title id="delete-product-modal-title">Delete this product?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					This action will send a DELETE request to FakeStoreAPI for <strong>{product?.title}</strong>. Continue?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="outline-secondary" onClick={() => setShowConfirmModal(false)} disabled={isDeleting}>
						Cancel
					</Button>
					<Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
						{isDeleting ? 'Deleting...' : 'Yes, Delete'}
					</Button>
				</Modal.Footer>
			</Modal>
		</section>
	)
}

export default DeleteProduct
