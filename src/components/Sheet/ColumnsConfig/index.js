// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Dialog from 'components/Dialog';
import { ApplyButton, ResetButton, BaseButton, SaveButton, IconButton } from 'components/Buttons';
import { Tooltip } from 'components/Tooltip';
import type { ColumnConfig } from '../SheetState/types';
import { getColumnsConfigured } from '../useColumns';
import messages from '../messages';
import ColumnsGroup from './ColumnsGroup';
import TemplateSelector from './TemplateSelector';
import TemplateNew from './TemplateNew';
import {
  ButtonStyle,
  ModalWrapperStyle,
  ActionsWrapperStyle,
  ButtonsWrapperStyle,
  TemplateWrapperStyle,
  TemplateSelectWrapperStyle,
  HeaderStyle,
} from './style';

type Props = {
  columns: Array<ColumnConfig>,
  templateType: string,
  onChange: (Array<ColumnConfig>) => void,
  onLoadTemplate?: (template: Object) => Array<ColumnConfig>,
  children: ({
    getGroupProps: (
      group: string
    ) => {
      icon: string,
      columns: Array<ColumnConfig>,
      onChange: (Array<ColumnConfig>) => void,
    },
  }) => React.Node,
};

const ColumnsConfig = ({ columns, templateType, onChange, onLoadTemplate, children }: Props) => {
  // STATES
  const [isOpen, setOpen] = React.useState(false);
  const [dirtyColumns, setDirtyColumns] = React.useState(columns);

  // EFFECTS
  React.useEffect(() => {
    setDirtyColumns(columns);
  }, [columns]);

  // COMPUTED STATES
  const isDirty = React.useMemo(
    () =>
      !columns.every(
        (col, idx) =>
          col.key === dirtyColumns[idx]?.key && !!col.hidden === !!dirtyColumns[idx]?.hidden
      ) || dirtyColumns.length !== columns.length,
    [columns, dirtyColumns]
  );
  const groupedColumns = React.useMemo(
    () =>
      dirtyColumns.reduce(
        (grouped, col) => ({
          ...grouped,
          [col.icon]: [...(grouped[col.icon] ?? []), col],
        }),
        {}
      ),
    [dirtyColumns]
  );

  // ACTIONS
  const handleApply = () => {
    onChange(dirtyColumns);
    setOpen(false);
  };
  const handleReset = () => setDirtyColumns(columns);
  const handleSelectAll = () =>
    setDirtyColumns(dirtyColumns.map(col => ({ ...col, hidden: false })));
  const handleUnselectAll = () =>
    setDirtyColumns(dirtyColumns.map(col => ({ ...col, hidden: true })));
  const handleGroup = () =>
    setDirtyColumns(
      Object.values(groupedColumns).flatMap(cols =>
        ((cols: any): Array<ColumnConfig>).sort((a, b) => {
          if (a.hidden && !b.hidden) {
            return 1;
          }

          if (!a.hidden && b.hidden) {
            return -1;
          }

          return 0;
        })
      )
    );
  const handleTemplateChange = template => {
    if (template) {
      if (onLoadTemplate) {
        setDirtyColumns(onLoadTemplate(template));
      } else {
        setDirtyColumns(
          getColumnsConfigured(
            columns,
            (template?.columns ?? []).reduce(
              (cache, col) => ({ ...cache, [col.key]: col.hidden }),
              {}
            )
          )
        );
      }
    }
  };

  // CALLBACKS
  const getGroupProps = React.useCallback(
    (group: string) => ({
      icon: group,
      columns: groupedColumns[group] ?? [],
      onChange: newCols =>
        setDirtyColumns(
          Object.entries(groupedColumns).flatMap(([g, cols]) =>
            g === group ? newCols : ((cols: any): Array<ColumnConfig>)
          )
        ),
    }),
    [groupedColumns]
  );

  return (
    <>
      <BaseButton
        className={ButtonStyle}
        label={<FormattedMessage {...messages.columnsConfigButton} />}
        icon="SETTINGS"
        textColor="GRAY_DARK"
        hoverTextColor="WHITE"
        backgroundColor="GRAY_SUPER_LIGHT"
        hoverBackgroundColor="GRAY_DARK"
        onClick={() => setOpen(true)}
      />

      <Dialog isOpen={isOpen} onRequestClose={() => setOpen(false)}>
        <div className={ModalWrapperStyle}>
          <div className={HeaderStyle}>
            <div className={ActionsWrapperStyle}>
              <div className={ButtonsWrapperStyle}>
                <Tooltip
                  message={<FormattedMessage {...messages.columnsConfigUnselectAllButton} />}
                >
                  <IconButton
                    onClick={handleUnselectAll}
                    icon="UNCHECKED"
                    textColor="GRAY_DARK"
                    hoverTextColor="WHITE"
                    backgroundColor="GRAY_SUPER_LIGHT"
                    hoverBackgroundColor="GRAY_LIGHT"
                  />
                </Tooltip>
                <Tooltip message={<FormattedMessage {...messages.columnsConfigSelectAllButton} />}>
                  <IconButton
                    onClick={handleSelectAll}
                    icon="CHECKED"
                    textColor="GRAY_DARK"
                    hoverTextColor="WHITE"
                    backgroundColor="GRAY_SUPER_LIGHT"
                    hoverBackgroundColor="GRAY_LIGHT"
                  />
                </Tooltip>
                <Tooltip message={<FormattedMessage {...messages.columnsConfigGroupButton} />}>
                  <IconButton
                    onClick={handleGroup}
                    icon="BRING_FORWARD"
                    textColor="GRAY_DARK"
                    hoverTextColor="WHITE"
                    backgroundColor="GRAY_SUPER_LIGHT"
                    hoverBackgroundColor="GRAY_LIGHT"
                  />
                </Tooltip>
              </div>
              <div className={ButtonsWrapperStyle}>
                <ResetButton onClick={handleReset} disabled={!isDirty} />
                <ApplyButton onClick={handleApply} />
              </div>
            </div>

            <div className={TemplateWrapperStyle}>
              <div className={TemplateSelectWrapperStyle}>
                <TemplateSelector onChange={handleTemplateChange} templateType={templateType}>
                  {({ onClick }) => (
                    <BaseButton
                      onClick={onClick}
                      label={<FormattedMessage {...messages.columnsConfigUseTemplate} />}
                      icon="TEMPLATE"
                      backgroundColor="BLUE"
                      hoverBackgroundColor="BLUE_DARK"
                    />
                  )}
                </TemplateSelector>
              </div>

              <TemplateNew
                columns={dirtyColumns}
                templateType={templateType}
                onSave={handleTemplateChange}
              >
                {({ onClick }) => (
                  <SaveButton
                    label={<FormattedMessage {...messages.columnsConfigSaveAsNew} />}
                    onClick={onClick}
                  />
                )}
              </TemplateNew>
            </div>
          </div>

          {children({ getGroupProps })}
        </div>
      </Dialog>
    </>
  );
};

ColumnsConfig.Group = ColumnsGroup;

export default ColumnsConfig;
