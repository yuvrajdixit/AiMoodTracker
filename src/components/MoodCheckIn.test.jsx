import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'
import MoodCheckIn from './MoodCheckIn'

// Move mock to TOP LEVEL (fixes Vitest warning)
vi.mock('lucide-react', () => ({
  Tag: () => <svg data-testid="tag-icon" size={16} />,
}))

describe('MoodCheckIn', () => {
  it('renders sliders and UI elements', () => {
    render(<MoodCheckIn onSave={vi.fn()} />)
    
    expect(screen.getByText('Internal Weather Report')).toBeInTheDocument()
    expect(screen.getAllByRole('slider')).toHaveLength(2)
    expect(screen.getByText('Sleep 😴')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log data point/i })).toBeInTheDocument()
  })

  it('updates valence slider state', () => {
    render(<MoodCheckIn onSave={vi.fn()} />)
    
    const [valenceSlider] = screen.getAllByRole('slider')
    fireEvent.input(valenceSlider, { target: { value: '3' } })
    
    expect(valenceSlider).toHaveValue('3')
  })

  it('updates energy slider state', () => {
    render(<MoodCheckIn onSave={vi.fn()} />)
    
    const [, energySlider] = screen.getAllByRole('slider')
    fireEvent.input(energySlider, { target: { value: '-2' } })
    
    expect(energySlider).toHaveValue('-2')
  })

  it('calls onSave with correct data structure on submit', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<MoodCheckIn onSave={onSave} />)
    
    const [valenceSlider, energySlider] = screen.getAllByRole('slider')
    const sleepTag = screen.getByText('Sleep 😴')
    const submitBtn = screen.getByRole('button', { name: /log data point/i })
    
    // Direct input events (works with your onChange handlers)
    fireEvent.input(valenceSlider, { target: { value: '2' } })
    fireEvent.input(energySlider, { target: { value: '1' } })
    
    // Click tag + submit
    await user.click(sleepTag)
    await user.click(submitBtn)
    
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      valence: 2,
      energy: 1,  // Your component uses "energy" not "arousal"
      tags: expect.arrayContaining(['Sleep 😴']),  // Matches your exact tag text
    }))
  })
})