/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { Entities, SortAndFilter, ClientSorts } from 'modules/relationMapV2/store';
import DeleteConfirm from './index';
import { RelationMapContext, initialState } from '../OrderFocus/store';

storiesOf('RelationMapV2', module).add('DeleteConfirm', () => (
  <ObjectValue defaultValue={initialState}>
    {({ value, set }) => (
      <RelationMapContext.Provider
        value={{
          state: value,
          dispatch: () => {
            set({
              delete: {
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
                    delete: {
                      isOpen: true,
                      isProcessing: false,
                      source: 'Order',
                    },
                  });
                }}
              >
                Click to open the delete dialog
              </button>
              <DeleteConfirm onSuccess={console.warn} />
            </ClientSorts.Provider>
          </Entities.Provider>
        </SortAndFilter.Provider>
      </RelationMapContext.Provider>
    )}
  </ObjectValue>
));
