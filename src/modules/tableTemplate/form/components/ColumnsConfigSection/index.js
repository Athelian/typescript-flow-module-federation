// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { IconButton } from 'components/Buttons';
import { SectionNavBar } from 'components/NavBar';
import { SectionHeader } from 'components/Form';
import type { ColumnConfig } from 'components/Sheet/SheetState/types';
import ColumnsGroup from 'components/Sheet/ColumnsConfig/ColumnsGroup';
import TableTemplateFormContainer from 'modules/tableTemplate/form/container';
import { getColumnGroupTypes, getColumnsConfig, parseColumns } from './helpers';
import { ColumnsConfigSectionWrapperStyle, ColumnsConfigSectionBodyStyle } from './style';

const ColumnsConfigSection = () => {
  const {
    state,
    setFieldValue,
    selectAllColumns,
    unselectAllColumns,
    groupAllColumns,
  } = TableTemplateFormContainer.useContainer();

  // COMPUTED STATES
  const parsedColumns = React.useMemo(
    () => parseColumns(getColumnsConfig(state.type, state.customFields), state.columns),
    [state.type, state.customFields, state.columns]
  );

  const groupedColumns = React.useMemo(
    () =>
      parsedColumns.reduce(
        (grouped, col) => ({
          ...grouped,
          [col.icon]: [...(grouped[col.icon] ?? []), col],
        }),
        {}
      ),
    [parsedColumns]
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
          {getColumnGroupTypes(state.type).map(groupType => (
            <ColumnsGroup {...getGroupProps(groupType)} key={groupType} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ColumnsConfigSection;
