// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { CheckboxInput } from 'components/Form';
import { uuid } from 'utils/id';
import {
  TableHeaderWrapperStyle,
  TableHeaderTitleStyle,
  TableHeaderGroupStyle,
  TableColumnHeaderStyle,
  TableColumnStyle,
} from '../TableHeader/style';

type Props = {
  entity: string,
  customFields: Array<Object>,
  onToggle: string => void,
  hideColumns: Array<string>,
  showAll: boolean,
  templateColumns: Array<string>,
};

function isHiddenColumn({
  showAll,
  hideColumns,
  fieldName,
  templateColumns,
}: {
  showAll: boolean,
  hideColumns: Array<string>,
  fieldName: string,
  templateColumns: Array<string>,
}) {
  if (templateColumns && templateColumns.length) {
    return (!showAll && hideColumns.includes(fieldName)) || !templateColumns.includes(fieldName);
  }
  return !showAll && hideColumns.includes(fieldName);
}

function shouldShowCustomFields({
  entity,
  customFields,
  showAll,
  hideColumns,
  templateColumns,
}: {
  entity: string,
  customFields: Array<Object>,
  showAll: boolean,
  hideColumns: Array<string>,
  templateColumns: Array<string>,
}) {
  return customFields.some(
    (field, index) =>
      !isHiddenColumn({
        showAll,
        hideColumns,
        fieldName: `${entity}-customFields-${index}`,
        templateColumns,
      })
  );
}

export default function TableHeader({
  entity,
  customFields,
  onToggle,
  hideColumns,
  showAll,
  templateColumns,
}: Props) {
  return (
    <div className={TableHeaderWrapperStyle}>
      {shouldShowCustomFields({ entity, customFields, hideColumns, showAll, templateColumns }) && (
        <>
          <div className={TableHeaderTitleStyle(entity)}>
            <FormattedMessage
              id="modules.tableTemplate.customFields"
              defaultMessage="CUSTOM FIELDS"
            />
          </div>
          <div className={TableHeaderGroupStyle}>
            {customFields.map(({ name: text }, index) => {
              const fieldName = `${entity}-customFields-${index}`;

              return (
                <>
                  {isHiddenColumn({
                    showAll,
                    hideColumns,
                    fieldName,
                    templateColumns,
                  }) ? null : (
                    <div key={uuid()} className={TableColumnHeaderStyle(entity)}>
                      {showAll && (
                        <CheckboxInput
                          checked={!hideColumns.includes(fieldName)}
                          onToggle={() => onToggle(fieldName)}
                        />
                      )}
                      <div className={TableColumnStyle}>{text}</div>
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
