// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import type { DocumentNode } from 'graphql/language/ast';
import GridView from 'components/GridView';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import Log from '../Log';
import Comment from '../Comment';
import CommentInput from '../CommentInput';
import DateSeparator from '../DateSeparator';
import DefaultFormatters, { type LogFormatter } from '../../formatters';
import { useScrollToBottom } from './hook';
import { CommentInputWrapperStyle, ListWrapperStyle, TimelineWrapperStyle } from './style';
import { decorateEntries, normalizeEntries } from './helper';

type Props = {
  query: DocumentNode,
  queryField: string,
  variables: Object,
  entity: Object,
  formatters: Array<LogFormatter>,
};

const defaultProps = {
  variables: {},
  formatters: [],
};

const Timeline = ({
  query,
  queryField,
  variables,
  entity,
  formatters: customFormatters,
}: Props) => {
  const [setRef] = useScrollToBottom();

  const baseVariables = {
    ...variables,
    page: 1,
    perPage: 20,
  };
  const formatters = [...customFormatters, ...DefaultFormatters];

  return (
    <div className={TimelineWrapperStyle}>
      <div ref={setRef} className={ListWrapperStyle}>
        <Query query={query} variables={baseVariables}>
          {({ data, loading, fetchMore, error }) => {
            if (error) {
              return error.message;
            }

            const nextPage =
              getByPathWithDefault(1, `${queryField}.timeline.entries.page`, data) + 1;
            const totalPage = getByPathWithDefault(
              1,
              `${queryField}.timeline.entries.totalPage`,
              data
            );
            const items = decorateEntries(
              normalizeEntries(
                getByPathWithDefault([], `${queryField}.timeline.entries.nodes`, data)
              ).reverse()
            );
            const hasMore = nextPage <= totalPage;

            return (
              <GridView
                onLoadMore={() =>
                  loadMore({ fetchMore, data }, baseVariables, `${queryField}.timeline.entries`)
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
                      return <Comment key={item.id} comment={item} />;
                    case 'DateSeparator':
                      return <DateSeparator key={item.id} date={item} />;
                    default:
                      return null;
                  }
                })}
              </GridView>
            );
          }}
        </Query>
      </div>
      <div className={CommentInputWrapperStyle}>
        <CommentInput entity={entity} />
      </div>
    </div>
  );
};

Timeline.defaultProps = defaultProps;

export default Timeline;
