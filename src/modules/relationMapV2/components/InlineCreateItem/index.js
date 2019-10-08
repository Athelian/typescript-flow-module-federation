// @flow
import * as React from 'react';
import type { OrderItem } from 'generated/graphql';
import { useMutation } from '@apollo/react-hooks';

import SlideView from 'components/SlideView';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import SelectProductProviders from './SelectProductProviders';
import { createOrderItemMutation } from './mutation';

type Props = {|
  onSuccess: (string, Array<OrderItem>) => void,
|};

export default function InlineCreateBatch({ onSuccess }: Props) {
  const { mapping } = Entities.useContainer();
  const { dispatch, state } = FocusedView.useContainer();
  const [createItem] = useMutation(createOrderItemMutation);
  const {
    isOpen,
    isProcessing,
    detail: { entity },
  } = state.createItem;
  const orderId = entity?.id ?? '';
  const order = mapping.entities?.orders?.[orderId];
  return (
    <SlideView
      isOpen={isOpen}
      onRequestClose={() =>
        dispatch({
          type: 'CREATE_ITEM_END',
          payload: {},
        })
      }
    >
      {isOpen && (
        <SelectProductProviders
          isLoading={isProcessing}
          onSelect={selectedItems => {
            dispatch({
              type: 'CREATE_ITEM_START',
              payload: {},
            });
            // TODO: migrate to new mutation if has
            Promise.all(
              selectedItems.map(productProvider =>
                createItem({
                  variables: {
                    input: {
                      orderId,
                      productProviderId: productProvider?.id,
                      no: `${productProvider?.product?.name ?? ''} ${productProvider?.product
                        ?.serial ?? ''}`,
                      batches: [],
                      quantity: 0,
                      price: {
                        amount:
                          order?.currency === productProvider?.unitPrice?.currency
                            ? productProvider?.unitPrice?.amount
                            : 0,
                        currency: order?.currency,
                      },
                      files: [],
                      tagIds: (productProvider?.product?.tags ?? [])
                        .filter(tag => (tag?.entityTypes ?? []).includes('OrderItem'))
                        .map(tag => tag?.id)
                        .filter(Boolean),
                    },
                  },
                })
              )
            )
              .then(result => onSuccess(orderId, result.map(item => item?.data?.orderItemCreate)))
              .catch(() => {
                dispatch({
                  type: 'CREATE_ITEM_END',
                  payload: {},
                });
              });
          }}
          onCancel={() =>
            dispatch({
              type: 'CREATE_ITEM_END',
              payload: {},
            })
          }
          importerId={order?.importer?.id}
          exporterId={order?.exporter?.id}
          orderCurrency={order?.currency}
        />
      )}
    </SlideView>
  );
}
