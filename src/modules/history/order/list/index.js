// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import scrollIntoView from 'utils/scrollIntoView';
import loadMore from 'utils/loadMore';
import MessageInput from 'modules/history/components/MessageInput';
import CommentWrapperStyle from 'modules/history/order/list/style';
import OrderEventsGridView from './OrderEventsGridView';
import query from './query';

type Props = {
  perPage: number,
  id: string,
};

class OrderEventsList extends React.PureComponent<Props> {
  componentDidMount() {
    setTimeout(() => {
      scrollIntoView({ targetId: 'topCommentArea' });
    }, 500);
  }

  render() {
    const { perPage, id } = this.props;
    return (
      <div>
        <div>
          <Query
            query={query}
            variables={{
              id,
              perPage,
              page: 1,
            }}
            fetchPolicy="network-only"
          >
            {({ loading, data, fetchMore, error }) => {
              if (error) {
                return error.message;
              }

              const nextPage = getByPathWithDefault(1, 'order.timeline.events.page', data) + 1;
              const totalPage = getByPathWithDefault(1, 'order.timeline.events.totalPage', data);
              const hasMore = nextPage <= totalPage;

              return (
                <OrderEventsGridView
                  items={getByPathWithDefault([], 'order.timeline.events.nodes', data)}
                  onLoadMore={() => loadMore({ fetchMore, data }, {}, 'order.timeline.events')}
                  hasMore={hasMore}
                  isLoading={loading}
                />
              );
            }}
          </Query>
          <div id="topCommentArea" />
        </div>
        <div className={CommentWrapperStyle}>
          <StringValue>
            {({ value, set }) => (
              <MessageInput
                name="comment"
                value={value}
                onChange={evt => set(evt.target.value)}
                onSubmit={() => console.warn(value)}
              />
            )}
          </StringValue>
        </div>
      </div>
    );
  }
}

export default OrderEventsList;
