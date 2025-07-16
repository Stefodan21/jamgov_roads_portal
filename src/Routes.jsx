import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import CitizenLoginRegistration from "pages/citizen-login-registration";
import CitizenDashboard from "pages/citizen-dashboard";
import DocumentManagementCenter from "pages/document-management-center";
import ApplicationSubmissionPortal from "pages/application-submission-portal";
import FieldAgentMobileInterface from "pages/field-agent-mobile-interface";
import StaffAdministrativeDashboard from "pages/staff-administrative-dashboard";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<CitizenLoginRegistration />} />
        <Route path="/citizen-login-registration" element={<CitizenLoginRegistration />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/document-management-center" element={<DocumentManagementCenter />} />
        <Route path="/application-submission-portal" element={<ApplicationSubmissionPortal />} />
        <Route path="/field-agent-mobile-interface" element={<FieldAgentMobileInterface />} />
        <Route path="/staff-administrative-dashboard" element={<StaffAdministrativeDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;