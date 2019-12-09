// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';
import { SectionNavBar } from 'components/NavBar';
import { SectionHeader } from 'components/Form';
import ColumnsGroup from 'components/Sheet/ColumnsConfig/ColumnsGroup';
import TableTemplateFormContainer from 'modules/tableTemplate/form/container';
import MilestoneTaskColumnsConfigGroup from 'modules/project/sheet/MilestoneTaskColumnsConfigGroup';
import { getColumnGroupTypes, computeColumnConfigs } from './helpers';
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
  const parsedColumns = React.useMemo(() => computeColumnConfigs(state), [state]);

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
      onChange: newCols => {
        setFieldValue(
          'columns',
          Object.entries(groupedColumns).flatMap(([g, cols]) =>
            g === group
              ? newCols.map(newCol => ({ key: newCol.key, hidden: newCol.hidden }))
              : (cols: any).map(col => ({ key: col.key, hidden: col.hidden }))
          )
        );
      },
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
          <BaseButton
            onClick={unselectAllColumns}
            icon="UNCHECKED"
            label={
              <FormattedMessage
                id="modules.TableTemplates.unselectAll"
                defaultMessage="UNSELECT ALL"
              />
            }
            textColor="GRAY_DARK"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="GRAY_LIGHT"
          />

          <BaseButton
            onClick={selectAllColumns}
            icon="CHECKED"
            label={
              <FormattedMessage id="modules.TableTemplates.selectAll" defaultMessage="SELECT ALL" />
            }
            textColor="GRAY_DARK"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="GRAY_LIGHT"
          />

          <BaseButton
            onClick={() => groupAllColumns(groupedColumns)}
            icon="BRING_FORWARD"
            label={<FormattedMessage id="modules.TableTemplates.group" defaultMessage="GROUP" />}
            textColor="GRAY_DARK"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="GRAY_LIGHT"
          />
        </SectionNavBar>

        <div className={ColumnsConfigSectionBodyStyle}>
          {getColumnGroupTypes(state.type).map(groupType => {
            switch (groupType) {
              case 'MILESTONE_TASK':
                return (
                  <MilestoneTaskColumnsConfigGroup {...getGroupProps(groupType)} key={groupType} />
                );
              default:
                return <ColumnsGroup {...getGroupProps(groupType)} key={groupType} />;
            }
          })}
        </div>
      </div>
    </>
  );
};

export default ColumnsConfigSection;
