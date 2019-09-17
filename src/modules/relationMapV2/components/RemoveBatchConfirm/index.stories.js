/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { Entities, SortAndFilter, ClientSorts } from 'modules/relationMapV2/store';
import DeleteItemConfirm from './index';
import { RelationMapContext, initialState } from '../OrderFocus/store';

storiesOf('RelationMapV2', module).add('DeleteItemConfirm', () => (
  <ObjectValue defaultValue={initialState}>
    {({ value, set }) => (
      <RelationMapContext.Provider
        value={{
          state: value,
          dispatch: () => {
            set({
              batchActions: {
                isOpen: false,
                isProcessing: false,
                detail: {
                  entity: {
                    id: '',
                    no: '',
                  },
                },
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
                    batchActions: {
                      isOpen: true,
                      isProcessing: false,
                      detail: {
                        entity: {
                          id: '1',
                          no: 'test',
                        },
                      },
                    },
                  });
                }}
              >
                Click to open the delete dialog
              </button>
              <DeleteItemConfirm onSuccess={console.warn} />
            </ClientSorts.Provider>
          </Entities.Provider>
        </SortAndFilter.Provider>
      </RelationMapContext.Provider>
    )}
  </ObjectValue>
));
