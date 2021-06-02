import React, { useEffect, useState } from 'react';

import { QuayLoadTest } from 'types';

import logo from 'logo.svg';
import 'App.css';

const baseJob = {
  apiVersion: 'batch/v1',
  kind: 'Job',
  metadata: {
    name: 'quay-perf-test-orchestrator',
    labels: {
      'quay-perf-test-component': 'orchestrator'
    },
  },
  spec: {
    template: {
      spec: {
        containers: [{
          name: 'orchestrator',
          image: 'quay.io/alecmerdler/quay-performance-scripts:latest',
          securityContext: {
            priviliged: true,
          },
          env: [{
            name: 'QUAY_HOST',
            value: '<quay-host>',
          }, {
            name: 'QUAY_OAUTH_TOKEN',
            value: '<token>',
          }, {
            name: 'QUAY_ORG',
            value: 'loadtesting',
          }, {
            name: 'ES_HOST',
            value: '<es-host>',
          }, {
            name: 'ES_PORT',
            value: '9200',
          }, {
            name: 'PYTHONUNBUFFERED',
            value: '0',
          }],
          resources: {
            requests: {
              cpu: '1',
              memory: '512Mi',
            }
          },
          imagePullPolicy: 'Always',
        }],
        restartPolicy: 'Never'
      },
    },
    backoffLimit: 0,
  },
};

function App() {
  // Uses endpoint from `kubectl proxy`
  const endpoint = 'http://localhost:8001';

  const [quayLoadTests, setQuayLoadTests] = useState<QuayLoadTest[]>([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const startJob = async() => {
    const response = await fetch(endpoint, {
      method: 'POST',
    });

    return response.json();
  };

  // TODO(alecmerdler): Use WebSockets...
  useEffect(() => {
    fetch(`${endpoint}/apis/quay.io/v1/quayloadtests`)
      .then(res => res.json())
      .then((result) => {
        console.log(result);

        setIsLoaded(true);
        setError(null);
        setQuayLoadTests(result.items);
      }, (error) => {
        console.error(error);
      });
  }, [])

  return (
    <div className="App">
      <div>
        {quayLoadTests.map(qlt => <div>
          {qlt.metadata.name}
        </div>)}
      </div>
      <div>
        <button onClick={() => startJob()}>
          Start
        </button>
      </div>
    </div>
  );
}

export default App;
