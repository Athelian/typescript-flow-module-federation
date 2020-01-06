import React from 'react';
import { render, screen } from '@testing-library/react';
import OutsideClickHandler from '../index';

describe('<OutsideClickHandler />', () => {
  it('should render without crash', () => {
    render(
      <OutsideClickHandler onOutsideClick={() => {}}>
        Click outside of this element.
      </OutsideClickHandler>
    );
    expect(screen).toMatchSnapshot();
  });
});
