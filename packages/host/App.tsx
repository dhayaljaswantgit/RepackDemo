/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {Federated} from '@callstack/repack/client';
import React from 'react';
import {Platform, SafeAreaView, StyleSheet, Text} from 'react-native';

import {ScriptManager, Script} from '@callstack/repack/client';

const resolveURL = Federated.createURLResolver({
  containers: {
    app1: 'http://localhost:9000/[name][ext]',
    // app2: 'http://localhost:9001/[name][ext]',
    app2: `https://github.com/dhayaljaswantgit/test-data/releases/download/app2-${Platform.OS}@1.0.0/[name][ext]`,
    // module1: 'http://localhost:9002/[name][ext]',
  },
});

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  let url;
  if (caller === 'main') {
    url = Script.getDevServerURL(scriptId);
  } else {
    url = resolveURL(scriptId, caller);
  }

  if (!url) {
    return undefined;
  }

  console.log({
    scriptId,
    caller,
    url,
  });

  return {
    url,
    cache: false, // For development
    query: {
      platform: Platform.OS,
    },
  };
});

const App1 = React.lazy(() => Federated.importModule('app1', './App'));
const App2 = React.lazy(() => Federated.importModule('app2', './App'));
// const ServerHosted = React.lazy(() => Federated.importModule('app2', './App'));

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{}}>
      <Text style={styles.sectionTitle}>This is Host app Jassu</Text>
      <React.Suspense fallback={<Text>Loading app1...</Text>}>
        <App1 />
      </React.Suspense>
      <React.Suspense fallback={<Text>Loading app2...</Text>}>
        <App2 />
      </React.Suspense>
      {/* <React.Suspense fallback={<Text>Loading app2...</Text>}>
        <ServerHosted />
      </React.Suspense> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    padding: 20,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
