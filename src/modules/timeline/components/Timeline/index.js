// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import type { DocumentNode } from 'graphql/language/ast';
import GridView from 'components/GridView';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import DefaultFormatters, { type LogFormatter } from 'modules/timeline/formatters';
import Log from '../Log';
import Comment from '../Comment';
import CommentInput from '../CommentInput';
import DateSeparator from '../DateSeparator';
import { CommentInputWrapperStyle, ListWrapperStyle, TimelineWrapperStyle } from './style';
import { decorateEntries, normalizeEntries } from './helper';

type Props = {
  query: DocumentNode,
  queryField: string,
  variables: Object,
  entity: Object,
  formatters: { [key: string]: LogFormatter },
};

const defaultProps = {
  variables: {},
  formatters: {},
};

const Timeline = ({
  query,
  queryField,
  variables: baseVariables,
  entity,
  formatters: customFormatters,
}: Props) => {
  const ref = React.useRef(null);

  const variables = {
    ...baseVariables,
    page: 1,
    perPage: 20,
  };
  const formatters = { ...DefaultFormatters, ...customFormatters };

  return (
    <Query
      query={query}
      variables={variables}
      onCompleted={() => {
        if (ref && ref.current) {
          ref.current.scrollTop = ref.current.scrollHeight;
        }
      }}
    >
      {({ data, loading, fetchMore, error }) => {
        if (error) {
          return error.message;
        }

        const nextPage = getByPathWithDefault(1, `${queryField}.timeline.entries.page`, data) + 1;
        const totalPage = getByPathWithDefault(1, `${queryField}.timeline.entries.totalPage`, data);
        const items = decorateEntries(
          normalizeEntries(
            getByPathWithDefault([], `${queryField}.timeline.entries.nodes`, data)
          ).reverse()
        );
        const hasMore = nextPage <= totalPage;

        return (
          <div className={TimelineWrapperStyle}>
            <div ref={ref} className={ListWrapperStyle}>
              <GridView
                onLoadMore={() =>
                  loadMore({ fetchMore, data }, variables, `${queryField}.timeline.entries`)
                }
                hasMore={hasMore}
                isLoading={loading}
                itemWidth="100%"
                isEmpty={items.length === 0}
                isReverse
                rowGap="10px"
                padding="30px 100px"
                emptyMessage="No logs"
              >
                {items.map((item: any) => {
                  // eslint-disable-next-line no-underscore-dangle
                  switch (item.__typename) {
                    case 'Log':
                      return <Log key={item.id} formatters={formatters} log={item} />;
                    case 'Comment':
                      return (
                        <Comment
                          key={item.id}
                          comment={item}
                          query={query}
                          queryField={queryField}
                          variables={variables}
                        />
                      );
                    case 'DateSeparator':
                      return <DateSeparator key={item.id} date={item} />;
                    default:
                      return null;
                  }
                })}
              </GridView>
            </div>
            {!loading && (
              <div className={CommentInputWrapperStyle}>
                <CommentInput
                  entity={entity}
                  query={query}
                  queryField={queryField}
                  variables={variables}
                />
              </div>
            )}
          </div>
        );
      }}
    </Query>
  );
};

Timeline.defaultProps = defaultProps;

export default Timeline;
