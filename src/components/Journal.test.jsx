import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Journal from './Journal'

vi.mock('sentiment', () => ({
  default: class Sentiment {
    analyze(text) {
      const lower = text.toLowerCase()
      if (lower.includes('sad')) return { score: -3 }
      if (lower.includes('happy')) return { score: 3 }
      return { score: 0 }
    }
  },
}))

vi.mock('./RoMascot', () => ({
  default: ({ mode }) => <div data-testid="ro-mascot" data-mode={mode}>Ro</div>,
}))

vi.mock('lucide-react', () => ({
  Wind: () => <svg data-testid="wind-icon" />,
  Clock: () => <svg data-testid="clock-icon" />,
  Mic: () => <svg data-testid="mic-icon" />,
  MicOff: () => <svg data-testid="mic-off-icon" />,
  Save: () => <svg data-testid="save-icon" />,
}))

describe('Journal', () => {
  const mockStartBreathing = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    mockStartBreathing.mockClear()
    window.alert = vi.fn()

    Object.defineProperty(window, 'SpeechRecognition', {
      value: undefined,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(window, 'webkitSpeechRecognition', {
      value: undefined,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders journal input area with mic button and mascot', () => {
    render(<Journal onStartBreathing={mockStartBreathing} />)

    expect(
      screen.getByPlaceholderText(/what is occupying your mind right now/i)
    ).toBeInTheDocument()
    expect(screen.getByTestId('ro-mascot')).toBeInTheDocument()
    expect(screen.getByTestId('mic-icon')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /analyze & log/i })
    ).toBeInTheDocument()
  })

  it('shows browser support alert when speech recognition is unavailable', () => {
    render(<Journal onStartBreathing={mockStartBreathing} />)

    const micButton = screen.getByTitle(/voice input/i)
    fireEvent.click(micButton)

    expect(window.alert).toHaveBeenCalledWith(
      'Your browser does not support voice input. Try Chrome or Edge.'
    )
  })

  it('enters listening state when speech recognition is available', () => {
    class MockSpeechRecognition {
      constructor() {
        this.continuous = false
        this.lang = ''
        this.interimResults = false
        this.onresult = null
        this.onerror = null
        this.onend = null
      }

      start() {}
    }

    Object.defineProperty(window, 'SpeechRecognition', {
      value: MockSpeechRecognition,
      writable: true,
      configurable: true,
    })

    render(<Journal onStartBreathing={mockStartBreathing} />)

    const micButton = screen.getByTitle(/voice input/i)
    fireEvent.click(micButton)

    expect(screen.getByText(/listening to your voice/i)).toBeInTheDocument()
    expect(screen.getByTestId('mic-off-icon')).toBeInTheDocument()
    expect(screen.getByTestId('ro-mascot')).toHaveAttribute('data-mode', 'thinking')
  })

  it('analyzes positive entry, shows insight, and adds to history', () => {
    render(<Journal onStartBreathing={mockStartBreathing} />)

    const textarea = screen.getByPlaceholderText(/what is occupying your mind right now/i)
    const analyzeButton = screen.getByRole('button', { name: /analyze & log/i })

    fireEvent.change(textarea, { target: { value: 'I feel happy today' } })
    fireEvent.click(analyzeButton)

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(screen.getByText(/rō's insight/i)).toBeInTheDocument()
    expect(screen.getAllByText(/win\. anchoring/i)).toHaveLength(2)
    expect(screen.getByTestId('ro-mascot')).toHaveAttribute('data-mode', 'excited')
    expect(screen.getByText(/past insights/i)).toBeInTheDocument()
    expect(screen.getByText(/"i feel happy today"/i)).toBeInTheDocument()
  })

  it('shows decompression button for negative sentiment and calls onStartBreathing', () => {
    render(<Journal onStartBreathing={mockStartBreathing} />)

    const textarea = screen.getByPlaceholderText(/what is occupying your mind right now/i)
    const analyzeButton = screen.getByRole('button', { name: /analyze & log/i })

    fireEvent.change(textarea, { target: { value: 'I feel sad' } })
    fireEvent.click(analyzeButton)

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(screen.getByText(/rō's insight/i)).toBeInTheDocument()
    expect(screen.getAllByText(/heavy emotions/i)).toHaveLength(2)

    const breatheButton = screen.getByRole('button', {
      name: /enter decompression mode/i,
    })
    expect(breatheButton).toBeInTheDocument()

    fireEvent.click(breatheButton)
    expect(mockStartBreathing).toHaveBeenCalledTimes(1)
  })

  it('does not analyze empty entries', () => {
    render(<Journal onStartBreathing={mockStartBreathing} />)

    const analyzeButton = screen.getByRole('button', { name: /analyze & log/i })
    fireEvent.click(analyzeButton)

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(screen.queryByText(/rō's insight/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/past insights/i)).not.toBeInTheDocument()
  })
})