import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import LandingPage from './LandingPage'

vi.mock('./RoMascot', () => ({
  default: ({ mode, size }) => (
    <div data-testid="ro-mascot" data-mode={mode} data-size={size}>
      RoMascot
    </div>
  ),
}))

vi.mock('lucide-react', () => ({
  BrainCircuit: (props) => <svg data-testid="brain-icon" {...props} />,
  Activity: (props) => <svg data-testid="activity-icon" {...props} />,
  ShieldCheck: (props) => <svg data-testid="shield-icon" {...props} />,
  ArrowRight: (props) => <svg data-testid="arrow-icon" {...props} />,
}))

describe('LandingPage', () => {
  it('renders hero section content', () => {
    render(<LandingPage onEnter={vi.fn()} />)

    expect(
      screen.getByText(/ai-powered psychology/i)
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 1, name: /master your internal weather/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/mindscape combines/i)
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /enter system/i })
    ).toBeInTheDocument()
  })

  it('calls onEnter when CTA button is clicked', async () => {
    const user = userEvent.setup()
    const onEnter = vi.fn()

    render(<LandingPage onEnter={onEnter} />)

    await user.click(screen.getByRole('button', { name: /enter system/i }))

    expect(onEnter).toHaveBeenCalledTimes(1)
  })

  it('renders the science section and all feature cards', () => {
    render(<LandingPage onEnter={vi.fn()} />)

    expect(
      screen.getByRole('heading', { level: 2, name: /the science of clarity/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 3, name: /bi-dimensional tracking/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 3, name: /cbt ai analysis/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 3, name: /private & local/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/russell's circumplex model/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/natural language processing/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/all data processing happens locally in your browser/i)
    ).toBeInTheDocument()
  })

  it('renders RoMascot with the expected props', () => {
    render(<LandingPage onEnter={vi.fn()} />)

    const mascot = screen.getByTestId('ro-mascot')

    expect(mascot).toHaveAttribute('data-mode', 'idle')
    expect(mascot).toHaveAttribute('data-size', 'large')
  })

  it('renders all mocked icons', () => {
    render(<LandingPage onEnter={vi.fn()} />)

    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument()
    expect(screen.getByTestId('activity-icon')).toBeInTheDocument()
    expect(screen.getByTestId('brain-icon')).toBeInTheDocument()
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument()
  })
})