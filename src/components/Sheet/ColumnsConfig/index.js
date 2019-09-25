// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { cloneDeep } from 'lodash';
import Dialog from 'components/Dialog';
import { SaveButton, ResetButton, BaseButton } from 'components/Buttons';
import type { ColumnConfig } from '../SheetColumns';
import messages from '../messages';
import Group from './Group';
import { ButtonStyle, ModalWrapperStyle, ActionsWrapperStyle, ButtonsWrapperStyle } from './style';
import type { ColumnState } from './types';

type Props = {
  columns: Array<ColumnConfig>,
  onChange: (Array<ColumnConfig>) => void,
};

const ColumnsConfig = ({ columns, onChange }: Props) => {
  const [columnStates, setColumnStates] = React.useState<{ [string]: Array<ColumnState> }>({});
  const columnStatesRef = React.useRef(columnStates);
  const [isOpen, setOpen] = React.useState(false);

  React.useEffect(() => {
    const newColumnStates = columns.reduce(
      (map, column) => ({
        ...map,
        [column.icon]: [...(map[column.icon] ?? []), { column, hidden: false }],
      }),
      {}
    );

    setColumnStates(
      columns.reduce(
        (map, column) => ({
          ...map,
          [column.icon]: [...(map[column.icon] ?? []), { column, hidden: false }],
        }),
        {}
      )
    );

    columnStatesRef.current = newColumnStates;
  }, [columns]);

  const handleSave = () => {
    columnStatesRef.current = columnStates;
    setOpen(false);
    onChange(
      Object.keys(columnStates).reduce((list, key) => {
        return [
          ...list,
          ...columnStates[key].filter(state => !state.hidden).map(state => state.column),
        ];
      }, [])
    );
  };

  const handleDefault = () => {
    const defaultColumns = {};

    Object.keys(columnStates).forEach(icon => {
      defaultColumns[icon] = columns
        .filter(column => column.icon === icon)
        .map(column => ({ column, hidden: false }));
    });

    setColumnStates({
      ...columnStates,
      ...defaultColumns,
    });
  };

  const handleGroup = () => {
    const groupedColumns = cloneDeep(columnStates);

    Object.keys(columnStates).forEach(icon => {
      groupedColumns[icon].sort((a, b) => {
        if (a.hidden && !b.hidden) {
          return 1;
        }

        if (!a.hidden && b.hidden) {
          return -1;
        }

        return 0;
      });
    });

    setColumnStates({
      ...columnStates,
      ...groupedColumns,
    });
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
          <div className={ActionsWrapperStyle}>
            <div className={ButtonsWrapperStyle}>
              <BaseButton
                onClick={handleDefault}
                label={<FormattedMessage {...messages.columnsConfigDefaultButton} />}
                icon="UNDO"
                textColor="GRAY_DARK"
                hoverTextColor="WHITE"
                backgroundColor="GRAY_SUPER_LIGHT"
                hoverBackgroundColor="GRAY_LIGHT"
              />
              <BaseButton
                onClick={handleGroup}
                label={<FormattedMessage {...messages.columnsConfigGroupButton} />}
                icon="BRING_FORWARD"
                textColor="TEAL"
                hoverTextColor="WHITE"
                backgroundColor="GRAY_SUPER_LIGHT"
                hoverBackgroundColor="TEAL"
              />
            </div>
            <div className={ButtonsWrapperStyle}>
              <ResetButton onClick={handleReset} />
              <SaveButton onClick={handleSave} />
            </div>
          </div>

          {Object.keys(columnStates).map(icon => {
            return (
              <Group
                key={icon}
                icon={icon}
                columns={columnStates[icon]}
                onChange={c =>
                  setColumnStates({
                    ...columnStates,
                    [icon]: c,
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
