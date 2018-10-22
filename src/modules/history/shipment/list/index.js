// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import { Query, Mutation } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import scrollIntoView from 'utils/scrollIntoView';
import loadMore from 'utils/loadMore';
import MessageInput from 'modules/history/components/MessageInput';
import {
  eventCommentCreateMutation,
  eventCommentDeleteMutation,
  eventCommentUpdateMutation,
} from 'modules/history/mutation';
import { LogsBodyWrapperStyle, CommentWrapperStyle } from 'modules/history/style';
import ShipmentEventsGridView from './ShipmentEventsGridView';
import { shipmentLogsListQuery } from './query';

type Props = {
  perPage: number,
  id: string,
};

class ShipmentEventsList extends React.PureComponent<Props> {
  componentDidMount() {
    setTimeout(() => {
      scrollIntoView({ targetId: 'topCommentArea', boundaryId: 'logsBody' });
    }, 500);
  }

  render() {
    const { perPage, id } = this.props;
    return (
      <Query
        query={shipmentLogsListQuery}
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

          const nextPage = getByPathWithDefault(1, 'shipment.timeline.events.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'shipment.timeline.events.totalPage', data);
          const hasMore = nextPage <= totalPage;

          const timelineId = getByPathWithDefault(1, 'shipment.timeline.id', data);
          return (
            <>
              <div id="logsBody" className={LogsBodyWrapperStyle}>
                <ShipmentEventsGridView
                  items={getByPathWithDefault([], 'shipment.timeline.events.nodes', data)}
                  onLoadMore={() => loadMore({ fetchMore, data }, {}, 'shipment.timeline.events')}
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
              </div>

              <div className={CommentWrapperStyle}>
                <StringValue>
                  {({ value, set }) => (
                    <Mutation
                      mutation={eventCommentCreateMutation}
                      onCompleted={() => {
                        scrollIntoView({ targetId: 'topCommentArea', boundaryId: 'logsBody' });
                        set('');
                        refetch();
                      }}
                    >
                      {(addComment, { loading: isLoading }) => (
                        <MessageInput
                          name="comment"
                          value={value}
                          isLoading={isLoading}
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

export default ShipmentEventsList;
