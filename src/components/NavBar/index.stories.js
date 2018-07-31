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
import Tabs from './components/Tabs';
import FilterInput from './components/FilterInput';
import SortInput from './components/SortInput';
import SearchInput from './components/SearchInput';

class TabsToggle extends React.Component {
  state = {
    isActive: true,
  };

  onActive = () => {
    this.setState({ isActive: true });
  };

  onArchived = () => {
    this.setState({ isActive: false });
  };

  render() {
    const { isActive } = this.state;
    return (
      <Tabs color="RED" isActive={isActive} onActive={this.onActive} onArchived={this.onArchived} />
    );
  }
}

storiesOf('Navbar', module).add('title', () => (
  <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
    <div style={{ height: '2000px' }}>
      <NavBar>
        <EntityIcon icon="fasShip" color="RED" />
        <TabsToggle />
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
