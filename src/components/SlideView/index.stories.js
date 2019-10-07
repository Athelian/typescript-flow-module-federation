/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import SlideView from './index';
import Dialog from '../Dialog';

const DialogWithSlide = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>

      <Dialog showCancelButton={false} onRequestClose={() => setOpen(false)} isOpen={open}>
        <div style={{ with: '200px', height: '50px' }}>
          <SlideWithDialog />
        </div>
      </Dialog>
    </div>
  );
};

const SlideWithDialog = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open slide
      </button>

      <SlideView isOpen={open} onRequestClose={() => setOpen(false)}>
        <DialogWithSlide />
      </SlideView>
    </div>
  );
};

storiesOf('SlideView', module).add('slide and dialog', () => {
  return <SlideWithDialog />;
});
