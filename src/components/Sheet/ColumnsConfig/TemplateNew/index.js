// @flow
import * as React from 'react';
import SlideView from 'components/SlideView';
import TemplateFormWrapper from 'modules/tableTemplate/common/TemplateFormWrapper';

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
        <TemplateFormWrapper
          template={{
            name: '',
            memo: '',
            type: templateType,
            fields: columns,
          }}
          isNew
          onSave={template => onSave(template)}
          onCancel={() => setOpen(false)}
        />
      </SlideView>
    </>
  );
};

export default TemplateNew;
