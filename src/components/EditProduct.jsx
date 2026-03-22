import { useEffect, useState } from 'react'
import axios from 'axios'
import { Alert, Badge, Button, Card, Form, Placeholder } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { getApiErrorMessage } from '../utils/apiError'

const initialForm = {
	title: '',
	price: '',
	description: '',
	category: '',
}

function EditProduct() {
	const { productId } = useParams()
	const [formData, setFormData] = useState(initialForm)
	const [fieldErrors, setFieldErrors] = useState({})
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [successMessage, setSuccessMessage] = useState('')
	const [reloadKey, setReloadKey] = useState(0)

	const validateForm = () => {
		const nextErrors = {}

		if (!formData.title.trim()) {
			nextErrors.title = 'Please enter a product title.'
		}

		if (!formData.category.trim()) {
			nextErrors.category = 'Please enter a category.'
		}

		if (!formData.description.trim()) {
			nextErrors.description = 'Please enter a description.'
		} else if (formData.description.trim().length < 15) {
			nextErrors.description = 'Description should be at least 15 characters.'
		}

		if (!formData.price) {
			nextErrors.price = 'Please enter a price.'
		} else if (Number.isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
			nextErrors.price = 'Price must be a number greater than 0.'
		}

		return nextErrors
	}

	useEffect(() => {
		const controller = new AbortController()

		const fetchProduct = async () => {
			try {
				setIsLoading(true)
				setError('')
				setSuccessMessage('')

				const response = await axios.get(`https://fakestoreapi.com/products/${productId}`, {
					signal: controller.signal,
					timeout: 10000,
				})

				setFormData({
					title: response.data.title ?? '',
					price: response.data.price?.toString() ?? '',
					description: response.data.description ?? '',
					category: response.data.category ?? '',
				})
			} catch (requestError) {
				if (requestError.code !== 'ERR_CANCELED') {
					setError(getApiErrorMessage(requestError, 'Unable to load product data for editing right now. Please try again.'))
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

	const handleChange = (event) => {
		const { name, value } = event.target
		setFormData((previous) => ({
			...previous,
			[name]: value,
		}))

		setFieldErrors((previous) => ({
			...previous,
			[name]: undefined,
		}))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()

		if (isSubmitting) {
			return
		}

		setError('')
		setSuccessMessage('')

		const nextErrors = validateForm()
		setFieldErrors(nextErrors)

		if (Object.keys(nextErrors).length > 0) {
			return
		}

		setIsSubmitting(true)

		try {
			await axios.put(`https://fakestoreapi.com/products/${productId}`, {
				title: formData.title.trim(),
				price: Number(formData.price),
				description: formData.description.trim(),
				category: formData.category.trim(),
			}, { timeout: 10000 })

			setSuccessMessage('Product updated successfully in FakeStoreAPI test mode. The response is simulated and does not persist permanent changes.')
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to update product right now. Please try again.'))
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className="edit-product-page">
			<div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
				<div>
					<Badge bg="dark" className="mb-2 px-3 py-2">Edit Product</Badge>
					<h1 className="h2 fw-bold text-dark mb-2">Update product details</h1>
					<p className="text-secondary mb-0">
						Edit product information and submit a PUT request to FakeStoreAPI.
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
				<Card className="border-0 shadow-sm edit-product-card">
					<Card.Body className="p-4 p-lg-5 d-grid gap-4">
						<Placeholder as="div" animation="glow"><Placeholder xs={6} /></Placeholder>
						<Placeholder as="div" animation="glow"><Placeholder xs={12} /><Placeholder xs={10} /></Placeholder>
						<Placeholder as="div" animation="glow"><Placeholder xs={12} /><Placeholder xs={8} /></Placeholder>
						<Placeholder as="div" animation="glow"><Placeholder.Button xs={3} /></Placeholder>
					</Card.Body>
				</Card>
			) : null}

			{!isLoading ? (
				<Card className="border-0 shadow-sm edit-product-card">
					<Card.Body className="p-4 p-lg-5">
						<Form onSubmit={handleSubmit} className="d-grid gap-4">
							<Form.Group controlId="title">
								<Form.Label className="fw-semibold">Product title</Form.Label>
								<Form.Control
									type="text"
									name="title"
									value={formData.title}
									onChange={handleChange}
									isInvalid={Boolean(fieldErrors.title)}
								/>
								<Form.Control.Feedback type="invalid">{fieldErrors.title}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group controlId="price">
								<Form.Label className="fw-semibold">Price</Form.Label>
								<Form.Control
									type="number"
									name="price"
									value={formData.price}
									onChange={handleChange}
									min="0"
									step="0.01"
									isInvalid={Boolean(fieldErrors.price)}
								/>
								<Form.Control.Feedback type="invalid">{fieldErrors.price}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group controlId="description">
								<Form.Label className="fw-semibold">Description</Form.Label>
								<Form.Control
									as="textarea"
									rows={4}
									name="description"
									value={formData.description}
									onChange={handleChange}
									isInvalid={Boolean(fieldErrors.description)}
								/>
								<Form.Control.Feedback type="invalid">{fieldErrors.description}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group controlId="category">
								<Form.Label className="fw-semibold">Category</Form.Label>
								<Form.Control
									type="text"
									name="category"
									value={formData.category}
									onChange={handleChange}
									isInvalid={Boolean(fieldErrors.category)}
								/>
								<Form.Control.Feedback type="invalid">{fieldErrors.category}</Form.Control.Feedback>
							</Form.Group>

							<div className="d-flex flex-wrap gap-3">
								<Button type="submit" variant="dark" disabled={isSubmitting}>
									{isSubmitting ? 'Updating product...' : 'Update Product'}
								</Button>
								<Button type="button" variant="outline-secondary" disabled={isSubmitting} onClick={() => setFieldErrors(validateForm())}>
									Validate Form
								</Button>
							</div>
						</Form>
					</Card.Body>
				</Card>
			) : null}
		</section>
	)
}

export default EditProduct
