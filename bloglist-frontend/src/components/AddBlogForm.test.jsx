import { render, screen, waitFor } from '@testing-library/react';
import AddBlogForm from './AddBlogForm';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('<AddBlogForm />', () => {
  test('create new blog with the right details', async () => {
    const mockAddBlogHandler = vi.fn();
    const mockAlertHandler = vi.fn();

    const container = render(
      <AddBlogForm
        handleAddBlog={mockAddBlogHandler}
        handleAlert={mockAlertHandler}
      />
    ).container;

    const blogFormElement = container.querySelector('.blog-form');
    const inputTitleElement = blogFormElement.querySelector('.input-title');
    const inputAuthorElement = blogFormElement.querySelector('.input-author');
    const inputUrlElement = blogFormElement.querySelector('.input-url');
    const submitButtonElement = blogFormElement.querySelector('.btn-submit');

    const user = userEvent.setup();
    await user.click(inputTitleElement);
    await user.keyboard('title test');
    await user.click(inputAuthorElement);
    await user.keyboard('author test');
    await user.click(inputUrlElement);
    await user.keyboard('http://localhost:42069/test');
    await user.click(submitButtonElement);

    // screen.debug(blogFormElement);

    await waitFor(() => {
      expect(mockAddBlogHandler).toBeCalled();
    });
    // expect(mockAddBlogHandler.mock.calls).toHaveLength(1);
  });
});
