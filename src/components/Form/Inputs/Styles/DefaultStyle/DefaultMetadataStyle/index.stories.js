import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
// action
import { action } from '@storybook/addon-actions';
import { Provider, Subscribe } from 'unstated';
import MetadataFormContainer from './container';
import DefaultMetadataStyle from './index';

storiesOf('DefaultMetadataStyle', module).add('default', () => (
  <div
    style={{
      marginLeft: 100,
      marginTop: 100,
      height: 200,
      width: 330,
    }}
  >
    <Provider>
      <Subscribe to={[MetadataFormContainer]}>
        {(originalValues, state, setFieldValue) => {
          const values = { ...originalValues, ...state };
          return (
            <DefaultMetadataStyle
              targetName="story-metadata"
              width="150px"
              metadata={values.state.metadata}
              index={1}
              setFieldArrayValue={setFieldValue}
              onRemove={action('remove')}
            />
          );
        }}
      </Subscribe>
    </Provider>
  </div>
));
