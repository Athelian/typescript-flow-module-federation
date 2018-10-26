// @flow
import * as React from 'react';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';

type Props = {
  onSave: () => void,
  onCancel: () => void,
};

export default function TableInlineEdit({ onSave, onCancel }: Props) {
  return (
    <Layout
      navBar={
        <SlideViewNavBar>
          <EntityIcon icon="ORDER" color="ORDER" />

          <CancelButton onClick={onCancel} />
          <SaveButton onClick={onSave} />
        </SlideViewNavBar>
      }
    >
      <h1>Test</h1>
    </Layout>
  );
}
