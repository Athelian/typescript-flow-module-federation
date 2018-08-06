import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
import TextInput from 'components/TextInput';
import SearchInput from 'components/base/SearchInput';
import FilterInput from './index';

storiesOf('FilterInput', module).add('with handler', () => (
  <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
    <FilterInput initialFilter={{}} onChange={action('onChange')}>
      {({ values, setFieldValue }) => (
        <div>
          <SearchInput onChange={query => setFieldValue('query', query)} />
          <TextInput
            name="text"
            value={values.textinput}
            onChange={e => setFieldValue('textinput', e.target.value)}
            hideLabel
          />
        </div>
      )}
    </FilterInput>
  </IntlProvider>
));
