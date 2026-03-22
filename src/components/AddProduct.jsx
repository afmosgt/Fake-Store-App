import { useState } from 'react'
import axios from 'axios'
import { Alert, Badge, Button, Card, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getApiErrorMessage } from '../utils/apiError'

const initialForm = {
	title: '',
	price: '',
	description: '',
	category: '',
}

function AddProduct() {
	const [formData, setFormData] = useState(initialForm)
	const [fieldErrors, setFieldErrors] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [successMessage, setSuccessMessage] = useState('')

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
			await axios.post('https://fakestoreapi.com/products', {
				title: formData.title.trim(),
				price: Number(formData.price),
				description: formData.description.trim(),
				category: formData.category.trim(),
				image: 'https://i.pravatar.cc',
			}, { timeout: 10000 })

			setSuccessMessage('Product created successfully in FakeStoreAPI test mode. The response is simulated and does not persist this product permanently.')
			setFormData(initialForm)
			setFieldErrors({})
		} catch (requestError) {
			setError(getApiErrorMessage(requestError, 'Unable to create product right now. Please try again.'))
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className="add-product-page">
			<div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
				<div>
					<Badge bg="dark" className="mb-2 px-3 py-2">Create Product</Badge>
					<h1 className="h2 fw-bold text-dark mb-2">Add a new product</h1>
					<p className="text-secondary mb-0">
						Submit this form to send a POST request to FakeStoreAPI and test your product-creation flow.
					</p>
				</div>
				<Button as={Link} to="/products" variant="outline-dark">
					Back to Products
				</Button>
			</div>

			{error ? <Alert variant="danger">{error}</Alert> : null}
			{successMessage ? <Alert variant="success">{successMessage}</Alert> : null}

			<Card className="border-0 shadow-sm add-product-card">
				<Card.Body className="p-4 p-lg-5">
					<Form onSubmit={handleSubmit} className="d-grid gap-4">
						<Form.Group controlId="title">
							<Form.Label className="fw-semibold">Product title</Form.Label>
							<Form.Control
								type="text"
								name="title"
								value={formData.title}
								onChange={handleChange}
								placeholder="Ex: Urban Utility Jacket"
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
								placeholder="Ex: 49.99"
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
								placeholder="Describe the product highlights, features, and use case."
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
								placeholder="Ex: men's clothing"
								isInvalid={Boolean(fieldErrors.category)}
							/>
							<Form.Control.Feedback type="invalid">{fieldErrors.category}</Form.Control.Feedback>
						</Form.Group>

						<div className="d-flex flex-wrap gap-3">
							<Button type="submit" variant="dark" disabled={isSubmitting}>
								{isSubmitting ? 'Creating product...' : 'Create Product'}
							</Button>
							<Button
								type="button"
								variant="outline-secondary"
								onClick={() => {
									setFormData(initialForm)
									setFieldErrors({})
									setError('')
									setSuccessMessage('')
								}}
								disabled={isSubmitting}
							>
								Reset Form
							</Button>
						</div>
					</Form>
				</Card.Body>
			</Card>
		</section>
	)
}

export default AddProduct
