/* eslint-disable import/prefer-default-export */
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

export const getExport = (request: Object, onSuccess: () => void, onFailure: () => void) => {
  client
    .query({
      query: tokenQuery,
      fetchPolicy: 'network-only',
    })
    .then(({ data }) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', process.env.ZENPORT_EXPORTER_URL || '', true);
      // eslint-disable-next-line func-names
      xhr.onload = function() {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const content = xhr.getResponseHeader('Content-Disposition');
          if (content) {
            const matches = content.match(/\sfilename="([^"]+)"(\s|$)/);
            if (matches && matches.length > 1) {
              const fileName = matches[1];

              const a = document.createElement('a');
              a.href = window.URL.createObjectURL(blob);
              a.download = fileName;
              a.click();
            }
          }
        }

        onSuccess();
      };
      xhr.onerror = onFailure;

      xhr.setRequestHeader('Authorization', `Bearer ${data.viewer.token}`);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.responseType = 'blob';
      xhr.send(JSON.stringify(request));
    });
};
