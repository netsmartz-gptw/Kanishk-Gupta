import React from 'react';
// import { Switch, Redirect, Router } from 'react-router-dom';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Contacts, NotFound, ContactDetails } from './views'


const RouteConfig = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Contacts />} />
        <Route path="/contact/:id" element={<ContactDetails />} />
				<Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteConfig;
