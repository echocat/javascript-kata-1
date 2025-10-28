import { describe, it, expect, vi } from 'vitest';
import App from '../App.js';

describe('App()', () => {
  it('should print hello world', () => {
    const consoleSpy = vi.spyOn(console, 'log');

    App();

    expect(consoleSpy).toHaveBeenCalledWith('Hello world!');
  });
});
