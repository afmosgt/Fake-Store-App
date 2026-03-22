import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import App from '../App'

vi.mock('axios')

describe('Accessibility checks', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('has no obvious accessibility violations on the home route', async () => {
		const { container } = render(
			<MemoryRouter initialEntries={['/']}>
				<App />
			</MemoryRouter>,
		)

		const results = await axe(container)
		expect(results).toHaveNoViolations()
	})

	it('has no obvious accessibility violations on product listing after data loads', async () => {
		axios.get.mockResolvedValueOnce({
			data: [{
				id: 1,
				title: 'A11y Backpack',
				price: 79.99,
				category: 'bags',
				rating: { rate: 4.2, count: 32 },
				image: 'https://example.com/bag.png',
			}],
		})

		const { container } = render(
			<MemoryRouter initialEntries={['/products']}>
				<App />
			</MemoryRouter>,
		)

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledTimes(1)
		})

		const results = await axe(container)
		expect(results).toHaveNoViolations()
	})

	it('has no obvious accessibility violations when delete confirmation modal is open', async () => {
		axios.get.mockResolvedValueOnce({
			data: {
				id: 9,
				title: 'A11y Sneakers',
				price: 59.99,
				category: 'footwear',
			},
		})

		render(
			<MemoryRouter initialEntries={['/products/9/delete']}>
				<App />
			</MemoryRouter>,
		)

		await screen.findByText('A11y Sneakers')
		fireEvent.click(screen.getByRole('button', { name: /^delete product$/i }))
		await screen.findByRole('dialog', { name: /delete this product\?/i })

		const results = await axe(document.body)
		expect(results).toHaveNoViolations()
	})
})
