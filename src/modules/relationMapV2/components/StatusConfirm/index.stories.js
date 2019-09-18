/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { Entities, SortAndFilter, ClientSorts } from 'modules/relationMapV2/store';
import StatusConfirm from './index';
import { RelationMapContext, initialState } from '../OrderFocus/store';

storiesOf('RelationMapV2', module).add('StatusConfirm', () => (
  <ObjectValue defaultValue={initialState}>
    {({ value, set }) => (
      <RelationMapContext.Provider
        value={{
          state: value,
          dispatch: () => {
            set({
              status: {
                isOpen: false,
                isProcessing: false,
              },
            });
          },
        }}
      >
        <SortAndFilter.Provider>
          <Entities.Provider>
            <ClientSorts.Provider>
              <button
                type="button"
                onClick={() => {
                  set({
                    status: {
                      isOpen: true,
                      isProcessing: false,
                      source: 'Order',
                    },
                  });
                }}
              >
                Click to open the status dialog
              </button>
              <StatusConfirm onSuccess={console.warn} />
            </ClientSorts.Provider>
          </Entities.Provider>
        </SortAndFilter.Provider>
      </RelationMapContext.Provider>
    )}
  </ObjectValue>
));
