// @flow
import React from 'react';

import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';

type Props = {
  onCancel: Function,
  onSave: Function,
};

const ContainersSlideView = ({ onCancel, onSave }: Props) => (
  <Layout
    navBar={
      <SlideViewNavBar>
        <EntityIcon icon="CONTAINER" color="CONTAINER" />
        <CancelButton onClick={onCancel} />
        <SaveButton onClick={onSave} />
      </SlideViewNavBar>
    }
  >
    hello
  </Layout>
);

export default ContainersSlideView;
