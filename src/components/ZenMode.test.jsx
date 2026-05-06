import React from 'react';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ZenMode from './ZenMode';

vi.mock('lucide-react', () => ({
  X: (props) => <svg data-testid="zen-close-icon" {...props} />,
}));

describe('ZenMode', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the fullscreen zen mode UI', () => {
    const { container } = render(<ZenMode onClose={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Inhale' })).toBeInTheDocument();
    expect(screen.getByText('Focus on the movement.')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('zen-close-icon')).toBeInTheDocument();
    expect(container.querySelector('.breathing-circle')).toBeInTheDocument();
    expect(container.querySelector('.inner-glow')).toBeInTheDocument();
  });

  it('renders the breathing text inside a heading', () => {
    render(<ZenMode onClose={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Inhale' })).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();

    render(<ZenMode onClose={onClose} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('starts immediately with Inhale after the effect runs', () => {
    render(<ZenMode onClose={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Inhale' })).toBeInTheDocument();
  });

  it('cycles from Inhale to Hold after 4 seconds', () => {
    render(<ZenMode onClose={vi.fn()} />);

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Hold' })).toBeInTheDocument();
  });

  it('cycles from Hold to Exhale after 8 seconds total', () => {
    render(<ZenMode onClose={vi.fn()} />);

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Exhale' })).toBeInTheDocument();
  });

  it('cycles back to Hold after 12 seconds total', () => {
    render(<ZenMode onClose={vi.fn()} />);

    act(() => {
      vi.advanceTimersByTime(12000);
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Hold' })).toBeInTheDocument();
  });

  it('loops back to Inhale after 16 seconds total', () => {
    render(<ZenMode onClose={vi.fn()} />);

    act(() => {
      vi.advanceTimersByTime(16000);
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Inhale' })).toBeInTheDocument();
  });

  it('continues repeating the breathing cycle over multiple loops', () => {
    render(<ZenMode onClose={vi.fn()} />);

    act(() => {
      vi.advanceTimersByTime(24000);
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Exhale' })).toBeInTheDocument();
  });

  it('registers a 4-second interval for the breathing cycle', () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');

    render(<ZenMode onClose={vi.fn()} />);

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 4000);
  });

  it('clears the interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    const { unmount } = render(<ZenMode onClose={vi.fn()} />);
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
  });

  it('injects animation styles for the breathing UI', () => {
    const { container } = render(<ZenMode onClose={vi.fn()} />);

    const styleTag = container.querySelector('style');
    expect(styleTag).toBeInTheDocument();
    expect(styleTag.textContent).toContain('.breathing-circle');
    expect(styleTag.textContent).toContain('.inner-glow');
    expect(styleTag.textContent).toContain('@keyframes breathe');
    expect(styleTag.textContent).toContain('animation: breathe 16s infinite ease-in-out');
  });

  it('applies expected inline layout styles to the root overlay', () => {
    const { container } = render(<ZenMode onClose={vi.fn()} />);
    const root = container.firstChild;

    expect(root).toHaveStyle('position: fixed');
    expect(root).toHaveStyle('top: 0px');
    expect(root).toHaveStyle('left: 0px');
    expect(root).toHaveStyle('display: flex');
    expect(root).toHaveStyle('flex-direction: column');
    expect(root).toHaveStyle('justify-content: center');
    expect(root).toHaveStyle('align-items: center');
    expect(root).toHaveStyle('z-index: 1000');
    expect(root).toHaveStyle('background-color: #0a0a12');
  });

  it('applies expected inline styles to the close button', () => {
    render(<ZenMode onClose={vi.fn()} />);

    const button = screen.getByRole('button');

    expect(button).toHaveStyle('position: absolute');
    expect(button).toHaveStyle('top: 40px');
    expect(button).toHaveStyle('right: 40px');
    expect(button).toHaveStyle('background: transparent');
    expect(button).toHaveStyle('cursor: pointer');
  });

  it('keeps the helper text visible during breathing state changes', () => {
    render(<ZenMode onClose={vi.fn()} />);

    expect(screen.getByText('Focus on the movement.')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText('Focus on the movement.')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText('Focus on the movement.')).toBeInTheDocument();
  });
});