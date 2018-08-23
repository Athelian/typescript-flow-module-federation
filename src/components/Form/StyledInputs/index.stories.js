import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import FieldItem from 'components/Form/FieldItem';
import { StyledTextInput } from 'components/Form/StyledInputs';

const wrapper = {
  padding: '100px',
  display: 'grid',
  gridAutoRows: 'min-content',
  gridGap: '20px',
};

storiesOf('Styled Inputs', module).add('Text Input', () => (
  <div style={wrapper}>
    <FieldItem
      label="REGULAR"
      input={hasError => <StyledTextInput hasError={hasError} value="Hello" width="200px" />}
    />
    <FieldItem
      label="PLACEHOLDER"
      input={hasError => <StyledTextInput hasError={hasError} placeholder="Input" width="200px" />}
    />
    <FieldItem
      label="FORCE HOVER STYLE"
      input={hasError => <StyledTextInput hasError={hasError} forceHoverStyle width="200px" />}
    />
    <FieldItem
      label="FORCE HOVER STYLE"
      input={hasError => <StyledTextInput hasError={hasError} forceHoverStyle />}
    />
  </div>
));
