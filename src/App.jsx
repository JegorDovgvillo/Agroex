import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/lots" element={'lots'}></Route>
          <Route path="/lots/details" element={'lot-details'}></Route>
        </Routes>
      </Layout>
    </Router>
  );
}
export default App;
