import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('<Blog /> inside container', () => {
  let container;

  beforeEach(() => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Testman',
      likes: 0,
      url: 'http://localhost:1234/',
      user: 'asdf',
    };
    container = render(<Blog blog={blog} />).container;
  });

  test('<Blog /> renders its title and author without showing the url by default', () => {
    const blogElement = container.querySelector('.blog');
    expect(blogElement).toHaveTextContent(
      'Component testing is done with react-testing-library Testman'
    );

    const urlElement = blogElement.querySelector('.url');
    expect(urlElement).not.toBeVisible();

    const likesElement = blogElement.querySelector('.likes');
    expect(likesElement).not.toBeVisible();
  });

  test('<Blog /> shows the url and number of likes when the button controlling the shown details has been clicked', async () => {
    const blogElement = container.querySelector('.blog');

    // Click the button
    const toggleShowButton = blogElement.querySelector('.btn-toggle-show');
    const user = userEvent.setup();
    await user.click(toggleShowButton);

    // Elements are now visible
    const likesElement = blogElement.querySelector('.likes');
    expect(likesElement).toBeVisible();

    const urlElement = blogElement.querySelector('.url');
    expect(urlElement).toBeVisible();
  });
});

describe('<Blog /> with mock handler stubs', () => {
  let container;
  const mockHandlerEdit = vi.fn();
  const mockHandlerDelete = vi.fn();

  beforeEach(() => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Testman',
      likes: 0,
      url: 'http://localhost:1234/',
      user: 'asdf',
    };
    container = render(
      <Blog
        blog={blog}
        handleEditBlog={mockHandlerEdit}
        handleDeleteBlog={mockHandlerDelete}
      />
    ).container;
  });

  test('<Blog /> the like button can be clicked twice', async () => {
    const blogElement = container.querySelector('.blog');
    const user = userEvent.setup();

    const likeButton = blogElement.querySelector('.btn-like');

    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandlerEdit.mock.calls).toHaveLength(2);
  });
});
