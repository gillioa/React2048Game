// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import {
  ReadableStream,
  TransformStream,
  WritableStream,
} from 'node:stream/web';

// Polyfill Web Streams for libraries like 'ai' and 'eventsource-parser'
Object.defineProperties(globalThis, {
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
  WritableStream: { value: WritableStream },
});
