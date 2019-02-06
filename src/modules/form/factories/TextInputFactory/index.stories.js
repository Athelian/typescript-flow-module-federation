/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import StoryBookWrapper from 'components/StoryBookWrapper';
import { ToggleInput, Label } from 'components/Form';
import { TextInputFactory } from 'modules/form/factories';

storiesOf('Input Factories', module).add('Text Input Factory', () => (
  <StoryBookWrapper>
    <ObjectValue
      defaultValue={{
        currentFocused: null,
        value: 'Hello',
        originalValue: 'Hello',
        readOnly: false,
        isNew: false,
      }}
    >
      {({
        value: { currentFocused, value, originalValue, readOnly, isNew },
        set: setFieldValue,
      }) => (
        <>
          <TextInputFactory
            name="inputOne"
            placeholder="Please input a value"
            onChange={e => setFieldValue('value', e.target.value)}
            onFocus={() => setFieldValue('currentFocused', 'inputOne')}
            onBlur={() => setFieldValue('currentFocused', null)}
            isNew={isNew}
            isFocused={currentFocused === 'inputOne'}
            readOnly={readOnly}
            value={value}
            originalValue={originalValue}
            label="SAMPLE INPUT"
            infoMessage="This is an info tooltip :)"
          />
          <ToggleInput toggled={readOnly} onToggle={() => setFieldValue('readOnly', !readOnly)}>
            <Label>READ ONLY</Label>
          </ToggleInput>
          <ToggleInput toggled={isNew} onToggle={() => setFieldValue('isNew', !isNew)}>
            <Label>IS NEW</Label>
          </ToggleInput>
        </>
      )}
    </ObjectValue>
  </StoryBookWrapper>
));
