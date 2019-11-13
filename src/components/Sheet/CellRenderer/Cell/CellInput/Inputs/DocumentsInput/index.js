// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { computeIcon, getFileExtension } from 'components/Form/DocumentsInput/helpers';
import DisplayWrapper from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/DisplayWrapper';
import type { FilePayload } from 'generated/graphql';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import DocumentsInputDialog from './DocumentsInputDialog';
import { DocumentsInputWrapperStyle, DocumentCountWrapperStyle, DocumentIconStyle } from './style';

const DocumentsInput = (entityType: string) => ({
  value,
  focus,
  readonly,
  onChange,
  forceFocus,
  forceBlur,
}: InputProps<Array<FilePayload>>) => {
  const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
    if (focus) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div onBlur={handleBlur}>
      <button
        disabled={readonly}
        onClick={forceFocus}
        type="button"
        className={DocumentsInputWrapperStyle}
      >
        <div className={DocumentIconStyle('DOCUMENT')}>
          <Icon icon="DOCUMENT" />
        </div>

        <div className={DocumentCountWrapperStyle}>
          <DisplayWrapper>
            <span>
              {(value || []).length === 1 ? (
                <FormattedMessage
                  id="modules.sheet.doc"
                  defaultMessage="{numOfDocuments} Doc"
                  values={{ numOfDocuments: <FormattedNumber value={(value || []).length} /> }}
                />
              ) : (
                <FormattedMessage
                  id="modules.sheet.docs"
                  defaultMessage="{numOfDocuments} Docs"
                  values={{ numOfDocuments: <FormattedNumber value={(value || []).length} /> }}
                />
              )}
            </span>
          </DisplayWrapper>
        </div>

        {(value || []).map((document, index) => {
          const { icon, color } = computeIcon(getFileExtension(document?.name ?? ''));
          return (
            <div className={DocumentIconStyle(color)} key={`${document?.name}-${index + 0}`}>
              <Icon icon={icon} />
            </div>
          );
        })}
      </button>

      <DocumentsInputDialog
        value={value || []}
        onChange={newValue => onChange(newValue, true)}
        onClose={forceBlur}
        open={focus}
        entityType={entityType}
      />
    </div>
  );
};

export default {
  Order: DocumentsInput('Order'),
  OrderItem: DocumentsInput('OrderItem'),
  Shipment: DocumentsInput('Shipment'),
  Milestone: DocumentsInput('Milestone'),
};
