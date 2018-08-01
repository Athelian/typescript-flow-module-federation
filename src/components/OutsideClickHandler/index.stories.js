import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import OutsideClickHandler from './index';

storiesOf('OutsideClickHandler', module)
  .add('with handler', () => (
    <OutsideClickHandler onOutsideClick={action('onOutsideClick')}>
      Click outside of this element then look at action logger.
    </OutsideClickHandler>
  ))
  .add('with ignore elements', () => (
    <div>
      <h3> This will be ignore </h3>
      <OutsideClickHandler
        ignoreElements={[document.getElementById('root')]}
        onOutsideClick={action('it should ignore on #root element')}
      >
        This will not fire onOutsideClick() because we ignore the `#root` element.
      </OutsideClickHandler>
    </div>
  ));
