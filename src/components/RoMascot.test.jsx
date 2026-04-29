import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RoMascot from './RoMascot';

describe('RoMascot', () => {
  it('renders the mascot container, shell, and core', () => {
    const { container } = render(<RoMascot />);

    expect(container.querySelector('.ro-container')).toBeInTheDocument();
    expect(container.querySelector('.ro-shell')).toBeInTheDocument();
    expect(container.querySelector('.ro-core')).toBeInTheDocument();
  });

  it('uses idle mode by default', () => {
    const { container } = render(<RoMascot />);

    const core = container.querySelector('.ro-core');
    expect(core).toHaveClass('ro-core', 'idle');
  });

  it('uses normal size by default', () => {
    const { container } = render(<RoMascot />);

    const wrapper = container.querySelector('.ro-container');
    expect(wrapper).toHaveStyle('transform: scale(1)');
  });

  it('applies large size scaling when size is large', () => {
    const { container } = render(<RoMascot size="large" />);

    const wrapper = container.querySelector('.ro-container');
    expect(wrapper).toHaveStyle('transform: scale(1.5)');
  });

  it('applies thinking class to the core when mode is thinking', () => {
    const { container } = render(<RoMascot mode="thinking" />);

    const core = container.querySelector('.ro-core');
    expect(core).toHaveClass('ro-core', 'thinking');
  });

  it('applies comfort class to the core when mode is comfort', () => {
    const { container } = render(<RoMascot mode="comfort" />);

    const core = container.querySelector('.ro-core');
    expect(core).toHaveClass('ro-core', 'comfort');
  });

  it('applies excited class to the core when mode is excited', () => {
    const { container } = render(<RoMascot mode="excited" />);

    const core = container.querySelector('.ro-core');
    expect(core).toHaveClass('ro-core', 'excited');
  });

  it('renders the outer rotating ring only in thinking mode', () => {
    const { container } = render(<RoMascot mode="thinking" />);

    const rings = Array.from(container.querySelectorAll('div')).filter(
      (el) => el.style.animation === 'spin-ring 2s linear infinite'
    );

    expect(rings).toHaveLength(1);
    expect(rings[0]).toHaveStyle('position: absolute');
    expect(rings[0]).toHaveStyle('width: 120%');
    expect(rings[0]).toHaveStyle('height: 120%');
    expect(rings[0]).toHaveStyle('border-radius: 50%');
    expect(rings[0]).toHaveStyle('opacity: 0.5');
  });

  it('does not render the outer rotating ring when mode is idle', () => {
    const { container } = render(<RoMascot mode="idle" />);

    const rings = Array.from(container.querySelectorAll('div')).filter(
      (el) => el.style.animation === 'spin-ring 2s linear infinite'
    );

    expect(rings).toHaveLength(0);
  });

  it('does not render the outer rotating ring when mode is comfort', () => {
    const { container } = render(<RoMascot mode="comfort" />);

    const rings = Array.from(container.querySelectorAll('div')).filter(
      (el) => el.style.animation === 'spin-ring 2s linear infinite'
    );

    expect(rings).toHaveLength(0);
  });

  it('does not render the outer rotating ring when mode is excited', () => {
    const { container } = render(<RoMascot mode="excited" />);

    const rings = Array.from(container.querySelectorAll('div')).filter(
      (el) => el.style.animation === 'spin-ring 2s linear infinite'
    );

    expect(rings).toHaveLength(0);
  });

  it('renders the reflection highlight inside the shell', () => {
    const { container } = render(<RoMascot />);

    const highlight = Array.from(container.querySelectorAll('div')).find(
      (el) =>
        el.style.background === 'rgba(255, 255, 255, 0.8)' ||
        el.style.background === 'rgba(255,255,255,0.8)'
    );

    expect(highlight).toBeInTheDocument();
    expect(highlight).toHaveStyle('position: absolute');
    expect(highlight).toHaveStyle('top: 15%');
    expect(highlight).toHaveStyle('left: 15%');
    expect(highlight).toHaveStyle('width: 20%');
    expect(highlight).toHaveStyle('height: 10%');
    expect(highlight).toHaveStyle('border-radius: 50%');
  });

  it('keeps shell rendered in thinking mode', () => {
    const { container } = render(<RoMascot mode="thinking" />);

    expect(container.querySelector('.ro-shell')).toBeInTheDocument();
  });

  it('combines large size and thinking mode correctly', () => {
    const { container } = render(<RoMascot mode="thinking" size="large" />);

    const wrapper = container.querySelector('.ro-container');
    const core = container.querySelector('.ro-core');
    const rings = Array.from(container.querySelectorAll('div')).filter(
      (el) => el.style.animation === 'spin-ring 2s linear infinite'
    );

    expect(wrapper).toHaveStyle('transform: scale(1.5)');
    expect(core).toHaveClass('ro-core', 'thinking');
    expect(rings).toHaveLength(1);
  });
});