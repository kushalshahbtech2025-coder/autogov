import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  Check, 
  CheckCircle2,
  AlertTriangle, 
  Sparkles, 
  Layers, 
  Save, 
  X, 
  ArrowRight,
  Database,
  Server,
  Code2,
  Cpu,
  Eye,
  Lock,
  Search,
  Activity,
  Workflow
} from 'lucide-react';
import { TechStackItem, Application, ViewMode } from '../types';

interface DynamicTechStackMatrixProps {
  techStack: TechStackItem[];
  onUpdateTechStack: (updated: TechStackItem[]) => void;
  onResetDefault: () => void;
  applications: Application[];
  onNavigate?: (view: ViewMode) => void;
}

export const DynamicTechStackMatrix: React.FC<DynamicTechStackMatrixProps> = ({
  techStack,
  onUpdateTechStack,
  onResetDefault,
  applications,
  onNavigate
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TechStackItem>>({});
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newForm, setNewForm] = useState<Partial<TechStackItem>>({
    tier: 'AI & Inference Engine',
    category: 'ai-ml',
    primaryTech: '',
    secondaryFallback: '',
    roleAndSla: '',
    status: 'ACTIVE',
    activeRecordsCount: 0,
    healthScore: 99.8,
    lastUpdated: 'Just now'
  });

  // Calculate live dynamic metrics from applications record state
  const totalRecords = applications.length;
  const approvedCount = applications.filter(a => a.status === 'APPROVED').length;
  const rejectedCount = applications.filter(a => a.status === 'REJECTED').length;
  const flaggedCount = applications.filter(a => a.status === 'REVIEW_REQUIRED' || a.riskScore > 50).length;
  const autoClearedCount = applications.filter(a => a.status === 'AUTO_CLEARED').length;
  const avgRiskScore = totalRecords > 0 
    ? Math.round(applications.reduce((acc, a) => acc + a.riskScore, 0) / totalRecords) 
    : 0;

  const handleStartEdit = (item: TechStackItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSaveEdit = (id: string) => {
    onUpdateTechStack(
      techStack.map(item => {
        if (item.id === id) {
          return {
            ...item,
            ...editForm,
            lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          } as TechStackItem;
        }
        return item;
      })
    );
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    onUpdateTechStack(techStack.filter(item => item.id !== id));
  };

  const handleCreateNew = () => {
    if (!newForm.primaryTech || !newForm.tier) return;
    const newItem: TechStackItem = {
      id: `custom-tier-${Date.now()}`,
      tier: newForm.tier || 'Custom Layer',
      category: (newForm.category as any) || 'backend',
      primaryTech: newForm.primaryTech,
      secondaryFallback: newForm.secondaryFallback || 'N/A',
      roleAndSla: newForm.roleAndSla || 'Integrated state service handler',
      status: (newForm.status as any) || 'ACTIVE',
      activeRecordsCount: totalRecords,
      healthScore: newForm.healthScore || 99.5,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onUpdateTechStack([...techStack, newItem]);
    setIsAddingNew(false);
    setNewForm({
      tier: 'AI & Inference Engine',
      category: 'ai-ml',
      primaryTech: '',
      secondaryFallback: '',
      roleAndSla: '',
      status: 'ACTIVE',
      activeRecordsCount: 0,
      healthScore: 99.8,
      lastUpdated: 'Just now'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#c4c6cf] shadow-sm overflow-hidden" id="live-matrix-editor">
      {/* Header & Live Record Synchronization Banner */}
      <div className="p-6 bg-[#f8f9ff] border-b border-[#c4c6cf] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#13696a]">
              Reactive State Synchronization
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#002045]">
            Dynamic Tech Stack &amp; Record Telemetry Matrix
          </h3>
          <p className="text-xs text-[#43474e] mt-1">
            Every layer in the architecture dynamically responds to application record updates, officer adjudications, and citizen submissions in real time.
          </p>
        </div>

        {/* Live synchronized stats pills */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <div className="bg-white px-3 py-1.5 rounded-lg border border-[#c4c6cf] text-xs shadow-xs">
            <span className="text-[#43474e] block text-[10px] uppercase font-bold">Total Ingested</span>
            <span className="font-mono font-bold text-[#002045] text-sm">{totalRecords} Records</span>
          </div>

          <div className="bg-[#a2eded]/30 px-3 py-1.5 rounded-lg border border-[#13696a]/30 text-xs shadow-xs">
            <span className="text-[#004f50] block text-[10px] uppercase font-bold">Auto-Cleared</span>
            <span className="font-mono font-bold text-[#13696a] text-sm">{autoClearedCount}</span>
          </div>

          <div className="bg-[#ffdad6]/40 px-3 py-1.5 rounded-lg border border-[#ba1a1a]/30 text-xs shadow-xs">
            <span className="text-[#93000a] block text-[10px] uppercase font-bold">Flagged / High Risk</span>
            <span className="font-mono font-bold text-[#ba1a1a] text-sm">{flaggedCount}</span>
          </div>

          <div className="bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#c4c6cf] text-xs shadow-xs">
            <span className="text-[#002045] block text-[10px] uppercase font-bold">Avg Model Risk</span>
            <span className="font-mono font-bold text-[#002045] text-sm">{avgRiskScore}/100</span>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="p-4 bg-white border-b border-[#c4c6cf]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-3.5 py-2 bg-[#002045] text-white font-bold rounded-lg hover:bg-[#1a365d] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Architecture Tier / Service</span>
          </button>

          <button
            onClick={onResetDefault}
            className="px-3 py-2 bg-white border border-[#c4c6cf] text-[#43474e] font-semibold rounded-lg hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset stack matrix to default FastAPI + PyTorch production spec"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="text-[11px] text-[#74777f] flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-[#13696a]" />
          <span>Click <strong>Edit</strong> on any row to configure tech stack components directly</span>
        </div>
      </div>

      {/* Add New Layer Modal / Inline Form */}
      {isAddingNew && (
        <div className="p-5 bg-[#eff4ff] border-b border-[#c4c6cf] animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-[#002045] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#13696a]" />
              <span>Register New Architecture Service / Technology</span>
            </h4>
            <button 
              onClick={() => setIsAddingNew(false)}
              className="p-1 text-[#43474e] hover:text-[#ba1a1a] rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-[#002045] mb-1">Tier / Layer Title</label>
              <input
                type="text"
                value={newForm.tier}
                onChange={(e) => setNewForm({ ...newForm, tier: e.target.value })}
                placeholder="e.g. Real-time Stream Engine"
                className="w-full p-2 bg-white border border-[#c4c6cf] rounded focus:ring-1 focus:ring-[#13696a]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#002045] mb-1">Primary Technology</label>
              <input
                type="text"
                value={newForm.primaryTech}
                onChange={(e) => setNewForm({ ...newForm, primaryTech: e.target.value })}
                placeholder="e.g. Apache Kafka / FastAPI WebSocket"
                className="w-full p-2 bg-white border border-[#c4c6cf] rounded focus:ring-1 focus:ring-[#13696a]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#002045] mb-1">Secondary / Fallback</label>
              <input
                type="text"
                value={newForm.secondaryFallback}
                onChange={(e) => setNewForm({ ...newForm, secondaryFallback: e.target.value })}
                placeholder="e.g. Redis Pub/Sub"
                className="w-full p-2 bg-white border border-[#c4c6cf] rounded focus:ring-1 focus:ring-[#13696a]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#002045] mb-1">Role &amp; Statutory SLA</label>
              <input
                type="text"
                value={newForm.roleAndSla}
                onChange={(e) => setNewForm({ ...newForm, roleAndSla: e.target.value })}
                placeholder="e.g. Stream ingestion < 50ms"
                className="w-full p-2 bg-white border border-[#c4c6cf] rounded focus:ring-1 focus:ring-[#13696a]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#c4c6cf] rounded hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNew}
              disabled={!newForm.primaryTech || !newForm.tier}
              className="px-4 py-1.5 text-xs font-bold bg-[#13696a] text-white rounded hover:bg-[#004f50] disabled:opacity-50"
            >
              Save Service to Matrix
            </button>
          </div>
        </div>
      )}

      {/* Reactive Master Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#002045] text-white font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 w-48">Architectural Tier</th>
              <th className="py-3.5 px-4">Primary Technology</th>
              <th className="py-3.5 px-4">Secondary / Fallback</th>
              <th className="py-3.5 px-4">Core Function &amp; SLA</th>
              <th className="py-3.5 px-4 w-32">Live Telemetry</th>
              <th className="py-3.5 px-4 w-28 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c4c6cf]/60">
            {techStack.map((item) => {
              const isEditing = editingId === item.id;
              
              if (isEditing) {
                return (
                  <tr key={item.id} className="bg-[#fff9e6] transition-colors">
                    <td className="p-3">
                      <input
                        type="text"
                        value={editForm.tier || ''}
                        onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                        className="w-full p-1.5 bg-white border border-[#c4c6cf] rounded font-bold text-xs"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={editForm.primaryTech || ''}
                        onChange={(e) => setEditForm({ ...editForm, primaryTech: e.target.value })}
                        className="w-full p-1.5 bg-white border border-[#c4c6cf] rounded text-xs font-semibold text-[#13696a]"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={editForm.secondaryFallback || ''}
                        onChange={(e) => setEditForm({ ...editForm, secondaryFallback: e.target.value })}
                        className="w-full p-1.5 bg-white border border-[#c4c6cf] rounded text-xs"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={editForm.roleAndSla || ''}
                        onChange={(e) => setEditForm({ ...editForm, roleAndSla: e.target.value })}
                        className="w-full p-1.5 bg-white border border-[#c4c6cf] rounded text-xs"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        value={editForm.status || 'ACTIVE'}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                        className="w-full p-1 bg-white border border-[#c4c6cf] rounded text-xs"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="SYNCING">SYNCING</option>
                        <option value="STANDBY">STANDBY</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                          title="Save changes"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditForm({}); }}
                          className="p-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={item.id} className="hover:bg-[#eff4ff] transition-colors group">
                  <td className="py-3.5 px-4 font-bold text-[#002045]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#13696a]" />
                      <span>{item.tier}</span>
                    </div>
                  </td>
                  
                  <td className="py-3.5 px-4 font-semibold text-[#13696a]">
                    {item.primaryTech}
                  </td>

                  <td className="py-3.5 px-4 text-[#43474e]">
                    {item.secondaryFallback}
                  </td>

                  <td className="py-3.5 px-4 text-[#43474e]">
                    {item.roleAndSla}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          item.status === 'ACTIVE' ? 'bg-emerald-500' :
                          item.status === 'SYNCING' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'
                        }`} />
                        <span className="font-mono text-[10px] font-bold text-[#002045]">
                          {item.status || 'ACTIVE'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#74777f]">
                        {totalRecords} records active
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 text-[#002045] hover:bg-[#dce9ff] rounded transition-colors"
                        title="Edit Technology"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded transition-colors"
                        title="Delete layer from matrix"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 bg-[#f8f9ff] border-t border-[#c4c6cf]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#43474e] gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            Real-time synchronization connected: <strong>FastAPI, PyTorch CNN, XGBoost &amp; PostgreSQL</strong> are responding to live caseload.
          </span>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('officer_review')}
            className="text-xs font-bold text-[#13696a] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Test Adjudication on Caseworker Cockpit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
