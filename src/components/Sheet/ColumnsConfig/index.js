// @flow
import * as React from 'react';
import Dialog from 'components/Dialog';
import { SaveButton, ResetButton, BaseButton } from 'components/Buttons';
import type { ColumnConfig } from '../SheetColumns';
import Group from './Group';
import { ButtonStyle, ModalWrapperStyle, GroupsWrapperStyle, ActionsWrapperStyle } from './style';
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

  const handleGroupReset = (icon: string) => {
    setColumnStates({
      ...columnStates,
      [icon]: columns
        .filter(column => column.icon === icon)
        .map(column => ({ column, hidden: false })),
    });
  };

  const handleReset = () => {
    setColumnStates(columnStatesRef.current);
  };

  return (
    <>
      <BaseButton
        className={ButtonStyle}
        label="COLUMNS"
        icon="SETTINGS"
        textColor="GRAY_DARK"
        hoverTextColor="WHITE"
        backgroundColor="GRAY_SUPER_LIGHT"
        hoverBackgroundColor="GRAY_DARK"
        onClick={() => setOpen(true)}
      />

      <Dialog isOpen={isOpen} onRequestClose={() => setOpen(false)}>
        <div className={ModalWrapperStyle}>
          <div className={GroupsWrapperStyle}>
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
                  onReset={() => handleGroupReset(icon)}
                />
              );
            })}
          </div>

          <div>
            <div className={ActionsWrapperStyle}>
              <SaveButton onClick={handleSave} />
              <ResetButton onClick={handleReset} />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ColumnsConfig;
