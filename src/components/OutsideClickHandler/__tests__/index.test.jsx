import React from 'react';
import renderer from 'react-test-renderer';
import OutsideClickHandler from '../index';

describe('<OutsideClickHandler />', () => {
  it('should render without crash', () => {
    const tree = renderer
      .create(
        <OutsideClickHandler onOutsideClick={() => {}}>
          Click outside of this element.
        </OutsideClickHandler>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
