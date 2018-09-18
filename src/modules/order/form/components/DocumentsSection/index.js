// @flow
import * as React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { Subscribe } from 'unstated';
import { DocumentsInput } from 'components/Form';
import { FormContainer } from 'modules/form';
import { OrderFilesContainer } from 'modules/order/form/containers';
import messages from 'modules/order/messages';
import { DocumentSectionStyle } from './style';

type Props = {
  intl: intlShape,
};

function DocumentsSection({ intl }: Props) {
  return (
    <div className={DocumentSectionStyle}>
      <Subscribe to={[FormContainer, OrderFilesContainer]}>
        {(
          { setFieldTouched, onValidation },
          { state: { files }, setFieldValue: changeFiles, validationRules }
        ) => (
          <DocumentsInput
            id="files"
            name="files"
            values={files}
            onChange={(field, value) => {
              changeFiles(field, value);
              setFieldTouched(field);
              onValidation({ files }, validationRules());
            }}
            types={[
              { type: 'Document', label: intl.formatMessage(messages.fileTypeDocument) },
              { type: 'OrderPO', label: intl.formatMessage(messages.fileTypeOrderPO) },
            ]}
          />
        )}
      </Subscribe>
    </div>
  );
}

export default injectIntl(DocumentsSection);
