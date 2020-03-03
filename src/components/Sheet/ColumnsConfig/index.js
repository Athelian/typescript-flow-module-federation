// @flow
import * as React from 'react';
import type { MaskEdit, MaskEditColumn } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { groupBy } from 'lodash';
import useLocalStorage from 'hooks/useLocalStorage';
import BaseCard from 'components/Cards';
import Dialog from 'components/Dialog';
import { ApplyButton, ResetButton, BaseButton, SaveButton, IconButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import { Tooltip } from 'components/Tooltip';
import { parseIcon } from 'utils/entity';
import { convertMappingColumns, flattenColumns } from 'utils/template';
import type { ColumnConfig } from '../SheetState/types';
import { getColumnsConfigured } from '../useColumns';
import messages from '../messages';
import TemplateSelector from './TemplateSelector';
import TemplateNew from './TemplateNew';
import {
  ModalWrapperStyle,
  ActionsWrapperStyle,
  ButtonsWrapperStyle,
  TemplateWrapperStyle,
  TemplateSelectWrapperStyle,
  HeaderStyle,
  TemplateStyle,
  ColumnsConfigButtonStyle,
  ColumnsConfigButtonIconStyle,
  ColumnsConfigButtonTemplateStyle,
} from './style';

type Props = {
  defaultColumns: Array<ColumnConfig>,
  columns: Array<ColumnConfig>,
  templateType: string,
  onChange: (Array<ColumnConfig>) => void,
  onLoadTemplate?: (template: Object) => Array<ColumnConfig>,
  onApply?: (columns: Array<ColumnConfig | Array<ColumnConfig>>) => Array<ColumnConfig>,
  children: ({
    getGroupProps: (
      group: string
    ) => {
      icon: string,
      columns: Array<ColumnConfig | Array<ColumnConfig>>,
      onChange: (Array<ColumnConfig | Array<ColumnConfig>>) => void,
    },
  }) => React.Node,
};

const ColumnsConfig = ({
  defaultColumns,
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
  const [dirtyColumns, setDirtyColumns] = React.useState<Array<ColumnConfig | Array<ColumnConfig>>>(
    []
  );
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
        const existColumn = defaultColumns.find(({ key }) => key === col.key);
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
      const defaultColumnsByGroup = groupBy(defaultColumns, column => column.key.split('.')[0]);
      const newColumnsByGroup = groupBy(template.columns, column => column.key.split('.')[0]);

      const parsedTemplate = {
        ...template,
        columns: Object.keys(defaultColumnsByGroup).reduce(
          (newColumns, groupName) => newColumns.concat(newColumnsByGroup[groupName]),
          []
        ),
      };
      currentTemplate.current = parsedTemplate;

      if (onLoadTemplate) {
        setDirtyColumns(convertMappingColumns(onLoadTemplate(parsedTemplate)));
      } else {
        const templateColumns = getColumnsConfigured(
          defaultColumns,
          parsedTemplate.columns.reduce(
            (config, col) => ({
              ...config,
              [col.key]: col.hidden,
            }),
            {}
          )
        ).map(col => ({ ...col, isNew: false }));

        setDirtyColumns(convertMappingColumns(templateColumns));
      }
    }
  };

  const handleDefault = () => {
    currentTemplate.current = null;
    const currentColumns = flattenColumns(dirtyColumns);
    setDirtyColumns(
      convertMappingColumns(
        defaultColumns.map(defaultColumn => {
          const column = currentColumns.find(col => col.key === defaultColumn.key);

          return {
            ...defaultColumn,
            isNew: column?.isNew ?? false,
            hidden: column?.hidden ?? false,
          };
        })
      )
    );
  };

  const handleClose = () => {
    setOpen(false);
    handleReset();
  };

  const getGroupProps = React.useCallback(
    (group: string) => ({
      icon: group,
      columns: groupedColumns[group] ?? [],
      onChange: newCols => {
        currentTemplate.current = null;
        setDirtyColumns(
          Object.entries(groupedColumns).flatMap(([g, cols]) =>
            g === group ? newCols : ((cols: any): Array<ColumnConfig>)
          )
        );
      },
    }),
    [groupedColumns]
  );

  return (
    <>
      <button className={ColumnsConfigButtonStyle} onClick={() => setOpen(true)} type="button">
        <FormattedMessage {...messages.columnsConfigButton} />
        <div className={ColumnsConfigButtonIconStyle}>
          <Icon icon="SETTINGS" />
        </div>
        {persistTemplate?.name && (
          <div className={ColumnsConfigButtonTemplateStyle}>{persistTemplate.name}</div>
        )}
      </button>

      <Dialog isOpen={isOpen} onRequestClose={handleClose}>
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
                <Tooltip message={<FormattedMessage {...messages.columnsConfigDefaultButton} />}>
                  <IconButton
                    onClick={handleDefault}
                    icon="UNDO"
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
                      <BaseCard icon="TEMPLATE" color="TEMPLATE">
                        <div className={TemplateStyle} onClick={onClick} role="presentation">
                          <Display height="30px" width="175px">
                            {currentTemplate.current.name}
                          </Display>
                        </div>
                      </BaseCard>
                    )
                  }
                </TemplateSelector>
              </div>

              <TemplateNew
                columns={dirtyColumns.flatMap(cols => (Array.isArray(cols) ? [...cols] : cols))}
                defaultColumns={defaultColumns}
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
