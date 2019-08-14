// @flow
import * as React from 'react';
import produce from 'immer';
import { VariableSizeList as List } from 'react-window';
import update from 'immutability-helper';
import { Query } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import apolloClient from 'apollo';
import useFilter from 'hooks/useFilter';
import loadMore from 'utils/loadMore';
import { uuid } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import { UIContext } from 'modules/ui';
import { Display } from 'components/Form';
import { orderFocusedListQuery, orderFocusDetailQuery } from 'modules/relationMapV2/query';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import type { State } from './type.js.flow';
import { WrapperStyle, ListStyle, RowStyle } from './style';
import SelectedEntity from '../SelectedEntity';
import Header from '../Header';
import Row from '../Row';
import cellRenderer from './cellRenderer';
import generateListData from './generateListData';

const LoadingPlaceHolder = React.memo(() => {
  return (
    <div className={RowStyle} style={{ overflow: 'hidden', height: window.innerHeight - 120 }}>
      {[
        {
          type: 'placeholder',
          entity: ORDER,
          data: {
            id: uuid(),
          },
        },
        {
          type: 'placeholder',
          entity: ORDER_ITEM,
          data: {
            id: uuid(),
          },
        },
        {
          type: 'placeholder',
          entity: BATCH,
          data: {
            id: uuid(),
          },
        },
        {
          type: 'placeholder',
          entity: CONTAINER,
          data: {
            id: uuid(),
          },
        },
        {
          type: 'placeholder',
          entity: SHIPMENT,
          data: {
            id: uuid(),
          },
        },
      ].map(cell =>
        cellRenderer(cell, {
          onClick: () => {},
          dispatch: () => {},
          isExpand: false,
          order: {},
          state: {
            order: {},
            targets: [],
          },
        })
      )}
    </div>
  );
});

const hasMoreItems = (data: Object, model: string = 'orders') => {
  const nextPage = getByPathWithDefault(1, `${model}.page`, data) + 1;
  const totalPage = getByPathWithDefault(1, `${model}.totalPage`, data);
  return nextPage <= totalPage;
};

const initialState: State = {
  order: {},
  targets: [],
};

function reducer(
  state,
  action: {
    type: 'FETCH_ORDER' | 'TARGET',
    payload: {
      entity?: string,
      [string]: mixed,
    },
  }
) {
  switch (action.type) {
    case 'FETCH_ORDER':
      return update(state, {
        order: {
          $merge: action.payload,
        },
      });

    case 'TARGET':
      return produce(state, draft => {
        if (draft.targets.includes(action.payload.entity)) {
          draft.targets.splice(draft.targets.indexOf(action.payload.entity), 1);
        } else {
          draft.targets.push(action.payload.entity || '');
        }
      });
    default:
      return state;
  }
}

const innerElementType = React.forwardRef(
  ({ children, ...rest }: { children: React.Node }, ref) => (
    <div ref={ref} {...rest}>
      <Header style={{ top: 0, left: 0, width: '100%', zIndex: 2, position: 'sticky' }} />
      {children}
    </div>
  )
);

export default function OrderFocus() {
  const uiContext = React.useContext(UIContext);
  const [expandRows, setExpandRows] = React.useState([]);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const queryOrderDetail = React.useCallback((orderId: string) => {
    apolloClient
      .query({
        query: orderFocusDetailQuery,
        variables: {
          id: orderId,
        },
      })
      .then(result => {
        dispatch({
          type: 'FETCH_ORDER',
          payload: {
            [orderId]: result.data.order,
          },
        });
      });
  }, []);

  const { queryVariables: queryOrderVariables } = useFilter(
    {
      page: 1,
      perPage: 10,
      filter: {
        query: '',
        archived: false,
      },
      sort: {
        field: 'updatedAt',
        direction: 'DESCENDING',
      },
    },
    'orderFocusedFilter'
  );

  return (
    <>
      <div className={WrapperStyle}>
        <Query
          query={orderFocusedListQuery}
          variables={queryOrderVariables}
          fetchPolicy="network-only"
        >
          {({ loading, data, error, fetchMore }) => {
            if (error) {
              return error.message;
            }

            if (loading) {
              return (
                <>
                  <Header />
                  <LoadingPlaceHolder />
                </>
              );
            }

            const orders = getByPathWithDefault([], 'orders.nodes', data);
            const ordersData = generateListData({
              orders,
              state,
              expandRows,
              setExpandRows,
              queryOrderDetail,
              dispatch,
            });
            const rowCount = ordersData.length;
            return orders.length > 0 ? (
              <List
                itemData={ordersData}
                className={ListStyle}
                itemCount={rowCount}
                innerElementType={innerElementType}
                itemSize={() => 75}
                onItemsRendered={({ visibleStopIndex }) => {
                  const isLastCell = visibleStopIndex === rowCount - 1;
                  if (hasMoreItems(data, 'orders') && isLastCell) {
                    loadMore({ fetchMore, data }, queryOrderVariables, 'orders');
                  }
                }}
                height={window.innerHeight - 50}
                width={
                  uiContext.isSideBarExpanded ? window.innerWidth - 200 : window.innerWidth - 50
                }
              >
                {Row}
              </List>
            ) : (
              <Display>
                <FormattedMessage
                  id="modules.Orders.noOrderFound"
                  defaultMessage="No orders found"
                />
              </Display>
            );
          }}
        </Query>
      </div>
      {state.targets.length > 0 && <SelectedEntity targets={state.targets} />}
    </>
  );
}
