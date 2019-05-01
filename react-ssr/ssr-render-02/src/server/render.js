import React from 'react';
import {renderToString} from 'react-dom/server';
import {StaticRouter, Route, matchPath} from 'react-router-dom';
import {matchRoutes} from 'react-router-config';
import routes from '../routes';
import {Provider} from 'react-redux';
import {getServerStore} from "../store";
import Header from '../components/Header';

export default (req, res) => {

  const context = {};

  let store = getServerStore(req);

  // let matchRoutes = routes.filter(route => (
  //   matchPath(req.path, route)
  // ));
  // console.log(matchRoutes);
  //
  // let promises = [];
  //
  // matchRoutes.forEach(route => {
  //   let loadData = route.loadData;
  //   if (loadData) {
  //     promises.push(loadData(store));
  //   }
  // });

  // matchRoutes[0].loadData(store).then(res => {
  //   console.log(res);
  // });

  let matchedRoutes = matchRoutes(routes, req.path);

  let promises = [];

  matchedRoutes.forEach(item => {
    let loadData = item.route.loadData;
    const promise = new Promise((resolve) => {
      return loadData(store).then(resolve).catch(resolve);
    });
    promises.push(promise);
  });

  console.log(promises);

  Promise.all(promises).then(data => {
    let domContent = renderToString(
      <Provider store={store}>
        <StaticRouter context={context} location={req.path}>
          <div>
            <Header/>
            <div className="container" style={{marginTop: 70}}>
              {
                routes.map(route => (<Route {...route} />))
              }
            </div>
          </div>
        </StaticRouter>
      </Provider>
    );

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <link href="https://cdn.bootcss.com/twitter-bootstrap/3.3.7/css/bootstrap.css" rel="stylesheet">
  <title>react-ssr</title>
</head>
<body>
<div id="root">${domContent}</div>
<script>
  window.context = {
    state: ${JSON.stringify(store.getState())}
  }
</script>
<script src="/client.js"></script>
</body>
</html>
`;
    res.send(html);
  });
};
