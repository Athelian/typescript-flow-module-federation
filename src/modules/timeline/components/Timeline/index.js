// @flow
import * as React from 'react';
import type { Entry, FileType } from 'generated/graphql';
import { useViewerHasPermissions } from 'contexts/Permissions';
import { Query } from 'react-apollo';
import type { DocumentNode } from 'graphql/language/ast';
import GridView from 'components/GridView';
import {
  ORDER_DOCUMENT_GET,
  ORDER_DOCUMENT_GET_TYPE_PO,
  ORDER_DOCUMENT_GET_TYPE_PI,
} from 'modules/permission/constants/order';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import {
  PRODUCT_DOCUMENT_GET,
  PRODUCT_DOCUMENT_GET_TYPE_SPECIFICATION,
  PRODUCT_DOCUMENT_GET_TYPE_ANALYSIS_CERTIFICATE,
  PRODUCT_DOCUMENT_GET_TYPE_ORIGIN_CERTIFICATE,
} from 'modules/permission/constants/product';
import {
  SHIPMENT_DOCUMENT_GET,
  SHIPMENT_DOCUMENT_GET_TYPE_BL,
  SHIPMENT_DOCUMENT_GET_TYPE_INVOICE,
  SHIPMENT_DOCUMENT_GET_TYPE_PACKING_LIST,
  SHIPMENT_DOCUMENT_GET_TYPE_IMPORT_DECLARATION,
  SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_APPLICATION,
  SHIPMENT_DOCUMENT_GET_TYPE_WAREHOUSE_ARRIVAL_REPORT,
  SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_REPORT,
} from 'modules/permission/constants/shipment';
import { DOCUMENT_GET } from 'modules/permission/constants/file';
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

function filterByItemPriceLog(items: Array<Entry>, isBlackOut: boolean): Array<Entry> {
  if (!isBlackOut) return items;

  return items
    .filter(
      entry =>
        !(entry?.parentEntityType === 'orderItem' && entry?.parameters?.field?.string === 'price')
    )
    .reduce((result, entry, counter, entries) => {
      const lastEntry = result[result.length - 1];
      const lastEntryIsSeparator =
        entry?.__typename === 'DateSeparator' && counter === entries.length - 1;
      const hasTwoEntriesAreSeparator =
        lastEntry?.__typename === 'DateSeparator' && entry?.__typename === 'DateSeparator';
      if (hasTwoEntriesAreSeparator || lastEntryIsSeparator) return result;

      return [...result, entry];
    }, []);
}

function canViewFile(hasPermissions: Function, type: FileType) {
  switch (type) {
    case 'OrderPo':
      return hasPermissions([DOCUMENT_GET, ORDER_DOCUMENT_GET, ORDER_DOCUMENT_GET_TYPE_PO]);
    case 'OrderPi':
      return hasPermissions([DOCUMENT_GET, ORDER_DOCUMENT_GET, ORDER_DOCUMENT_GET_TYPE_PI]);
    case 'ShipmentBl':
      return hasPermissions([DOCUMENT_GET, SHIPMENT_DOCUMENT_GET, SHIPMENT_DOCUMENT_GET_TYPE_BL]);
    case 'ShipmentInvoice':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_INVOICE,
      ]);
    case 'ShipmentPackingList':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_PACKING_LIST,
      ]);
    case 'ShipmentImportDeclaration':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_IMPORT_DECLARATION,
      ]);
    case 'ShipmentInspectionApplication':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_APPLICATION,
      ]);
    case 'ShipmentWarehouseArrivalReport':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_WAREHOUSE_ARRIVAL_REPORT,
      ]);
    case 'ShipmentWarehouseInspectionReport':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_REPORT,
      ]);
    case 'ProductSpec':
      return hasPermissions([
        DOCUMENT_GET,
        PRODUCT_DOCUMENT_GET,
        PRODUCT_DOCUMENT_GET_TYPE_SPECIFICATION,
      ]);
    case 'ProductAnalysisCert':
      return hasPermissions([
        DOCUMENT_GET,
        PRODUCT_DOCUMENT_GET,
        PRODUCT_DOCUMENT_GET_TYPE_ANALYSIS_CERTIFICATE,
      ]);
    case 'ProductOriginCert':
      return hasPermissions([
        DOCUMENT_GET,
        PRODUCT_DOCUMENT_GET,
        PRODUCT_DOCUMENT_GET_TYPE_ORIGIN_CERTIFICATE,
      ]);

    default:
      return hasPermissions(DOCUMENT_GET);
  }
}

function filterByFile(items: Array<Entry>, hasPermissions: Function): Array<Entry> {
  return items
    .filter(
      entry =>
        (entry?.entityType === 'file' &&
          ['order', 'shipment', 'product'].includes(entry?.parentEntityType) &&
          canViewFile(hasPermissions, entry?.entity?.type)) ||
        entry?.entityType !== 'file'
    )
    .reduce((result, entry, counter, entries) => {
      const lastEntry = result[result.length - 1];
      const lastEntryIsSeparator =
        entry?.__typename === 'DateSeparator' && counter === entries.length - 1;
      const hasTwoEntriesAreSeparator =
        lastEntry?.__typename === 'DateSeparator' && entry?.__typename === 'DateSeparator';
      if (hasTwoEntriesAreSeparator || lastEntryIsSeparator) return result;

      return [...result, entry];
    }, []);
}

const Timeline = ({
  query,
  queryField,
  variables: baseVariables,
  entity,
  formatters: customFormatters,
}: Props) => {
  const ref = React.useRef(null);
  const hasPermissions = useViewerHasPermissions();
  const [isReady, setIsReady] = React.useState(false);
  const ROW_HEIGHT = 60;
  const variables = {
    ...baseVariables,
    page: 1,
    perPage: Math.ceil((window.innerHeight - 90) / ROW_HEIGHT),
  };
  /* $FlowFixMe This comment suppresses an error found when upgrading Flow to
   * v0.111.0. To view the error, delete this comment and run Flow. */
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
                {filterByItemPriceLog(
                  filterByFile(items, hasPermissions),
                  hasPermissions(ORDER_ITEMS_GET_PRICE)
                ).map((item: any) => {
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
