// @flow
import * as React from 'react';
import SlideView from 'components/SlideView';
import TableTemplateFormWrapper from 'modules/tableTemplate/common/TableTemplateFormWrapper';
import TableTemplateFormContainer from 'modules/tableTemplate/form/container';

type RenderProps = {
  onClick: () => void,
};

type Props = {
  columns: Array<string>,
  templateType: string,
  onSave: Object => void,
  children: RenderProps => React.Node,
};

const TemplateNew = ({ columns, templateType, onSave, children }: Props) => {
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
            columns,
          }}
        >
          <TableTemplateFormWrapper
            isNew
            // TODO: Apply properly
            onSave={template => onSave(template)}
            onCancel={() => setOpen(false)}
          />
        </TableTemplateFormContainer.Provider>
      </SlideView>
    </>
  );
};

export default TemplateNew;
