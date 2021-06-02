export type QuayLoadTest = {
  apiVersion: 'quay.io/v1';
  kind: 'QuayLoadTest';
  metadata: {
    name: string;
    namespace: string;
  };
  spec: {};
  status: {};
};
