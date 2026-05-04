import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Dashboard from './Dashboard'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ data, children }) => (
    <div data-testid="line-chart" data-points={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Line: ({ dataKey }) => <div data-testid={`line-${dataKey}`} />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
}))

describe('Dashboard', () => {
  let createElementSpy
  let fakeAnchor

  beforeEach(() => {
    // FIXED: Store original before spying
    const originalCreateElement = document.createElement.bind(document)

    fakeAnchor = {
      setAttribute: vi.fn(),
      click: vi.fn(),
    }

    createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tagName) => {
        if (tagName === 'a') return fakeAnchor
        // FIXED: Call original, not recursive mock
        return originalCreateElement(tagName)
      })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders charts and stats using provided logs', () => {
    const logs = [
      { date: 'Mon', valence: 2, energy: 1 },
      { date: 'Tue', valence: 4, energy: 3 },
    ]

    render(<Dashboard logs={logs} />)

    expect(screen.getByRole('button', { name: /export report/i })).toBeInTheDocument()
    expect(screen.getByText(/valence \(pleasantness\)/i)).toBeInTheDocument()
    expect(screen.getByText(/energy levels/i)).toBeInTheDocument()
    expect(screen.getByText(/total check-ins/i)).toBeInTheDocument()
    expect(screen.getByText(/avg\. valence/i)).toBeInTheDocument()

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3.0')).toBeInTheDocument()

    expect(screen.getAllByTestId('line-chart')).toHaveLength(2)
    expect(screen.getByTestId('line-valence')).toBeInTheDocument()
    expect(screen.getByTestId('line-energy')).toBeInTheDocument()
  })

  it('uses fallback chart data when logs are empty', () => {
    render(<Dashboard logs={[]} />)

    const charts = screen.getAllByTestId('line-chart')
    expect(charts).toHaveLength(2)

    const firstChartData = charts[0].getAttribute('data-points')
    expect(firstChartData).toContain('Mon')
    expect(firstChartData).toContain('Tue')
    expect(firstChartData).toContain('Wed')

    expect(screen.getAllByText('0')).toHaveLength(2)
  })

  it('exports logs as a downloadable json file', () => {
    const logs = [{ date: 'Mon', valence: 2, energy: 1 }]

    render(<Dashboard logs={logs} />)

    fireEvent.click(screen.getByRole('button', { name: /export report/i }))

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(fakeAnchor.setAttribute).toHaveBeenCalledWith(
      'download',
      'mindscape_report.json'
    )

    const hrefCall = fakeAnchor.setAttribute.mock.calls.find(
      ([key]) => key === 'href'
    )

    expect(hrefCall).toBeTruthy()
    expect(hrefCall[1]).toContain('data:application/json;charset=utf-8,')
    expect(hrefCall[1]).toContain(encodeURIComponent(JSON.stringify(logs, null, 2)))

    expect(fakeAnchor.click).toHaveBeenCalledTimes(1)
  })

  it('shows zero average valence when no logs exist', () => {
    render(<Dashboard logs={[]} />)

    expect(screen.getAllByText('0')).toHaveLength(2)
    expect(screen.getByText(/avg\. valence/i)).toBeInTheDocument()
  })
})