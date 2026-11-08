// Vitest suite for tests/tool.test.ts
import { describe, it, expect } from 'vitest';
import { processInput, ToolResult } from '../src/tool.ts';

describe('processInput', () => {
  it('should handle a valid data URL and return success', () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/8cZ5GQAAAABJRU5ErkJggg==';
    const res: ToolResult = processInput(dataUrl);
    expect(res.success).toBe(true);
    expect(res.data).toContain('iconSpecs');
    expect(res.data).toContain('webmanifest');
    expect(res.data).toContain('htmlLinks');
  });

  it('should handle emoji input and return success', () => {
    const res = processInput('😀');
    expect(res.success).toBe(true);
    expect(res.data).toContain('iconSpecs');
    expect(res.data).toContain('webmanifest');
  });

  it('should return error for unsupported input', () => {
    const res = processInput('random text');
    expect(res.success).toBe(false);
    expect(res.error).toBe('Unsupported input');
  });
});

