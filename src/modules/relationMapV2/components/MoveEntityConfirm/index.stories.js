/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { Entities, SortAndFilter, ClientSorts } from 'modules/relationMapV2/store';
import MoveEntityConfirm from './index';
import { RelationMapContext, initialState } from '../OrderFocus/store';

storiesOf('RelationMapV2', module).add('MoveEntityConfirm', () => (
  <ObjectValue defaultValue={initialState}>
    {({ value, set }) => (
      <RelationMapContext.Provider
        value={{
          state: value,
          dispatch: () => {
            set({
              moveEntity: {
                isOpen: false,
                isProcessing: false,
                detail: {
                  from: {
                    id: '1',
                    icon: 'BATCH',
                    value: 'batch no1',
                  },
                  to: {
                    id: '2',
                    icon: 'ORDER',
                    value: 'poNo 1',
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
                    moveEntity: {
                      isOpen: true,
                      isProcessing: false,
                      detail: {
                        from: {
                          id: '1',
                          icon: 'BATCH',
                          value: 'batch no1',
                        },
                        to: {
                          id: '2',
                          icon: 'ORDER',
                          value: 'poNo 1',
                        },
                      },
                    },
                  });
                }}
              >
                Click to open the confirm dialog
              </button>
              <MoveEntityConfirm onSuccess={console.warn} />
            </ClientSorts.Provider>
          </Entities.Provider>
        </SortAndFilter.Provider>
      </RelationMapContext.Provider>
    )}
  </ObjectValue>
));
