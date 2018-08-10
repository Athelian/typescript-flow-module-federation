import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
import { Form } from 'components/Form';
import TextInput from 'components/TextInput';
import NavBar from './NavBar';
import EntityIcon from './components/EntityIcon';
import ViewToggle from './components/ViewToggle';
import FilterInput from './components/FilterInput';
import SortInput from './components/SortInput';
import SearchInput from './components/SearchInput';
import ActiveToggleTabs from './components/Tabs/ActiveToggleTabs';

const fields = [
  { title: 'UPDATED AT', value: 'PO' },
  { title: 'CREATED AT', value: 'exporter' },
  { title: 'DELETED AT', value: 'updatedAt' },
  { title: 'BORNED AT', value: 'createdAt' },
];

storiesOf('Navbar', module)
  .add('itself with icon', () => (
    <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
      <div style={{ height: '2000px' }}>
        <NavBar>
          <EntityIcon icon="SHIPMENT" color="BLUE" />
        </NavBar>
        <div style={{ marginTop: '500px' }}>Content</div>
      </div>
    </IntlProvider>
  ))
  .add('sample', () => (
    <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
      <Form>
        {({ values, setFieldValue }) => (
          <div style={{ height: '2000px' }}>
            <NavBar>
              <EntityIcon icon="SHIPMENT" color="RED" />
              <ActiveToggleTabs onChange={index => index} />
              <ViewToggle />
              <SortInput
                sort={values.sort && values.sort.field ? values.sort.field : fields[0]}
                ascending={values.sort ? values.sort.ascending : true}
                fields={fields}
                onChange={field => setFieldValue('sort', field)}
              />
              <FilterInput
                initialFilter={{}}
                onChange={filter => setFieldValue('filter', filter)}
                width={400}
              >
                {({ setFieldValue: changeQuery }) => (
                  <React.Fragment>
                    <SearchInput onChange={query => changeQuery('query', query)} />
                    <TextInput />
                  </React.Fragment>
                )}
              </FilterInput>
              <SearchInput onChange={() => {}} />
            </NavBar>
            <div style={{ marginTop: '500px' }}>Content</div>
          </div>
        )}
      </Form>
    </IntlProvider>
  ));
