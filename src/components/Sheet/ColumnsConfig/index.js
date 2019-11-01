// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { difference } from 'ramda';
import Dialog from 'components/Dialog';
import { ApplyButton, ResetButton, BaseButton, SaveButton, IconButton } from 'components/Buttons';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import CornerIcon from 'components/CornerIcon';
import { Tooltip } from 'components/Tooltip';
import { colors } from 'styles/common';
import type { ColumnConfig } from '../SheetState/types';
import messages from '../messages';
import Group from './Group';
import TemplateSelector from './TemplateSelector';
import TemplateNew from './TemplateNew';
import type { ColumnState } from './types';
import {
  ButtonStyle,
  ModalWrapperStyle,
  ActionsWrapperStyle,
  ButtonsWrapperStyle,
  TemplateWrapperStyle,
  HeaderStyle,
  TemplateStyle,
  SelectTemplateStyle,
} from './style';

type Props = {
  config: Array<ColumnConfig>,
  columns: Array<ColumnConfig>,
  templateType: string,
  onChange: (Array<ColumnConfig>) => void,
};

const columnsToStates = (columns: Array<ColumnConfig>, config: Array<ColumnConfig>) =>
  config.reduce(
    (map, column) => ({
      ...map,
      [column.icon]: [
        ...(map[column.icon] ?? []),
        { column, hidden: !columns.find(c => c.key === column.key) },
      ],
    }),
    {}
  );

const statesToColumns = (states: { [string]: Array<ColumnState> }) =>
  Object.keys(states).reduce((list, key) => {
    return [...list, ...states[key].filter(state => !state.hidden).map(state => state.column)];
  }, []);

const ColumnsConfig = ({ config, columns, templateType, onChange }: Props) => {
  const [columnStates, setColumnStates] = React.useState<{ [string]: Array<ColumnState> }>({});
  const [template, setTemplate] = React.useState<?Object>(null);
  const columnStatesRef = React.useRef(columnStates);
  const [isOpen, setOpen] = React.useState(false);
  const groups = React.useMemo<Array<string>>(() => Array.from(new Set(config.map(c => c.icon))), [
    config,
  ]);
  const currentColumnKeys = React.useMemo<Array<string>>(
    () =>
      Object.values(columnStates)
        .map((state: any) => state.filter(c => !c.hidden).map(c => c.column.key))
        // $FlowFixMe flat not supported by flow
        .flat(),
    [columnStates]
  );
  const isDirty = React.useMemo(
    () =>
      difference(columns.map(c => c.key), currentColumnKeys).length > 0 ||
      difference(currentColumnKeys, columns.map(c => c.key)).length > 0,
    [columns, currentColumnKeys]
  );

  React.useEffect(() => {
    const newColumnStates = columnsToStates(columns, config);
    setColumnStates(newColumnStates);
    columnStatesRef.current = newColumnStates;
  }, [columns, config]);

  const handleTemplateChange = (newTemplate: ?Object) => {
    setTemplate(newTemplate);
    if (!newTemplate) {
      return;
    }

    const columnsFromTemplate = newTemplate.fields
      .map(field => config.find(c => c.key === field))
      .filter(c => !!c);

    setColumnStates(columnsToStates(columnsFromTemplate, config));
  };

  const handleApply = () => {
    columnStatesRef.current = columnStates;
    setOpen(false);
    onChange(statesToColumns(columnStates));
  };

  const handleSelectAll = () => {
    setColumnStates(columnsToStates(config, config));
  };

  const handleUnselectAll = () => {
    setColumnStates(columnsToStates([], config));
  };

  const handleGroup = () => {
    setColumnStates(
      Object.entries(columnStates).reduce(
        (newColumnStates, [icon, states]: [string, any]) => ({
          ...newColumnStates,
          [icon]: (states: Array<ColumnState>).sort((a, b) => {
            if (a.hidden && !b.hidden) {
              return 1;
            }

            if (!a.hidden && b.hidden) {
              return -1;
            }

            return 0;
          }),
        }),
        {}
      )
    );
  };

  const handleReset = () => {
    setColumnStates(columnStatesRef.current);
  };

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
                    textColor="TEAL"
                    hoverTextColor="WHITE"
                    backgroundColor="GRAY_SUPER_LIGHT"
                    hoverBackgroundColor="TEAL"
                  />
                </Tooltip>
              </div>
              <div className={ButtonsWrapperStyle}>
                <ResetButton onClick={handleReset} disabled={!isDirty} />
                <ApplyButton onClick={handleApply} />
              </div>
            </div>

            <div className={TemplateWrapperStyle}>
              <Label>
                <FormattedMessage {...messages.columnsConfigSelectTemplate} />
              </Label>
              <TemplateSelector onChange={handleTemplateChange} templateType={templateType}>
                {({ onClick }) =>
                  template ? (
                    <button type="button" onClick={onClick} className={TemplateStyle}>
                      {template.name}
                      <div>
                        <CornerIcon icon="TEMPLATE" color={colors.TEMPLATE} />
                      </div>
                    </button>
                  ) : (
                    <button type="button" onClick={onClick} className={SelectTemplateStyle}>
                      <Icon icon="ADD" />
                    </button>
                  )
                }
              </TemplateSelector>

              <TemplateNew
                columns={currentColumnKeys}
                templateType={templateType}
                onSave={handleTemplateChange}
              >
                {({ onClick }) => <SaveButton label="Save as" onClick={onClick} />}
              </TemplateNew>
            </div>
          </div>

          {groups.map(group => {
            return (
              <Group
                key={group}
                icon={group}
                columns={columnStates[group] || []}
                onChange={c =>
                  setColumnStates({
                    ...columnStates,
                    [group]: c,
                  })
                }
              />
            );
          })}
        </div>
      </Dialog>
    </>
  );
};

export default ColumnsConfig;
