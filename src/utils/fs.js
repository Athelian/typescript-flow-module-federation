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

// TODO: only make new token once
export const upload = (file: File, onProgress: Function): Promise<any> => {
  return new Promise((resolve, reject) => {
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
            resolve(response);
          } catch (e) {
            reject(e);
          }
        };
        xhr.upload.onerror = reject;

        xhr.setRequestHeader('Authorization', `Bearer ${data.viewer.token}`);
        xhr.send(form);
      });
  });
};

export const download = () => {};
