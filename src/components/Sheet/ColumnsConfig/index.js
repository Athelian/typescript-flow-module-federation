// @flow
import * as React from 'react';
import type { MaskEdit, MaskEditColumn } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import useLocalStorage from 'hooks/useLocalStorage';
import CornerIcon from 'components/CornerIcon';
import { colors } from 'styles/common';
import Dialog from 'components/Dialog';
import { ApplyButton, ResetButton, BaseButton, SaveButton, IconButton } from 'components/Buttons';
import { Tooltip } from 'components/Tooltip';
import type { Column } from 'components/DraggableColumn';
import { parseIcon } from 'utils/entity';
import { convertMappingColumns, flattenColumns } from 'utils/template';
import type { ColumnConfig } from '../SheetState/types';
import messages from '../messages';
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
  TemplateStyle,
} from './style';

type Props = {
  columns: Array<ColumnConfig>,
  templateType: string,
  onChange: (Array<ColumnConfig>) => void,
  onLoadTemplate?: (template: Object) => Array<ColumnConfig>,
  onApply?: (columns: Array<Column | Array<Column>>) => Array<ColumnConfig>,
  children: ({
    getGroupProps: (
      group: string
    ) => {
      icon: string,
      columns: Array<Column | Array<Column>>,
      onChange: (Array<Column | Array<Column>>) => void,
    },
  }) => React.Node,
};

const ColumnsConfig = ({
  columns,
  templateType,
  onChange,
  onLoadTemplate,
  onApply,
  children,
}: Props) => {
  const [isOpen, setOpen] = React.useState(false);
  const [persistTemplate, setPersistTemplate] = useLocalStorage(
    `${templateType}SelectedTemplate`,
    null
  );
  const [dirtyColumns, setDirtyColumns] = React.useState<Array<Column | Array<Column>>>([]);
  const currentTemplate = React.useRef(persistTemplate);

  React.useEffect(() => {
    setDirtyColumns(convertMappingColumns(columns));
  }, [columns]);

  const isDirty = React.useMemo(() => {
    const currentColumns = flattenColumns(dirtyColumns);
    return (
      !columns.every(
        (col, idx) =>
          col.key === currentColumns[idx]?.key && !!col.hidden === !!currentColumns[idx]?.hidden
      ) || currentColumns.length !== columns.length
    );
  }, [columns, dirtyColumns]);

  const groupedColumns = React.useMemo(
    () =>
      dirtyColumns.reduce((grouped, col) => {
        const [icon = ''] = Array.isArray(col) ? col?.[0]?.key?.split('.') : col?.key?.split('.');
        return {
          ...grouped,
          [parseIcon(icon)]: [...(grouped[parseIcon(icon)] ?? []), col],
        };
      }, {}),
    [dirtyColumns]
  );

  const handleApply = () => {
    setPersistTemplate(currentTemplate.current);
    if (onApply) {
      onChange(onApply(dirtyColumns));
    } else {
      const selectedColumns = flattenColumns(dirtyColumns);
      const applyColumns: Array<ColumnConfig> = [];
      selectedColumns.forEach(col => {
        const existColumn = columns.find(({ key }) => key === col.key);
        if (existColumn) {
          applyColumns.push({
            ...existColumn,
            hidden: col.hidden,
          });
        }
      });
      onChange(applyColumns);
    }
    setOpen(false);
  };

  const handleReset = () => {
    setDirtyColumns(convertMappingColumns(columns));
    currentTemplate.current = persistTemplate;
  };

  const handleSelectAll = () => {
    currentTemplate.current = null;
    setDirtyColumns(
      dirtyColumns.map(col =>
        Array.isArray(col)
          ? [
              ...col.map(currentCol => ({
                ...currentCol,
                hidden: false,
              })),
            ]
          : {
              ...col,
              hidden: false,
            }
      )
    );
  };

  const handleUnselectAll = () => {
    currentTemplate.current = null;
    setDirtyColumns(
      dirtyColumns.map(col =>
        Array.isArray(col)
          ? [
              ...col.map(currentCol => ({
                ...currentCol,
                hidden: true,
              })),
            ]
          : {
              ...col,
              hidden: true,
            }
      )
    );
  };
  const handleGroup = () => {
    currentTemplate.current = null;
    setDirtyColumns(
      convertMappingColumns(
        Object.values(groupedColumns).flatMap((cols: any) => {
          const selectedColumns = [];
          const hiddenColumns = [];
          (cols: Array<MaskEditColumn | Array<MaskEditColumn>>).forEach(column => {
            if (Array.isArray(column)) {
              if (column.some(({ hidden }) => !hidden)) {
                selectedColumns.push(...column);
              } else {
                hiddenColumns.push(...column);
              }
            } else if (column.hidden) {
              hiddenColumns.push(column);
            } else {
              selectedColumns.push(column);
            }
          });
          return [...selectedColumns, ...hiddenColumns];
        })
      )
    );
  };

  const handleTemplateChange = (template: MaskEdit) => {
    if (template) {
      currentTemplate.current = template;
      if (onLoadTemplate) {
        setDirtyColumns(convertMappingColumns(onLoadTemplate(template)));
      } else {
        const currentColumns = flattenColumns(dirtyColumns);
        const templateColumns = currentColumns.map(col => ({
          ...col,
          hidden: false,
          ...(template?.columns ?? []).find(({ key }) => key === col.key),
        }));

        setDirtyColumns(convertMappingColumns(templateColumns));
      }
    }
  };

  const getGroupProps = React.useCallback(
    (group: string) => ({
      icon: group,
      columns: groupedColumns[group] ?? [],
      onChange: newCols => {
        currentTemplate.current = null;
        setDirtyColumns(
          Object.entries(groupedColumns).flatMap(([g, cols]) =>
            g === group ? newCols : ((cols: any): Array<Column>)
          )
        );
      },
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
        suffix={persistTemplate?.name}
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
                <TemplateSelector
                  selectedItem={currentTemplate.current}
                  onChange={handleTemplateChange}
                  templateType={templateType}
                >
                  {({ onClick }) =>
                    !currentTemplate.current ? (
                      <BaseButton
                        onClick={onClick}
                        label={<FormattedMessage {...messages.columnsConfigUseTemplate} />}
                        icon="TEMPLATE"
                        backgroundColor="BLUE"
                        hoverBackgroundColor="BLUE_DARK"
                      />
                    ) : (
                      <button type="button" onClick={onClick} className={TemplateStyle}>
                        {currentTemplate.current.name}
                        <div>
                          <CornerIcon icon="TEMPLATE" color={colors.TEMPLATE} />
                        </div>
                      </button>
                    )
                  }
                </TemplateSelector>
              </div>

              <TemplateNew
                columns={dirtyColumns.flatMap(cols => (Array.isArray(cols) ? [...cols] : cols))}
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

export default ColumnsConfig;
