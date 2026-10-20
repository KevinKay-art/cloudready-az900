import React, { useState } from 'react';
import {
  Layers,
  FolderTree,
  Database,
  ShieldCheck,
  Check,
  Building2,
  Server,
  Cloud,
  ChevronRight,
  Info,
} from 'lucide-react';

export const Visualizers: React.FC = () => {
  const [activeVisualizer, setActiveVisualizer] = useState<'shared-responsibility' | 'hierarchy' | 'redundancy'>('shared-responsibility');

  // Shared Responsibility State
  const [selectedServiceMode, setSelectedServiceMode] = useState<'on-prem' | 'iaas' | 'paas' | 'saas'>('iaas');
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  // Hierarchy State
  const [selectedHierarchyLevel, setSelectedHierarchyLevel] = useState<string>('rg');

  // Storage Redundancy State
  const [selectedRedundancy, setSelectedRedundancy] = useState<'lrs' | 'zrs' | 'grs' | 'gzrs'>('zrs');

  const layers = [
    {
      id: 'data',
      name: 'Information & Data',
      desc: 'Customer files, databases, documents, and business records.',
      status: {
        'on-prem': 'customer',
        iaas: 'customer',
        paas: 'customer',
        saas: 'customer',
      },
      note: 'Customer is ALWAYS 100% responsible for their data in every cloud model!',
    },
    {
      id: 'devices',
      name: 'Client Endpoints & Devices',
      desc: 'Laptops, mobile phones, browser security, and access devices.',
      status: {
        'on-prem': 'customer',
        iaas: 'customer',
        paas: 'customer',
        saas: 'customer',
      },
      note: 'Securing the physical laptops and mobile devices accessing cloud apps.',
    },
    {
      id: 'identity',
      name: 'Accounts & Identities',
      desc: 'User passwords, MFA policies, group assignments, and access privileges.',
      status: {
        'on-prem': 'customer',
        iaas: 'customer',
        paas: 'customer',
        saas: 'customer',
      },
      note: 'You must configure user accounts and passwords securely.',
    },
    {
      id: 'apps',
      name: 'Applications',
      desc: 'Application code, custom APIs, business logic, and web pages.',
      status: {
        'on-prem': 'customer',
        iaas: 'customer',
        paas: 'customer',
        saas: 'microsoft',
      },
      note: 'In SaaS (e.g. M365), Microsoft provides and updates the application code.',
    },
    {
      id: 'network-ctrl',
      name: 'Network Controls',
      desc: 'Firewalls, Network Security Groups, subnets, and routing rules.',
      status: {
        'on-prem': 'customer',
        iaas: 'customer',
        paas: 'shared',
        saas: 'microsoft',
      },
      note: 'In PaaS, network isolation is shared; in IaaS, you configure NSGs.',
    },
    {
      id: 'os',
      name: 'Operating System',
      desc: 'Windows or Linux OS installation, kernel updates, and security patching.',
      status: {
        'on-prem': 'customer',
        iaas: 'customer',
        paas: 'microsoft',
        saas: 'microsoft',
      },
      note: 'Key exam point: In IaaS, you must patch the OS. In PaaS, Microsoft patches the OS!',
    },
    {
      id: 'runtime',
      name: 'Runtime & Middleware',
      desc: '.NET, Java, Node.js, Python runtimes and web servers (IIS, NGINX).',
      status: {
        'on-prem': 'customer',
        iaas: 'customer',
        paas: 'microsoft',
        saas: 'microsoft',
      },
      note: 'PaaS platforms (like App Service) automatically manage the runtime engine.',
    },
    {
      id: 'hypervisor',
      name: 'Compute Hypervisor',
      desc: 'Virtualization hypervisor software partitioning physical servers.',
      status: {
        'on-prem': 'customer',
        iaas: 'microsoft',
        paas: 'microsoft',
        saas: 'microsoft',
      },
      note: 'Microsoft Azure manages the hypervisors across all public cloud services.',
    },
    {
      id: 'physical',
      name: 'Physical Datacenter, Power & Cooling',
      desc: 'Server hardware, generators, fiber cables, perimeter security, and guards.',
      status: {
        'on-prem': 'customer',
        iaas: 'microsoft',
        paas: 'microsoft',
        saas: 'microsoft',
      },
      note: 'Microsoft is ALWAYS 100% responsible for physical datacenters in the cloud.',
    },
  ];

  const getOwnerLabel = (status: string) => {
    if (status === 'customer') return { text: 'Customer Responsibility', color: 'bg-sky-100 text-sky-800 border-sky-300' };
    if (status === 'microsoft') return { text: 'Microsoft Responsibility', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
    return { text: 'Shared Responsibility', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  };

  return (
    <div className="space-y-6">
      {/* Visualizer Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Interactive Architectural Visualizers</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hands-on visual models for the most tested diagrams on the AZ-900 exam.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveVisualizer('shared-responsibility')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeVisualizer === 'shared-responsibility'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Shared Responsibility
          </button>
          <button
            onClick={() => setActiveVisualizer('hierarchy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeVisualizer === 'hierarchy'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resource Hierarchy
          </button>
          <button
            onClick={() => setActiveVisualizer('redundancy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeVisualizer === 'redundancy'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Storage Redundancy
          </button>
        </div>
      </div>

      {/* VISUALIZER 1: SHARED RESPONSIBILITY MODEL */}
      {activeVisualizer === 'shared-responsibility' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                Domain 1: Cloud Concepts
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Shared Responsibility Model Interactive Simulator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch service models to see how operational duties transfer from you to Microsoft.
              </p>
            </div>

            {/* Model Selector Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setSelectedServiceMode('on-prem')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedServiceMode === 'on-prem' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                On-Premises
              </button>
              <button
                onClick={() => setSelectedServiceMode('iaas')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedServiceMode === 'iaas' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                IaaS (VMs)
              </button>
              <button
                onClick={() => setSelectedServiceMode('paas')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedServiceMode === 'paas' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                PaaS (App Service)
              </button>
              <button
                onClick={() => setSelectedServiceMode('saas')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedServiceMode === 'saas' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                SaaS (M365)
              </button>
            </div>
          </div>

          {/* Interactive Stack Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-2">
              {layers.map((layer) => {
                const owner = layer.status[selectedServiceMode];
                const meta = getOwnerLabel(owner);
                const isSelected = selectedLayer === layer.id;

                return (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer.id)}
                    className={`w-full p-3.5 rounded-xl border transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-sky-600 ring-2 ring-sky-600/20 bg-sky-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{layer.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{layer.desc}</div>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border shrink-0 ${meta.color}`}>
                      {owner === 'customer' ? 'Customer' : owner === 'microsoft' ? 'Microsoft' : 'Shared'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Explanatory Sidebar */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
                  <Info className="w-4 h-4 text-sky-600" />
                  <span>Exam Rule of Thumb</span>
                </div>

                <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-sky-800">Always Customer:</span>
                    <p className="mt-0.5 text-slate-600">
                      Your Data, User Accounts, and Endpoints are ALWAYS your responsibility, even in SaaS.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-indigo-800">Always Microsoft:</span>
                    <p className="mt-0.5 text-slate-600">
                      Physical datacenter facilities, physical servers, and cooling are ALWAYS Microsoft&apos;s responsibility in the cloud.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-amber-800">The Pivot (OS & Middleware):</span>
                    <p className="mt-0.5 text-slate-600">
                      In IaaS, you patch the OS. In PaaS, Microsoft patches the OS so you only deploy application code!
                    </p>
                  </div>
                </div>
              </div>

              {selectedLayer && (
                <div className="p-3 bg-sky-100/70 rounded-lg text-xs text-sky-950 border border-sky-200 animate-in fade-in">
                  <div className="font-bold mb-1">
                    {layers.find((l) => l.id === selectedLayer)?.name}:
                  </div>
                  <p>{layers.find((l) => l.id === selectedLayer)?.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VISUALIZER 2: AZURE RESOURCE HIERARCHY */}
      {activeVisualizer === 'hierarchy' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Domain 2: Azure Architecture & Services
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              The 4-Tier Management Hierarchy
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Access permissions and Azure Policies automatically inherit downward from top to bottom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <button
              onClick={() => setSelectedHierarchyLevel('mg')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedHierarchyLevel === 'mg'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] font-bold text-indigo-600 uppercase">Tier 1 (Highest)</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">Management Groups</div>
              <div className="text-xs text-slate-500 mt-1">
                Governs multiple subscriptions across organization
              </div>
            </button>

            <button
              onClick={() => setSelectedHierarchyLevel('sub')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedHierarchyLevel === 'sub'
                  ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] font-bold text-blue-600 uppercase">Tier 2</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">Subscriptions</div>
              <div className="text-xs text-slate-500 mt-1">
                Unit of billing and primary management boundary
              </div>
            </button>

            <button
              onClick={() => setSelectedHierarchyLevel('rg')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedHierarchyLevel === 'rg'
                  ? 'border-sky-600 bg-sky-50/70 ring-2 ring-sky-600/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] font-bold text-sky-600 uppercase">Tier 3</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">Resource Groups</div>
              <div className="text-xs text-slate-500 mt-1">
                Lifecycle container grouping related resources
              </div>
            </button>

            <button
              onClick={() => setSelectedHierarchyLevel('res')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedHierarchyLevel === 'res'
                  ? 'border-slate-800 bg-slate-100 ring-2 ring-slate-800/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-500 uppercase">Tier 4 (Base)</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">Individual Resources</div>
              <div className="text-xs text-slate-500 mt-1">
                VMs, Storage Accounts, SQL Databases, VNets
              </div>
            </button>
          </div>

          {/* Hierarchy Details Card */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
            {selectedHierarchyLevel === 'mg' && (
              <>
                <div className="text-sm font-bold text-indigo-900">Tier 1: Management Groups</div>
                <p>
                  Management groups provide governance at enterprise scale. If you apply an Azure Policy or RBAC role (e.g., &ldquo;Only allow deployments in West Europe&rdquo;) at the Management Group level, it automatically inherits downward to all subscriptions and resource groups below it.
                </p>
                <div className="font-semibold text-slate-900 mt-2">Exam Tip:</div>
                <p>A root management group is built into every Azure directory; up to 10,000 management groups can be organized in a flexible tree up to 6 levels deep.</p>
              </>
            )}

            {selectedHierarchyLevel === 'sub' && (
              <>
                <div className="text-sm font-bold text-blue-900">Tier 2: Subscriptions</div>
                <p>
                  A subscription links individual resources to an Azure account and payment instrument. It serves as both a billing boundary (e.g., separating Dev and Prod invoices) and an access control boundary.
                </p>
                <div className="font-semibold text-slate-900 mt-2">Exam Tip:</div>
                <p>An Azure account can have multiple subscriptions, but each subscription is linked to only one account.</p>
              </>
            )}

            {selectedHierarchyLevel === 'rg' && (
              <>
                <div className="text-sm font-bold text-sky-900">Tier 3: Resource Groups</div>
                <p>
                  A logical container holding related Azure assets deployed together for a specific workload. Every resource must belong to exactly one resource group. If you delete the resource group, all resources inside it are deleted together.
                </p>
                <div className="font-semibold text-slate-900 mt-2">Exam Tip:</div>
                <p>Resources inside a resource group do NOT have to be in the same geographic region as the resource group itself.</p>
              </>
            )}

            {selectedHierarchyLevel === 'res' && (
              <>
                <div className="text-sm font-bold text-slate-900">Tier 4: Resources</div>
                <p>
                  Instances of services created in Azure, such as an Azure VM, Storage Account, Azure Virtual Network, or Azure SQL Database.
                </p>
                <div className="font-semibold text-slate-900 mt-2">Exam Tip:</div>
                <p>You can move resources from one resource group or subscription to another without needing to rebuild them.</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* VISUALIZER 3: STORAGE REDUNDANCY TIERS */}
      {activeVisualizer === 'redundancy' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Domain 2: Azure Storage
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Storage Redundancy & Disaster Recovery Comparison
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare replication across datacenters, availability zones, and paired regions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'lrs', name: 'LRS', label: 'Locally Redundant', copies: '3 copies', dur: '11 9s' },
              { id: 'zrs', name: 'ZRS', label: 'Zone-Redundant', copies: '3 zones', dur: '12 9s' },
              { id: 'grs', name: 'GRS', label: 'Geo-Redundant', copies: '6 copies', dur: '16 9s' },
              { id: 'gzrs', name: 'GZRS', label: 'Geo-Zone-Redundant', copies: 'Zones + Geo', dur: '16 9s' },
            ].map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedRedundancy(tier.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedRedundancy === tier.id
                    ? 'border-sky-600 bg-sky-50/70 ring-2 ring-sky-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-bold text-slate-900">{tier.name}</div>
                <div className="text-[11px] text-slate-500">{tier.label}</div>
                <div className="text-[10px] text-sky-700 font-bold mt-2 bg-sky-100/60 px-1.5 py-0.5 rounded inline-block">
                  Durability: {tier.dur}
                </div>
              </button>
            ))}
          </div>

          {/* Visual Diagram Representation */}
          <div className="p-6 bg-slate-950 text-white rounded-xl space-y-4">
            {selectedRedundancy === 'lrs' && (
              <div>
                <div className="text-sm font-bold text-sky-400 mb-1">
                  Locally Redundant Storage (LRS)
                </div>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Replicates data 3 times synchronously within a <strong>single physical datacenter</strong> in the primary region. Protects against hardware disk failures, but vulnerable if the entire datacenter floods or catches fire.
                </p>
                <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <Building2 className="w-8 h-8 text-sky-400 shrink-0" />
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-white">Single Datacenter (Primary Region)</div>
                    <div className="text-slate-400">Copy 1 · Copy 2 · Copy 3 (Synchronous)</div>
                  </div>
                </div>
              </div>
            )}

            {selectedRedundancy === 'zrs' && (
              <div>
                <div className="text-sm font-bold text-emerald-400 mb-1">
                  Zone-Redundant Storage (ZRS)
                </div>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Replicates data synchronously across <strong>3 separate Availability Zones</strong> within the same region. If one datacenter loses power or internet connectivity, your data remains fully operational in the other zones.
                </p>
                <div className="grid grid-cols-3 gap-2 bg-slate-900 p-4 rounded-lg border border-slate-800 text-center text-xs">
                  <div className="p-2 bg-slate-800 rounded border border-slate-700">
                    <div className="font-bold text-emerald-400">Zone 1</div>
                    <div className="text-[10px] text-slate-400">Copy 1</div>
                  </div>
                  <div className="p-2 bg-slate-800 rounded border border-slate-700">
                    <div className="font-bold text-emerald-400">Zone 2</div>
                    <div className="text-[10px] text-slate-400">Copy 2</div>
                  </div>
                  <div className="p-2 bg-slate-800 rounded border border-slate-700">
                    <div className="font-bold text-emerald-400">Zone 3</div>
                    <div className="text-[10px] text-slate-400">Copy 3</div>
                  </div>
                </div>
              </div>
            )}

            {selectedRedundancy === 'grs' && (
              <div>
                <div className="text-sm font-bold text-indigo-400 mb-1">
                  Geo-Redundant Storage (GRS)
                </div>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Uses LRS (3 copies) in the primary region, then replicates asynchronously to a <strong>secondary region pair (at least 300+ miles away)</strong> with another 3 copies. Safeguards against entire regional catastrophes.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="font-bold text-indigo-400">Primary Region (e.g., East US)</div>
                    <div className="text-[11px] text-slate-400 mt-1">3 Copies (LRS)</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="font-bold text-indigo-400">Secondary Region (West US 300+ mi)</div>
                    <div className="text-[11px] text-slate-400 mt-1">3 Copies (Asynchronous)</div>
                  </div>
                </div>
              </div>
            )}

            {selectedRedundancy === 'gzrs' && (
              <div>
                <div className="text-sm font-bold text-purple-400 mb-1">
                  Geo-Zone-Redundant Storage (GZRS)
                </div>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  The ultimate protection: replicates across <strong>3 Availability Zones</strong> in the primary region (ZRS), plus replicates asynchronously to a secondary paired region (LRS). Maximum resilience against both datacenter and regional failures.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="font-bold text-purple-400">Primary Region (ZRS)</div>
                    <div className="text-[11px] text-slate-400 mt-1">Zone 1 · Zone 2 · Zone 3</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="font-bold text-purple-400">Secondary Paired Region</div>
                    <div className="text-[11px] text-slate-400 mt-1">3 Copies in Paired Region</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
