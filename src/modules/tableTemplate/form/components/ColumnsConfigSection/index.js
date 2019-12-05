// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { IconButton } from 'components/Buttons';
import { SectionNavBar } from 'components/NavBar';
import { SectionHeader } from 'components/Form';
import type { ColumnConfig } from 'components/Sheet/SheetState/types';
import ColumnsGroup from 'components/Sheet/ColumnsConfig/ColumnsGroup';
import TableTemplateFormContainer from 'modules/tableTemplate/form/container';
import { getColumnGroupTypes } from './helpers';
import { ColumnsConfigSectionWrapperStyle, ColumnsConfigSectionBodyStyle } from './style';

const ColumnsConfigSection = () => {
  const {
    state,
    setFieldValue,
    selectAllColumns,
    unselectAllColumns,
    groupAllColumns,
  } = TableTemplateFormContainer.useContainer();
  const { columns, type } = state;

  // COMPUTED STATES
  const groupedColumns = React.useMemo(
    () =>
      columns.reduce(
        (grouped, col) => ({
          ...grouped,
          [col.icon]: [...(grouped[col.icon] ?? []), col],
        }),
        {}
      ),
    [columns]
  );

  // CALLBACKS
  const getGroupProps = React.useCallback(
    (group: string) => ({
      icon: group,
      columns: groupedColumns[group] ?? [],
      onChange: newCols =>
        setFieldValue(
          'columns',
          Object.entries(groupedColumns).flatMap(([g, cols]) =>
            g === group ? newCols : ((cols: any): Array<ColumnConfig>)
          )
        ),
    }),
    [groupedColumns, setFieldValue]
  );

  return (
    <>
      <SectionHeader
        icon="EDIT_TABLE"
        title={
          <FormattedMessage
            id="modules.TableTemplates.columnsConfigSection"
            defaultMessage="Columns Configuration"
          />
        }
      />

      <div className={ColumnsConfigSectionWrapperStyle}>
        <SectionNavBar>
          <IconButton
            onClick={selectAllColumns}
            icon="UNCHECKED"
            textColor="GRAY_DARK"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="GRAY_LIGHT"
          />

          <IconButton
            onClick={unselectAllColumns}
            icon="CHECKED"
            textColor="GRAY_DARK"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="GRAY_LIGHT"
          />

          <IconButton
            onClick={() => groupAllColumns(groupedColumns)}
            icon="BRING_FORWARD"
            textColor="GRAY_DARK"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="GRAY_LIGHT"
          />
        </SectionNavBar>

        <div className={ColumnsConfigSectionBodyStyle}>
          {getColumnGroupTypes(type).map(groupType => (
            <ColumnsGroup {...getGroupProps(groupType)} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ColumnsConfigSection;
