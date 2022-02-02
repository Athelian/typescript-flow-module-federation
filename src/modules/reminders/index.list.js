/* eslint-disable no-unused-vars, no-redeclare */
// @flow

import { EntityIcon, Filter, NavBar, Search } from 'components/NavBar';
import React, { useState } from 'react';

import { BaseButton } from 'components/Buttons';
import { Content } from 'components/Layout';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import useFilterSort from 'hooks/useFilterSort';

// import ReminderForm from './form';
import ReminderList from './list';

type Props = {};

const ReminderListModule = () => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '' },
    { updatedAt: 'DESCENDING' }
  );

  return (
    <Content>
      <SlideView isOpen={isOpen} onRequestClose={close}>
        {/* <ReminderForm /> */}
        form
      </SlideView>
      <NavBar>
        <EntityIcon icon="CLOCK" color="ORANGE_DARKER" />
        <Search query={query} onChange={setQuery} />
        <BaseButton
          icon="ADD"
          label={
            <FormattedMessage
              id="components.button.addNewReminder"
              defaultMessage="ADD NEW REMINDER"
            />
          }
          backgroundColor="TEAL"
          hoverBackgroundColor="TEAL_DARK"
          onClick={open}
        />
      </NavBar>
      <ReminderList
        close={close}
        open={open}
        filterBy={{
          ...filterBy,
        }}
      />
    </Content>
  );
};

export default ReminderListModule;
