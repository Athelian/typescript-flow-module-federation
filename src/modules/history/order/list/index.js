// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import { Query, Mutation } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import scrollIntoView from 'utils/scrollIntoView';
import loadMore from 'utils/loadMore';
import LoadingIcon from 'components/LoadingIcon';
import MessageInput from 'modules/history/components/MessageInput';
import CommentWrapperStyle from 'modules/history/order/list/style';
import OrderEventsGridView from './OrderEventsGridView';
import query from './query';
import {
  eventCommentCreateMutation,
  eventCommentDeleteMutation,
  eventCommentUpdateMutation,
} from './mutation';

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
      <Query
        query={query}
        variables={{
          id,
          perPage,
          page: 1,
        }}
        fetchPolicy="network-only"
      >
        {({ loading, data, fetchMore, error, refetch, client }) => {
          if (error) {
            return error.message;
          }

          const nextPage = getByPathWithDefault(1, 'order.timeline.events.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'order.timeline.events.totalPage', data);
          const hasMore = nextPage <= totalPage;

          const timelineId = getByPathWithDefault(1, 'order.timeline.id', data);
          return (
            <>
              <OrderEventsGridView
                items={getByPathWithDefault([], 'order.timeline.events.nodes', data)}
                onLoadMore={() => loadMore({ fetchMore, data }, {}, 'order.timeline.events')}
                hasMore={hasMore}
                isLoading={loading}
                onUpdate={async ({ id: commentId, content }) => {
                  await client.mutate({
                    mutation: eventCommentUpdateMutation,
                    variables: {
                      id: commentId,
                      input: {
                        content,
                      },
                    },
                  });
                }}
                onDelete={async commentId => {
                  await client.mutate({
                    mutation: eventCommentDeleteMutation,
                    variables: {
                      id: commentId,
                    },
                  });
                  refetch();
                }}
              />
              <div id="topCommentArea" />
              <div className={CommentWrapperStyle}>
                <StringValue>
                  {({ value, set }) => (
                    <Mutation
                      mutation={eventCommentCreateMutation}
                      onCompleted={() => {
                        scrollIntoView({ targetId: 'topCommentArea' });
                        set('');
                        refetch();
                      }}
                    >
                      {(addComment, { loading: isLoading }) => (
                        <>
                          {isLoading && <LoadingIcon />}
                          <MessageInput
                            name="comment"
                            value={value}
                            onChange={evt => set(evt.target.value)}
                            onSubmit={() =>
                              addComment({
                                variables: {
                                  input: {
                                    content: value,
                                    timelineId,
                                  },
                                },
                              })
                            }
                          />
                        </>
                      )}
                    </Mutation>
                  )}
                </StringValue>
              </div>
            </>
          );
        }}
      </Query>
    );
  }
}

export default OrderEventsList;
