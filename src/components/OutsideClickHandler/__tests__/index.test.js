import React from 'react';
import { render } from '@testing-library/react';
import OutsideClickHandler from '../index';

describe('<OutsideClickHandler />', () => {
  it('should render without crash', () => {
    const { container } = render(
      <OutsideClickHandler onOutsideClick={() => {}}>
        Click outside of this element.
      </OutsideClickHandler>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
