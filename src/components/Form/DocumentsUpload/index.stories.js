/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { set, cloneDeep } from 'lodash';
import { ToggleInput, Label, DocumentsUpload } from 'components/Form';

storiesOf('Form/Inputs/Documents Input', module).add('Documents Input', () => (
  <ObjectValue
    defaultValue={{
      readOnly: false,
      downloadDisabled: false,
      files: [
        {
          id: '1',
          name: 'sample1.png',
          path:
            'https://fs-staging.zenport.io/public/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDk2OTk2MTksImlhdCI6MTU0OTYxMzIxOSwiaXNzIjoiZmlsZXN5c3RlbSIsIm5iZiI6MTU0OTYxMzIxOSwic3ViIjoiYmhlamg4Z3ZzYm44MXQzNHRmMTAifQ.MhIEzTOTf0F9Qaig_xdLJcRtkhWyqBUV7OFtuXtagvA',
          type: 'Option2',
          memo: null,
        },
        {
          id: '2',
          name: 'sample2.png',
          path:
            'https://fs-staging.zenport.io/public/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDk2OTk2MTksImlhdCI6MTU0OTYxMzIxOSwiaXNzIjoiZmlsZXN5c3RlbSIsIm5iZiI6MTU0OTYxMzIxOSwic3ViIjoiYmhlamg4Z3ZzYm44MXQzNHRmMTAifQ.MhIEzTOTf0F9Qaig_xdLJcRtkhWyqBUV7OFtuXtagvA',
          type: 'Option1',
          memo: 'Hello',
        },
      ],
    }}
  >
    {({ value: { readOnly, downloadDisabled, files }, set: setField }) => (
      <>
        <DocumentsUpload
          id="files"
          name="files"
          values={files}
          onChange={(path, value) => {
            const newState = set(cloneDeep(files), path, value);
            setField('files', newState);
          }}
          types={[
            {
              type: 'Option1',
              label: 'Option 1',
            },
            {
              type: 'Option2',
              label: 'Option 2',
            },
          ]}
          readOnly={readOnly}
          downloadDisabled={downloadDisabled}
        />
        <ToggleInput toggled={readOnly} onToggle={() => setField('readOnly', !readOnly)}>
          <Label>READONLY</Label>
        </ToggleInput>
        <ToggleInput
          toggled={downloadDisabled}
          onToggle={() => setField('downloadDisabled', !downloadDisabled)}
        >
          <Label>HIDE DOWNLOAD</Label>
        </ToggleInput>
      </>
    )}
  </ObjectValue>
));
