import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
import TextInput from 'components/TextInput';
import NavBar from './index';
import EntityIcon from './components/EntityIcon';
import ViewToggle from './components/ViewToggle';
import FilterInput from './components/FilterInput';
import SortInput from './components/SortInput';
import SearchInput from './components/SearchInput';
import ActiveToggleTabs from './components/Tabs/ActiveToggleTabs';

storiesOf('Navbar', module).add('title', () => (
  <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
    <div style={{ height: '2000px' }}>
      <NavBar>
        <EntityIcon icon="fasShip" color="RED" />
        <ActiveToggleTabs onChange={index => console.log(index)} />
        <ViewToggle />
        <SortInput
          sort={{}}
          ascending
          fields={[
            { title: 'UPDATED AT', value: 'PO' },
            { title: 'CREATED AT', value: 'exporter' },
            { title: 'DELTED AT', value: 'updatedAt' },
            { title: 'BORNED AT', value: 'createdAt' },
          ]}
          onChange={() => {}}
        />
        <FilterInput initialFilter={{}} onChange={() => {}} width={400}>
          {() => (
            <React.Fragment>
              <SearchInput onChange={() => {}} stayExpanded />
              <TextInput />
            </React.Fragment>
          )}
        </FilterInput>
        <SearchInput onChange={() => {}} />
      </NavBar>
      <div style={{ marginTop: '500px' }}>Content</div>
    </div>
  </IntlProvider>
));
