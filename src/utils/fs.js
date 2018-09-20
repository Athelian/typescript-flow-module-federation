// @flow
import gql from 'graphql-tag';
import client from '../apollo';

const tokenQuery = gql`
  {
    viewer {
      token
    }
  }
`;

export const upload = (
  file: File,
  onSuccess: Object => void,
  onFailure: Function,
  onProgress: ProgressEvent => void
) => {
  client
    .query({
      query: tokenQuery,
      fetchPolicy: 'network-only',
    })
    .then(({ data }) => {
      const form = new FormData();
      form.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${process.env.ZENPORT_FS_URL || ''}/public/upload`, true);
      xhr.upload.onprogress = onProgress;
      xhr.onload = function onload() {
        try {
          const response = JSON.parse(this.response);
          onSuccess(response);
        } catch (e) {
          onFailure(e);
        }
      };
      xhr.upload.onerror = onFailure;

      xhr.setRequestHeader('Authorization', `Bearer ${data.viewer.token}`);
      xhr.send(form);
    });
};

export const download = () => {};
