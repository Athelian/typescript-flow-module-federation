// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import { Label } from 'components/Form';
import {
  DocumentTypeAreaWrapperStyle,
  DocumentTypeAreaHeaderStyle,
  DocumentTypeAreaBodyStyle,
  DummyDocumentCard,
} from './style';

type Props = {|
  type: { value: string, label: React$Node },
  files: Array<FilePayload>,
|};

const DocumentTypeArea = ({ type, files }: Props) => {
  return (
    <div className={DocumentTypeAreaWrapperStyle}>
      <div className={DocumentTypeAreaHeaderStyle}>
        <Label>
          {type.label}
          {' ('}
          <FormattedNumber value={files.length} />)
        </Label>
      </div>

      {files.length > 0 && (
        <div className={DocumentTypeAreaBodyStyle}>
          {files.map(file => (
            <div className={DummyDocumentCard}>{file.id}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentTypeArea;
