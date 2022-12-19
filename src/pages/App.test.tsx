import { describe, test } from '@jest/globals';
import { render } from '@testing-library/react';
import { App } from '@pages';

describe('App component', () => {
  test('it renders', () => {
    render(<App />);
  });
});
