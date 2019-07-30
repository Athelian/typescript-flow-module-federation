// @flow
import * as React from 'react';
import type { FilePayload } from 'generated/graphql';
import { intersection } from 'lodash';
import { FormattedMessage } from 'react-intl';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import GridView from 'components/GridView';
import DocumentCard from 'components/Cards/DocumentCard';
import { BATCH_FORM } from 'modules/permission/constants/batch';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { ORDER_ITEMS_FORM } from 'modules/permission/constants/orderItem';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import { SHIPMENT_FORM } from 'modules/permission/constants/shipment';
import { getParentInfo } from 'utils/task';
import { getByPathWithDefault } from 'utils/fp';

type Props = {
  files: Array<FilePayload>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: FilePayload) => React$Node,
};

const defaultRenderItem = (file: FilePayload): React$Node => (
  <PartnerPermissionsWrapper key={getByPathWithDefault('', 'id', file)} data={file}>
    {permissions => {
      const { parentType } = getParentInfo(getByPathWithDefault({}, 'entity', file));

      const hasPermission = React.useCallback(
        (checkPermission: string | Array<string>) => {
          if (Array.isArray(checkPermission)) {
            return intersection(permissions, checkPermission).length > 0;
          }
          return permissions.includes(checkPermission);
        },
        [permissions]
      );

      const viewPermissions = {
        order: hasPermission(ORDER_FORM),
        orderItem: hasPermission(ORDER_ITEMS_FORM),
        batch: hasPermission(BATCH_FORM),
        shipment: hasPermission(SHIPMENT_FORM),
        product: hasPermission(PRODUCT_FORM),
      };

      return (
        <DocumentCard
          file={file}
          navigable={viewPermissions[parentType]}
          editable={{
            status: false,
            type: false,
            memo: false,
          }}
        />
      );
    }}
  </PartnerPermissionsWrapper>
);

const DocumentGridView = ({
  files,
  onLoadMore,
  hasMore,
  isLoading,
  renderItem = defaultRenderItem,
}: Props): React$Node => {
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={files.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.Documents.noDocumentFound" defaultMessage="No files found" />
      }
    >
      {files.map(renderItem)}
    </GridView>
  );
};

export default DocumentGridView;
