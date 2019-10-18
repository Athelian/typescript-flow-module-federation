// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { computeIcon, getFileExtension } from 'components/Form/DocumentsInput/helpers';
import DisplayWrapper from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/DisplayWrapper';
import type { FilePayload } from 'generated/graphql';
import DocumentsInputDialog from './DocumentsInputDialog';
import { DocumentsInputWrapperStyle, DocumentCountWrapperStyle, DocumentIconStyle } from './style';

type Props = {
  value: Array<FilePayload>,
  focus: boolean,
  readonly: boolean,
  onChange: (Array<FilePayload>) => void,
  onFocus: () => void,
  onBlur: () => void,
};

const DocumentsInput = ({ value = [], focus, readonly, onChange, onBlur, onFocus }: Props) => {
  return (
    <>
      <button
        tabIndex="-1"
        onClick={() => {
          if (!readonly) {
            onFocus();
          }
        }}
        type="button"
        className={DocumentsInputWrapperStyle}
      >
        <div className={DocumentIconStyle('DOCUMENT')}>
          <Icon icon="DOCUMENT" />
        </div>

        <div className={DocumentCountWrapperStyle}>
          <DisplayWrapper>
            <span>
              {value.length === 1 ? (
                <FormattedMessage
                  id="modules.sheet.doc"
                  defaultMessage="{numOfDocuments} Doc"
                  values={{ numOfDocuments: <FormattedNumber value={value.length} /> }}
                />
              ) : (
                <FormattedMessage
                  id="modules.sheet.docs"
                  defaultMessage="{numOfDocuments} Docs"
                  values={{ numOfDocuments: <FormattedNumber value={value.length} /> }}
                />
              )}
            </span>
          </DisplayWrapper>
        </div>

        {value.map((document, index) => {
          const { icon, color } = computeIcon(getFileExtension(document?.name ?? ''));
          return (
            <div className={DocumentIconStyle(color)} key={`${document?.name}-${index + 0}`}>
              <Icon icon={icon} />
            </div>
          );
        })}
      </button>

      <DocumentsInputDialog value={value} onChange={onChange} onBlur={onBlur} focus={focus} />
    </>
  );
};

export default {
  Order: DocumentsInput('Order'),
  OrderItem: DocumentsInput('OrderItem'),
  Shipment: DocumentsInput('Shipment'),
};
