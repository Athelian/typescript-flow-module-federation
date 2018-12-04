// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ToggleInput } from 'components/Form';
import { uuid } from 'utils/id';
import { WrapperHeaderStyle, TitleStyle, HeaderStyle } from './style';

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
  console.log(templateColumns);
  console.log(customFields);

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
    <div className={WrapperHeaderStyle}>
      {shouldShowCustomFields({ entity, customFields, hideColumns, showAll, templateColumns }) && (
        <div>
          <h3 className={TitleStyle}>
            <FormattedMessage
              id="modules.tableTemplate.customFields"
              defaultMessage="CUSTOM FIELDS"
            />
          </h3>
          <div className={WrapperHeaderStyle}>
            {customFields.map(({ name: text }, index) => {
              const fieldName = `${entity}-customFields-${index}`;

              return (
                <>
                  {!isHiddenColumn({
                    showAll,
                    hideColumns,
                    fieldName,
                    templateColumns,
                  }) && (
                    <p key={uuid()} className={HeaderStyle}>
                      <ToggleInput
                        toggled={!hideColumns.includes(fieldName)}
                        onToggle={() => onToggle(fieldName)}
                      >
                        {text}
                      </ToggleInput>
                    </p>
                  )}
                </>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
