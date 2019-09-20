/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { Entities, SortAndFilter, ClientSorts } from 'modules/relationMapV2/store';
import AutoFill from './index';
import { RelationMapContext, initialState } from '../OrderFocus/store';

storiesOf('RelationMapV2', module).add('AutoFill', () => (
  <ObjectValue defaultValue={initialState}>
    {({ value, set }) => (
      <RelationMapContext.Provider
        value={{
          state: value,
          dispatch: () => {
            set({
              itemActions: {
                isOpen: false,
                isProcessing: false,
                detail: {
                  entity: {
                    id: '',
                    no: '',
                  },
                  from: {
                    id: '',
                    type: 'SHIPMENT',
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
                    itemActions: {
                      isOpen: true,
                      isProcessing: false,
                      type: 'deleteItem',
                      detail: {
                        entity: {
                          id: '1',
                          no: 'test',
                        },
                        from: {
                          id: '',
                          type: 'SHIPMENT',
                        },
                      },
                    },
                  });
                }}
              >
                Click to open the delete dialog
              </button>
              <AutoFill onSuccess={console.warn} />
            </ClientSorts.Provider>
          </Entities.Provider>
        </SortAndFilter.Provider>
      </RelationMapContext.Provider>
    )}
  </ObjectValue>
));
