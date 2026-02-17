import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
class IntersectionObserverMock {
  constructor() {
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
    this.takeRecords = vi.fn();
  }
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// Mock ResizeObserver
class ResizeObserverMock {
  constructor() {
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
  }
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Mock scrollTo
window.scrollTo = vi.fn();
