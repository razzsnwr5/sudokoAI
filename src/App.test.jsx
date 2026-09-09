import { expect, test } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'

test('renders the app title', async () => {
  render(<App />)
  await waitFor(() => {
    expect(screen.getByText(/Sudoku AI/i)).toBeDefined()
  })
})
