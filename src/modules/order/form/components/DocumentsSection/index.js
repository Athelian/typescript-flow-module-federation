// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { getByPathWithDefault } from 'utils/fp';
import { OrderFilesContainer } from 'modules/order/form/containers';
import messages from 'modules/order/messages';
import QueryPlaceHolder from 'components/PlaceHolder/QueryPlaceHolder';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import { ORDER_UPDATE, ORDER_DOWNLOAD_DOCUMENTS } from 'modules/permission/constants/order';
import { DocumentsInput, SectionHeader } from 'components/Form';
import usePermission from 'hooks/usePermission';
import { orderFormFilesQuery } from './query';

type Props = {
  intl: IntlShape,
  isLoading: boolean,
  entityId: string,
};

function DocumentsSection({ intl, isLoading, entityId }: Props) {
  const { hasPermission } = usePermission();
  const allowUpdate = hasPermission(ORDER_UPDATE);
  const allowDownload = hasPermission(ORDER_DOWNLOAD_DOCUMENTS);

  return (
    <Subscribe to={[OrderFilesContainer]}>
      {({ state: { files }, initDetailValues, setFieldValue: changeFiles }) => (
        <QueryPlaceHolder
          PlaceHolder={ListCardPlaceHolder}
          query={orderFormFilesQuery}
          entityId={entityId}
          isLoading={isLoading}
          onCompleted={result => {
            initDetailValues(getByPathWithDefault([], 'order.files', result));
          }}
        >
          {() => {
            return (
              <>
                <SectionHeader
                  icon="DOCUMENT"
                  title={
                    <>
                      <FormattedMessage id="modules.Orders.documents" defaultMessage="DOCUMENTS" />{' '}
                      ({files.length})
                    </>
                  }
                />
                <DocumentsInput
                  editable={allowUpdate}
                  downloadable={allowDownload}
                  id="files"
                  name="files"
                  values={files}
                  onChange={(field, value) => {
                    changeFiles(field, value);
                  }}
                  types={[
                    { value: 'OrderPo', label: intl.formatMessage(messages.fileTypeOrderPO) },
                    { value: 'OrderPi', label: intl.formatMessage(messages.fileTypeOrderPI) },
                    { value: 'Document', label: intl.formatMessage(messages.fileTypeDocument) },
                  ]}
                />
              </>
            );
          }}
        </QueryPlaceHolder>
      )}
    </Subscribe>
  );
}

export default injectIntl(DocumentsSection);
