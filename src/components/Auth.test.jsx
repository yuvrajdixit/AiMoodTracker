import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Auth from './Auth'

vi.mock('./RoMascot', () => ({
  default: ({ mode, size }) => (
    <div data-testid="ro-mascot" data-mode={mode} data-size={size}>
      RoMascot
    </div>
  ),
}))

vi.mock('lucide-react', () => ({
  Mail: (props) => <svg data-testid="mail-icon" {...props} />,
  Lock: (props) => <svg data-testid="lock-icon" {...props} />,
  User: (props) => <svg data-testid="user-icon" {...props} />,
  ArrowRight: (props) => <svg data-testid="arrow-icon" {...props} />,
  Loader2: (props) => <svg data-testid="loader-icon" {...props} />,
}))

describe('Auth', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('renders login mode by default', () => {
    render(<Auth onLogin={vi.fn()} />)

    expect(
      screen.getByRole('heading', { level: 2, name: /welcome back/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/authenticate to access your neural log/i)
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/secure email/i)
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/passcode/i)
    ).toBeInTheDocument()

    expect(
      screen.queryByPlaceholderText(/designation \/ name/i)
    ).not.toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /access system/i })
    ).toBeInTheDocument()
  })

  it('toggles to signup mode and renders name input', () => {
    render(<Auth onLogin={vi.fn()} />)

    // Toggle with fireEvent (no userEvent)
    fireEvent.click(
      screen.getByRole('button', { name: /no access key\? initialize one\./i })
    )

    expect(
      screen.getByRole('heading', { level: 2, name: /initialize profile/i })
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/designation \/ name/i)
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /create access key/i })
    ).toBeInTheDocument()
  })

  it('updates form input values', () => {
    render(<Auth onLogin={vi.fn()} />)

    const emailInput = screen.getByPlaceholderText(/secure email/i)
    const passwordInput = screen.getByPlaceholderText(/passcode/i)

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'secret123' } })

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('secret123')
  })

  it('updates name input in signup mode', () => {
    render(<Auth onLogin={vi.fn()} />)

    fireEvent.click(
      screen.getByRole('button', { name: /no access key\? initialize one\./i })
    )

    const nameInput = screen.getByPlaceholderText(/designation \/ name/i)
    fireEvent.change(nameInput, { target: { value: 'Aman' } })

    expect(nameInput).toHaveValue('Aman')
  })

  it('renders RoMascot with idle mode initially', () => {
    render(<Auth onLogin={vi.fn()} />)

    const mascot = screen.getByTestId('ro-mascot')
    expect(mascot).toHaveAttribute('data-mode', 'idle')
    expect(mascot).toHaveAttribute('data-size', 'normal')
  })

it('shows loading state during submit and calls onLogin after timeout', () => {
  const onLogin = vi.fn()

  render(<Auth onLogin={onLogin} />)

  fireEvent.change(screen.getByPlaceholderText(/secure email/i), {
    target: { value: 'test@example.com' },
  })

  fireEvent.change(screen.getByPlaceholderText(/passcode/i), {
    target: { value: 'secret123' },
  })

  const submitButton = screen.getByRole('button', { name: /access system/i })

  act(() => {
    fireEvent.click(submitButton)
  })

  expect(screen.getByText(/authenticating/i)).toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: /authenticating/i })
  ).toBeDisabled()
  expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
  expect(screen.getByTestId('ro-mascot')).toHaveAttribute('data-mode', 'thinking')
  expect(onLogin).not.toHaveBeenCalled()

  act(() => {
    vi.advanceTimersByTime(1500)
  })

  expect(onLogin).toHaveBeenCalledTimes(1)
})

  it('returns from signup mode back to login mode', () => {
    render(<Auth onLogin={vi.fn()} />)

    // Toggle to signup
    fireEvent.click(
      screen.getByRole('button', { name: /no access key\? initialize one\./i })
    )

    // Toggle back
    fireEvent.click(
      screen.getByRole('button', { name: /already have access\? authenticate\./i })
    )

    expect(
      screen.getByRole('heading', { level: 2, name: /welcome back/i })
    ).toBeInTheDocument()

    expect(
      screen.queryByPlaceholderText(/designation \/ name/i)
    ).not.toBeInTheDocument()
  })
})