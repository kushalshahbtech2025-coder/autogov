import React, { useState, useEffect } from 'react';
import { ViewMode, Application, AuditLog, TechStackItem } from './types';
import { INITIAL_APPLICATIONS, INITIAL_AUDIT_LOGS } from './data/mockApplications';
import { INITIAL_TECH_STACK } from './data/techStackData';
import { HeaderNav } from './components/HeaderNav';
import { PlatformOverviewPage } from './components/pages/PlatformOverviewPage';
import { HowItWorksPage } from './components/pages/HowItWorksPage';
import { TechStackPage } from './components/pages/TechStackPage';
import { AiEnginePage } from './components/pages/AiEnginePage';
import { ImpactMetricsPage } from './components/pages/ImpactMetricsPage';
import { SecurityCompliancePage } from './components/pages/SecurityCompliancePage';
import { CitizenApplicationPage } from './components/pages/CitizenApplicationPage';
import { OfficerPortal } from './components/OfficerPortal';
import { Footer } from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('platform');
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [techStack, setTechStack] = useState<TechStackItem[]>(INITIAL_TECH_STACK);
  const [selectedAppId, setSelectedAppId] = useState<string>('AG-2026-1049');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Synchronize state with backend REST API on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [appsRes, logsRes, stackRes] = await Promise.all([
          fetch('/api/applications'),
          fetch('/api/audit-logs'),
          fetch('/api/tech-stack')
        ]);

        if (appsRes.ok) {
          const appsData = await appsRes.json();
          if (Array.isArray(appsData) && appsData.length > 0) {
            setApplications(appsData);
            if (!appsData.some(a => a.id === selectedAppId)) {
              setSelectedAppId(appsData[0].id);
            }
          }
        }

        if (logsRes.ok) {
          const logsData = await logsRes.json();
          if (Array.isArray(logsData) && logsData.length > 0) {
            setAuditLogs(logsData);
          }
        }

        if (stackRes.ok) {
          const stackData = await stackRes.json();
          if (Array.isArray(stackData) && stackData.length > 0) {
            setTechStack(stackData);
          }
        }
      } catch (err) {
        console.warn('[AutoGov+ Frontend] API sync warning, using local initial state', err);
      }
    };

    fetchBackendData();
  }, []);

  const pendingReviewsCount = applications.filter(a => a.status === 'REVIEW_REQUIRED').length;

  // Handler to reset tech stack
  const handleResetDefaultTechStack = async () => {
    setTechStack(INITIAL_TECH_STACK);
    try {
      await fetch('/api/tech-stack/reset', { method: 'POST' });
    } catch (err) {
      console.warn('Could not reset backend tech stack:', err);
    }
  };

  const handleUpdateTechStack = async (updated: TechStackItem[]) => {
    setTechStack(updated);
    try {
      await fetch('/api/tech-stack', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.warn('Could not update backend tech stack:', err);
    }
  };

  const handleUpdateApplicationStatus = async (
    id: string,
    status: 'APPROVED' | 'REJECTED' | 'REVIEW_REQUIRED',
    notes?: string
  ) => {
    // Optimistic UI update
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status,
          reviewNotes: notes,
          reviewedBy: 'Officer J. Smith (Alpha-04)',
          reviewedAt: new Date().toLocaleString()
        };
      }
      return app;
    }));

    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      applicationId: id,
      officer: 'Officer J. Smith (Alpha-04)',
      action: status === 'APPROVED' ? 'OFFICER_APPROVED' : 'OFFICER_REJECTED',
      details: notes || `Case status updated to ${status}. Digital clearance signature appended.`,
      type: 'officer_action'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Async sync to server
    try {
      const resp = await fetch(`/api/applications/${encodeURIComponent(id)}/adjudicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewNotes: notes,
          officerName: 'Officer J. Smith (Alpha-04)'
        })
      });
      if (resp.ok) {
        const updatedApp = await resp.json();
        setApplications(prev => prev.map(a => a.id === id ? updatedApp : a));
      }
    } catch (err) {
      console.warn('Backend adjudication API failed, retained local update', err);
    }
  };

  const handleApplicationCreated = async (newApp: Application) => {
    setApplications(prev => [newApp, ...prev]);
    setSelectedAppId(newApp.id);

    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      });
    } catch (err) {
      console.warn('Backend application creation API call failed, retained local update', err);
    }
  };

  const handleUpdateApplication = async (updatedApp: Application, correctionNote?: string) => {
    // Optimistic local update
    setApplications(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));

    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      applicationId: updatedApp.id,
      officer: updatedApp.reviewedBy || 'Officer J. Smith (Alpha-04)',
      action: 'OFFICER_FIELD_CORRECTION',
      details: correctionNote || `Officer modified and corrected extracted entities for application ${updatedApp.id}.`,
      type: 'officer_action'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    try {
      const resp = await fetch(`/api/applications/${encodeURIComponent(updatedApp.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedApp,
          correctionNote
        })
      });
      if (resp.ok) {
        const persisted = await resp.json();
        setApplications(prev => prev.map(a => a.id === updatedApp.id ? persisted : a));
      }
    } catch (err) {
      console.warn('Backend patch application failed, retained local update', err);
    }
  };

  return (
    <div className="app-root min-h-screen flex flex-col bg-[#000c18] text-[#e8f0ff] font-sans antialiased">
      {/* Top Fixed Navigation Header — hidden on landing page */}
      {currentView !== 'platform' && (
        <HeaderNav
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          pendingReviewsCount={pendingReviewsCount}
        />
      )}

      {/* Main View Router */}
      <main className={`${currentView !== 'platform' ? 'pt-16' : ''} pb-16 flex-grow flex flex-col`}>
        {currentView === 'platform' && (
          <PlatformOverviewPage 
            onNavigate={setCurrentView}
            onApplicationCreated={handleApplicationCreated}
            onSelectApplicationForReview={(id) => setSelectedAppId(id)}
          />
        )}

        {currentView === 'how-it-works' && (
          <>
            <HowItWorksPage onNavigate={setCurrentView} />
            <Footer onNavigate={setCurrentView} />
          </>
        )}

        {(currentView === 'tech-stack' || currentView === 'ai-engine') && (
          <>
            <TechStackPage 
              onNavigate={setCurrentView}
              techStack={techStack}
              onUpdateTechStack={handleUpdateTechStack}
              onResetDefaultTechStack={handleResetDefaultTechStack}
              applications={applications}
            />
            <Footer onNavigate={setCurrentView} />
          </>
        )}

        {(currentView === 'impact' || currentView === 'security') && (
          <>
            <ImpactMetricsPage 
              onNavigate={setCurrentView}
              applications={applications}
              techStack={techStack}
              onUpdateTechStack={handleUpdateTechStack}
              onResetDefaultTechStack={handleResetDefaultTechStack}
            />
            <Footer onNavigate={setCurrentView} />
          </>
        )}

        {currentView === 'citizen' && (
          <>
            <CitizenApplicationPage
              onNavigate={setCurrentView}
              onApplicationCreated={handleApplicationCreated}
              onSelectApplicationForReview={(id) => setSelectedAppId(id)}
            />
            <Footer onNavigate={setCurrentView} />
          </>
        )}

        {currentView.startsWith('officer') && (
          <OfficerPortal
            currentView={currentView}
            onNavigate={setCurrentView}
            applications={applications}
            selectedAppId={selectedAppId}
            onSelectApplication={(id) => setSelectedAppId(id)}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onApplicationCreated={handleApplicationCreated}
            onUpdateApplication={handleUpdateApplication}
            auditLogs={auditLogs}
          />
        )}
      </main>
    </div>
  );
}


