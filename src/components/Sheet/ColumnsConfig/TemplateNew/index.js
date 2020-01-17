// @flow
import * as React from 'react';
import SlideView from 'components/SlideView';
import type { ColumnConfig } from 'components/Sheet';
import TableTemplateFormContainer from 'modules/tableTemplate/form/container';
import { TableTemplateForm } from 'modules/tableTemplate/form';

type RenderProps = {
  onClick: () => void,
};

type Props = {
  columns: Array<ColumnConfig>,
  defaultColumns: Array<ColumnConfig>,
  templateType: string,
  onSave: Object => void,
  children: RenderProps => React.Node,
};

const TemplateNew = ({ columns, defaultColumns, templateType, onSave, children }: Props) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {children({ onClick: () => setOpen(true) })}

      <SlideView
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        shouldConfirm={() => document.getElementById('table_template_form_save_button')}
      >
        <TableTemplateFormContainer.Provider
          initialState={{
            type: templateType,
            defaultColumns,
            tableTemplate: {
              columns: columns.map(({ key, hidden }) => ({ key, hidden })),
            },
          }}
        >
          <TableTemplateForm
            onSave={template => {
              onSave(template);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        </TableTemplateFormContainer.Provider>
      </SlideView>
    </>
  );
};

export default TemplateNew;
