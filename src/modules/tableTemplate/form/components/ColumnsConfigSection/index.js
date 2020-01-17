// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';
import { SectionNavBar } from 'components/NavBar';
import { SectionHeader } from 'components/Form';
import ColumnsGroup from 'components/ColumnsGroup';
import TableTemplateFormContainer from 'modules/tableTemplate/form/container';
import MilestoneTaskColumnsConfigGroup from 'modules/project/sheet/MilestoneTaskColumnsConfigGroup';
import { parseIcon } from 'utils/entity';
import { getColumnGroupTypes, stickiedColumns } from './helpers';
import { ColumnsConfigSectionWrapperStyle, ColumnsConfigSectionBodyStyle } from './style';

const ColumnsConfigSection = () => {
  const {
    state,
    selectColumns,
    selectAllColumns,
    unselectAllColumns,
    groupAllColumns,
    reorderToDefault,
  } = TableTemplateFormContainer.useContainer();

  const parsedColumns = React.useMemo(() => {
    console.log(state);
    return stickiedColumns(state.values.type, state.values.columns);
  }, [state]);

  const groupedColumns = React.useMemo(
    () =>
      parsedColumns.reduce((grouped, col) => {
        const [icon = ''] = Array.isArray(col) ? col?.[0]?.key?.split('.') : col?.key?.split('.');
        return {
          ...grouped,
          [parseIcon(icon)]: [...(grouped[parseIcon(icon)] ?? []), col],
        };
      }, {}),
    [parsedColumns]
  );

  const getGroupProps = React.useCallback(
    (group: string) => ({
      icon: group,
      columns: groupedColumns[group] ?? [],
      onChange: selectColumns,
    }),
    [groupedColumns, selectColumns]
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

          <BaseButton
            onClick={reorderToDefault}
            icon="TABLE"
            label={
              <FormattedMessage id="modules.TableTemplates.default" defaultMessage="DEFAULT" />
            }
            textColor="GRAY_DARK"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="GRAY_LIGHT"
          />
        </SectionNavBar>

        <div className={ColumnsConfigSectionBodyStyle}>
          {getColumnGroupTypes(state.values.type).map(groupType => {
            switch (groupType) {
              case 'MILESTONE_TASKS':
                return (
                  <MilestoneTaskColumnsConfigGroup
                    {...getGroupProps('MILESTONES')}
                    key={groupType}
                  />
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
