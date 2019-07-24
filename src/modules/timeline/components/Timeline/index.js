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

type Props = {|
  query: DocumentNode,
  queryField: string,
  variables: Object,
  entity: Object,
  formatters: { [key: string]: LogFormatter },
|};

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
  const [isReady, setIsReady] = React.useState(false);
  const ROW_HEIGHT = 60;
  const variables = {
    ...baseVariables,
    page: 1,
    perPage: Math.ceil((window.innerHeight - 90) / ROW_HEIGHT),
  };
  const formatters = { ...DefaultFormatters, ...customFormatters };

  React.useLayoutEffect(() => {
    setTimeout(() => {
      if (isReady && ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, 400);
  }, [isReady]);

  return (
    <div className={TimelineWrapperStyle}>
      <Query
        query={query}
        variables={variables}
        fetchPolicy="network-only"
        onCompleted={() => {
          setIsReady(true);
        }}
      >
        {({ data, loading, fetchMore, error }) => {
          if (error) {
            return error.message;
          }

          const page = getByPathWithDefault(1, `${queryField}.timeline.entries.page`, data);
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
          const hasMore = page < totalPage;

          return (
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
                threshold={50}
                rowGap="10px"
                padding="30px 100px"
                emptyMessage="No logs"
              >
                {items.map((item: any) => {
                  switch (getByPathWithDefault('', '__typename', item)) {
                    case 'Log':
                      return (
                        <Log
                          key={getByPathWithDefault('', 'id', item)}
                          formatters={formatters}
                          log={item}
                        />
                      );
                    case 'Comment':
                      return (
                        <Comment
                          key={getByPathWithDefault('', 'id', item)}
                          comment={item}
                          query={query}
                          queryField={queryField}
                          variables={variables}
                        />
                      );
                    case 'DateSeparator':
                      return (
                        <DateSeparator key={getByPathWithDefault('', 'id', item)} date={item} />
                      );
                    default:
                      return null;
                  }
                })}
              </GridView>
            </div>
          );
        }}
      </Query>
      <div className={CommentInputWrapperStyle}>
        <CommentInput
          entity={entity}
          query={query}
          queryField={queryField}
          variables={variables}
          onCompleted={() => {
            if (ref.current) {
              ref.current.scrollTop = ref.current.scrollHeight;
            }
          }}
        />
      </div>
    </div>
  );
};

Timeline.defaultProps = defaultProps;

export default Timeline;
