import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import FieldItem from 'components/Form/FieldItem';
import { StyledTextInput } from '.';

storiesOf('Styled Text Input', module).add('Text Input', () => (
  <div style={{ margin: '100px' }}>
    <FieldItem
      label="LABEL"
      input={hasError => <StyledTextInput hasError={hasError} value="Hello" />}
      errorMessage="erere"
    />
  </div>
));
