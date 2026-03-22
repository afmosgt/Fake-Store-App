import axios from 'axios'

export const getApiErrorMessage = (error, fallbackMessage) => {
	if (axios.isAxiosError(error)) {
		const isTimeout = error.code === 'ECONNABORTED' || /timeout/i.test(error.message || '')

		if (isTimeout) {
			return 'The request timed out. Please check your connection and try again.'
		}
	}

	return fallbackMessage
}
