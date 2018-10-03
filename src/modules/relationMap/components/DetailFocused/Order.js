// @flow
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { Provider, Subscribe } from 'unstated';
import QueryDetail from 'components/common/QueryDetail';
import query from 'modules/order/form/query';
import OrderForm from 'modules/order/form';
import {
  OrderItemsContainer,
  OrderInfoContainer,
  OrderTagsContainer,
  OrderFilesContainer,
} from 'modules/order/form/containers';
import { updateOrderMutation, prepareUpdateOrderInput } from 'modules/order/form/mutation';
import { decodeId } from 'utils/id';

type Props = {
  orderId: string,
};
class Order extends React.PureComponent<Props> {
  onSave = async (
    formData: Object,
    saveOrder: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { orderId } = this.props;
    const input = prepareUpdateOrderInput(formData);

    const { data } = await saveOrder({ variables: { input, id: decodeId(orderId) } });
    const {
      orderUpdate: { violations },
    } = data;
    if (violations && violations.length) {
      onErrors(violations);
    } else {
      onSuccess();
    }
  };

  render() {
    const { orderId } = this.props;
    return (
      <Provider>
        <Mutation
          mutation={updateOrderMutation}
          onCompleted={() => console.log('completed')}
          key={decodeId(orderId)}
        >
          {saveOrder => (
            <QueryDetail
              query={query}
              detailId={orderId}
              detailType="order"
              render={order => (
                <Subscribe
                  to={[
                    OrderItemsContainer,
                    OrderInfoContainer,
                    OrderTagsContainer,
                    OrderFilesContainer,
                  ]}
                >
                  {(orderItemState, orderInfoState, orderTagsState, orderFilesState) => (
                    <OrderForm
                      order={order}
                      onChangeStatus={(formData, onSuccess) =>
                        this.onSave(
                          {
                            ...orderItemState.state,
                            ...orderInfoState.state,
                            ...orderTagsState.state,
                            ...orderFilesState.state,
                            ...formData,
                          },
                          saveOrder,
                          onSuccess
                        )
                      }
                      onDetailReady={() => {
                        const { orderItems, tags, files, ...info } = order;
                        orderItemState.initDetailValues(orderItems);
                        orderTagsState.initDetailValues(tags);
                        orderInfoState.initDetailValues(info);
                        orderFilesState.initDetailValues(files);
                      }}
                    />
                  )}
                </Subscribe>
              )}
            />
          )}
        </Mutation>
      </Provider>
    );
  }
}

export default Order;
