import ReactDOMServer from 'react-dom/server';

// Change the rendering approach
ReactDOMServer.renderToString(
  <React.Fragment>{description}</React.Fragment>
) 