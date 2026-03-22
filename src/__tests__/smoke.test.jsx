import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import ProductList from '../components/ProductList'
import ProductDetails from '../components/ProductDetails'
import AddProduct from '../components/AddProduct'
import EditProduct from '../components/EditProduct'
import DeleteProduct from '../components/DeleteProduct'

vi.mock('axios')

describe('Fake Store smoke tests', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders product list from API', async () => {
		axios.get.mockResolvedValueOnce({
			data: [{
				id: 1,
				title: 'Backpack',
				price: 109.95,
				category: 'bags',
				rating: { rate: 4.1, count: 120 },
				image: 'https://example.com/bag.png',
			}],
		})

		render(
			<MemoryRouter>
				<ProductList />
			</MemoryRouter>,
		)

		expect(screen.getByText(/featured products/i)).toBeInTheDocument()
		await screen.findByText('Backpack')
		expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument()
	})

	it('retries product list fetch after an initial failure', async () => {
		axios.get
			.mockRejectedValueOnce(new Error('network down'))
			.mockResolvedValueOnce({
				data: [{
					id: 11,
					title: 'Retry Product',
					price: 12.5,
					category: 'retry-category',
					rating: { rate: 3.9, count: 8 },
					image: 'https://example.com/retry.png',
				}],
			})

		render(
			<MemoryRouter>
				<ProductList />
			</MemoryRouter>,
		)

		await screen.findByText(/unable to load products right now/i)
		fireEvent.click(screen.getByRole('button', { name: /retry/i }))

		await screen.findByText('Retry Product')
		expect(axios.get).toHaveBeenCalledTimes(2)
	})

	it('renders product details route', async () => {
		axios.get.mockResolvedValueOnce({
			data: {
				id: 2,
				title: 'Laptop Sleeve',
				price: 39.99,
				category: 'electronics',
				description: 'Soft sleeve for 15-inch laptop',
				rating: { rate: 4.7, count: 52 },
				image: 'https://example.com/sleeve.png',
			},
		})

		render(
			<MemoryRouter initialEntries={['/products/2']}>
				<Routes>
					<Route path="/products/:productId" element={<ProductDetails />} />
				</Routes>
			</MemoryRouter>,
		)

		await screen.findByText('Laptop Sleeve')
		expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
	})

	it('shows validation errors on add product submit', async () => {
		render(
			<MemoryRouter>
				<AddProduct />
			</MemoryRouter>,
		)

		fireEvent.click(screen.getByRole('button', { name: /create product/i }))

		await waitFor(() => {
			expect(screen.getByText(/please enter a product title/i)).toBeInTheDocument()
			expect(screen.getByText(/please enter a price/i)).toBeInTheDocument()
		})
	})

	it('loads edit product form values', async () => {
		axios.get.mockResolvedValueOnce({
			data: {
				title: 'Wrist Watch',
				price: 89.5,
				description: 'A watch for daily use and travel.',
				category: 'accessories',
			},
		})

		render(
			<MemoryRouter initialEntries={['/products/7/edit']}>
				<Routes>
					<Route path="/products/:productId/edit" element={<EditProduct />} />
				</Routes>
			</MemoryRouter>,
		)

		await screen.findByDisplayValue('Wrist Watch')
		expect(screen.getByRole('button', { name: /update product/i })).toBeInTheDocument()
	})

	it('loads delete product confirmation page', async () => {
		axios.get.mockResolvedValueOnce({
			data: {
				id: 9,
				title: 'Sneakers',
				price: 59.99,
				category: 'footwear',
			},
		})

		render(
			<MemoryRouter initialEntries={['/products/9/delete']}>
				<Routes>
					<Route path="/products/:productId/delete" element={<DeleteProduct />} />
				</Routes>
			</MemoryRouter>,
		)

		await screen.findByText('Sneakers')
		expect(screen.getByRole('button', { name: /^delete product$/i })).toBeInTheDocument()
	})
})
