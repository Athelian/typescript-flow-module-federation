/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { Entities, SortAndFilter, ClientSorts } from 'modules/relationMapV2/store';
import Header from './index';
import { RelationMapContext, initialState } from '../OrderFocus/store';

storiesOf('RelationMapV2', module).add('Header', () => (
  <RelationMapContext.Provider value={{ state: initialState, dispatch: console.warn }}>
    <SortAndFilter.Provider>
      <Entities.Provider>
        <ClientSorts.Provider>
          <Header />
        </ClientSorts.Provider>
      </Entities.Provider>
    </SortAndFilter.Provider>
  </RelationMapContext.Provider>
));
