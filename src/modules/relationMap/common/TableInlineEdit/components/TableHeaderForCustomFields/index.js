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
  showAll: boolean,
  templateColumns: Array<string>,
};

function isHiddenColumn({
  showAll,
  fieldName,
  templateColumns,
}: {
  showAll: boolean,
  fieldName: string,
  templateColumns: Array<string>,
}) {
  return !showAll && !templateColumns.includes(fieldName);
}

function shouldShowCustomFields({
  entity,
  customFields,
  showAll,
  templateColumns,
}: {
  entity: string,
  customFields: Array<Object>,
  showAll: boolean,
  templateColumns: Array<string>,
}) {
  return customFields.some(
    (field, index) =>
      !isHiddenColumn({
        showAll,
        fieldName: `${entity}-customFields-${index}`,
        templateColumns,
      })
  );
}

export default function TableHeader({
  entity,
  customFields,
  onToggle,
  showAll,
  templateColumns,
}: Props) {
  return (
    <div className={TableHeaderWrapperStyle}>
      {shouldShowCustomFields({ entity, customFields, showAll, templateColumns }) && (
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
                <React.Fragment key={fieldName}>
                  {isHiddenColumn({
                    showAll,
                    fieldName,
                    templateColumns,
                  }) ? null : (
                    <div key={uuid()} className={TableColumnHeaderStyle(entity)}>
                      {showAll && (
                        <CheckboxInput
                          checked={
                            templateColumns.length === 0
                              ? true
                              : templateColumns.includes(fieldName)
                          }
                          onToggle={() => onToggle(fieldName)}
                        />
                      )}
                      <div className={TableColumnStyle}>{text}</div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
