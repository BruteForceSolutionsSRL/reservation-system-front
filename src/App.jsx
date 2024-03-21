import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/Home';
import NotFound from './Components/NotFound';

export default function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home/>}></Route>
        </Route>
        <Route path="/example">
          <Route index element={<h1>This is a example route</h1>}></Route>
        </Route>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}