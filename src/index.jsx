import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { Auth0ProviderWithNavigate } from './components/pages/Auth0/auth0-provider-with-navigate';
import 'antd/dist/antd.less';
import { NotFoundPage } from './components/pages/NotFound';
import { LandingPage } from './components/pages/Landing';
import { FooterContent, SubFooter } from './components/Layout/Footer';
import { HeaderContent } from './components/Layout/Header';
import { Layout } from 'antd';
import GraphsContainer from './components/pages/DataVisualizations/GraphsContainer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reducer from './state/reducers';
import { colors } from './styles/data_vis_colors';
import { Profile } from './components/pages/Auth0/Profile';

const { primary_accent_color } = colors;
const store = configureStore({ reducer: reducer });

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <React.StrictMode>
        <Auth0ProviderWithNavigate>
          <App />
        </Auth0ProviderWithNavigate>
      </React.StrictMode>
    </Provider>
  </Router>,
  document.getElementById('root')
);

function App() {
  const { Footer, Header } = Layout;
  return (
    <Layout>
      <Header style={{ height: '10vh', display: 'flex', alignItems: 'center', backgroundColor: primary_accent_color }}>
        <HeaderContent />
      </Header>
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route path="/graphs" component={GraphsContainer} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFoundPage} />
      </Switch>
      <Footer style={{ backgroundColor: primary_accent_color, color: '#E2F0F7' }}>
        <FooterContent />
      </Footer>
      <Footer style={{ backgroundColor: primary_accent_color, padding: 0 }}>
        <SubFooter />
      </Footer>
    </Layout>
  );
}