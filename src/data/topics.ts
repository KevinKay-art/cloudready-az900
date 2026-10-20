import { StudyTopic } from '../types';

export const STUDY_TOPICS: StudyTopic[] = [
  // --- DOMAIN 1: CLOUD CONCEPTS ---
  {
    id: 'cloud-benefits',
    domainId: 'domain_1',
    title: 'Cloud Computing & Core Benefits',
    shortDescription: 'Why organizations migrate to the cloud and how scalability, elasticity, and high availability work.',
    readingTimeMinutes: 4,
    iconName: 'Cloud',
    fullExplanation: [
      'Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, and analytics—over the internet ("the cloud").',
      'High Availability (HA) ensures systems remain accessible and functional with minimal downtime, typically measured in 9s (e.g., 99.99%).',
      'Scalability is the ability to handle increased workload. Vertical scaling (scaling up) adds more RAM or CPU to an existing VM. Horizontal scaling (scaling out) adds more VM instances to distribute load.',
      'Elasticity is the ability to automatically grow or shrink computing resources in real time based on demand spikes, preventing over-provisioning and saving money.',
      'Disability & Disaster Recovery (DR) ensures business continuity and data replication in the event of an infrastructure catastrophe or regional disruption.',
    ],
    realWorldExample:
      'An e-commerce retailer experiences 10x traffic during Black Friday. With elasticity, additional web servers spin up automatically at midnight and de-provision on Saturday morning, so the company pays only for what was consumed.',
    keyTerms: [
      { term: 'High Availability (HA)', definition: 'Sustained uptime without interruption, even if hardware components fail.' },
      { term: 'Scalability', definition: 'The capacity to expand resources as workload grows (up or out).' },
      { term: 'Elasticity', definition: 'Automatic real-time scaling out and scaling in to match fluctuating demand.' },
      { term: 'Agility', definition: 'The speed with which new applications and environments can be provisioned and deployed.' },
    ],
    commonMisconception: {
      trap: 'Scalability and elasticity mean the exact same thing.',
      reality: 'Scalability is the structural ability to accommodate larger workloads. Elasticity is the dynamic, automated scaling up/down and out/in based on immediate demand.',
    },
    recapPoints: [
      'High availability minimises downtime.',
      'Scale up = bigger server; scale out = more servers.',
      'Elasticity matches resources to real-time spikes and dips.',
      'Agility allows rapid release cycles and experimentation.',
    ],
  },
  {
    id: 'cloud-models',
    domainId: 'domain_1',
    title: 'Public, Private, and Hybrid Cloud',
    shortDescription: 'Understand the three deployment models and their ownership, security, and cost trade-offs.',
    readingTimeMinutes: 4,
    iconName: 'Server',
    fullExplanation: [
      'Public Cloud is owned and operated by a third-party cloud service provider (like Microsoft Azure). Computing resources are delivered over the public internet and shared across multi-tenant hardware, though tenant data remains isolated.',
      'Private Cloud is dedicated exclusively to one single organisation. It can be hosted in an on-premises datacenter or by a third party. The organization is responsible for purchasing and maintaining hardware.',
      'Hybrid Cloud combines public cloud and on-premises/private cloud infrastructure, allowing data and applications to be shared between them with consistent management.',
      'Multi-cloud uses services from two or more distinct public cloud providers (e.g., Azure + AWS) to avoid vendor lock-in.',
    ],
    realWorldExample:
      'A hospital keeps sensitive patient medical records in a private on-premises datacenter for regulatory compliance, but runs its public appointment scheduling web app on Azure public cloud. This combination is a hybrid cloud.',
    keyTerms: [
      { term: 'Public Cloud', definition: 'Provider owns all physical hardware; multi-tenant infrastructure; no capital hardware cost.' },
      { term: 'Private Cloud', definition: 'Single-tenant infrastructure; the customer owns or leases and manages the underlying hardware.' },
      { term: 'Hybrid Cloud', definition: 'Bridges private/on-premises environments with public cloud services.' },
    ],
    commonMisconception: {
      trap: 'A private cloud is simply any server room with internet access.',
      reality: 'A true private cloud provides cloud-like self-service, virtualization, automated provisioning, and elasticity within dedicated hardware.',
    },
    recapPoints: [
      'Public cloud: No hardware purchases, near-limitless scale, multi-tenant.',
      'Private cloud: Total control, single tenant, highest CapEx.',
      'Hybrid cloud: Maximum flexibility, combining legacy compliance with public cloud agility.',
    ],
  },
  {
    id: 'service-models-shared-responsibility',
    domainId: 'domain_1',
    title: 'IaaS, PaaS, SaaS & Shared Responsibility',
    shortDescription: 'How responsibility shifts between you and Microsoft across the three cloud service models.',
    readingTimeMinutes: 5,
    iconName: 'Layers',
    fullExplanation: [
      'Infrastructure as a Service (IaaS): Microsoft provides physical datacenter, cooling, network, and hypervisor. You rent virtual machines and manage the OS, runtime, patches, middleware, and applications.',
      'Platform as a Service (PaaS): Microsoft manages the operating system, OS patching, hardware, and runtime. You focus solely on your application code and database configuration (e.g., Azure App Service, Azure SQL Database).',
      'Software as a Service (SaaS): Complete ready-to-use software delivered over the web (e.g., Microsoft 365, OneDrive). The provider handles all infrastructure, patching, and code; you only configure user access and data.',
      'The Shared Responsibility Model clearly defines who secures what. Regardless of the service model, YOU are ALWAYS responsible for your data, user identity, and endpoint devices. Microsoft is ALWAYS responsible for physical security and physical datacenter hardware.',
    ],
    realWorldExample:
      'Think of transportation: IaaS is leasing a car (you drive, refuel, and park it). PaaS is hailing a taxi (driver manages the car, you just choose the destination). SaaS is riding a train (scheduled route, zero vehicle maintenance).',
    keyTerms: [
      { term: 'IaaS', definition: 'Infrastructure as a Service (e.g., Azure Virtual Machines, Virtual Networks).' },
      { term: 'PaaS', definition: 'Platform as a Service (e.g., Azure App Service, Azure Functions).' },
      { term: 'SaaS', definition: 'Software as a Service (e.g., Microsoft 365, Teams).' },
      { term: 'Shared Responsibility', definition: 'Security boundary framework dividing duties between cloud provider and customer.' },
    ],
    commonMisconception: {
      trap: 'When you choose PaaS or SaaS, Microsoft handles your data backups, user passwords, and compliance.',
      reality: 'In every cloud model (even SaaS), information, data governance, and user accounts remain the customer\'s responsibility.',
    },
    recapPoints: [
      'IaaS gives maximum control; you patch the OS.',
      'PaaS frees you from OS management; you focus on code.',
      'SaaS is complete software ready to consume.',
      'Customer always owns data, endpoints, and identity.',
    ],
  },
  {
    id: 'cloud-economics',
    domainId: 'domain_1',
    title: 'CapEx vs. OpEx & Consumption-Based Pricing',
    shortDescription: 'Financial principles of cloud adoption: upfront capital costs versus operational pay-as-you-go expenditure.',
    readingTimeMinutes: 4,
    iconName: 'DollarSign',
    fullExplanation: [
      'Capital Expenditure (CapEx) is the upfront spending of money on physical infrastructure (buying servers, storage arrays, network switches, cooling equipment, and server rooms). CapEx has high initial cost and deducts over time (depreciation).',
      'Operational Expenditure (OpEx) is spending money on services or products as you use them. There are no upfront hardware costs; expenses are deducted on tax returns in the same year they are incurred.',
      'The cloud operates primarily on an OpEx model with Consumption-Based Pricing: you pay only for the exact compute, memory, and storage hours consumed.',
      'Benefits of consumption pricing include: no upfront hardware commitment, predictable operational billing, ability to terminate unused resources immediately, and pay-per-second billing.',
    ],
    realWorldExample:
      'Buying an electric generator for your house is CapEx (heavy upfront cost + maintenance). Plugging into the municipal power grid and paying the monthly electric utility bill for kilowatt-hours consumed is OpEx.',
    keyTerms: [
      { term: 'CapEx', definition: 'Capital Expenditure: upfront one-off investment in physical equipment.' },
      { term: 'OpEx', definition: 'Operational Expenditure: continuous recurring costs for services actually used.' },
      { term: 'Consumption-Based Model', definition: 'Billing model where costs scale directly with consumption, with no minimum commitments.' },
    ],
    commonMisconception: {
      trap: 'Cloud is always cheaper than on-premises hardware in every single circumstance.',
      reality: 'Cloud provides flexibility and eliminates CapEx, but poorly governed or unmonitored resources running 24/7 without sizing optimization can lead to high OpEx.',
    },
    recapPoints: [
      'CapEx = upfront cash investment, physical assets, depreciation.',
      'OpEx = pay-as-you-go operational subscriptions, zero upfront hardware purchase.',
      'Cloud pricing is consumption-based: stop resources, stop paying.',
    ],
  },

  // --- DOMAIN 2: AZURE ARCHITECTURE AND SERVICES ---
  {
    id: 'azure-geography',
    domainId: 'domain_2',
    title: 'Regions, Availability Zones & Region Pairs',
    shortDescription: 'How Azure global physical infrastructure is partitioned for high availability and disaster recovery.',
    readingTimeMinutes: 5,
    iconName: 'Globe',
    fullExplanation: [
      'Azure Region: A geographical area containing one or more datacenters that are connected by a dedicated, low-latency network. Examples: East US, West Europe, Southeast Asia.',
      'Special Sovereign Regions: Isolated regions designed for specific government or regulatory needs (e.g., Azure Government, Azure China 21Vianet).',
      'Availability Zones (AZs): Physically separate datacenter locations within the same Azure region. Each zone has independent power, cooling, and networking. If one zone experiences a power outage, others in the region remain operational.',
      'Region Pairs: Each Azure region is paired with another region in the same geography (at least 300 miles apart) for disaster recovery. Microsoft prioritises regional pair updates sequentially to prevent simultaneous global disruptions.',
    ],
    realWorldExample:
      'Deploying three VM replicas across Availability Zone 1, 2, and 3 in East US protects your application if lightning strikes one datacenter. Replicating data to West US (East US region pair) protects against a statewide hurricane.',
    keyTerms: [
      { term: 'Region', definition: 'Geographic perimeter containing networked datacenters.' },
      { term: 'Availability Zone', definition: 'Physically separated datacenter within a region with isolated power/cooling.' },
      { term: 'Region Pair', definition: 'Two regions at least 300 miles apart within the same geography for disaster recovery.' },
    ],
    commonMisconception: {
      trap: 'Every single Azure region has Availability Zones.',
      reality: 'Not all regions support Availability Zones, although all primary regions do. Availability Zone availability varies by region.',
    },
    recapPoints: [
      'Regions contain datacenters connected via low latency.',
      'Availability Zones protect against datacenter failures within a region.',
      'Region Pairs protect against regional natural disasters 300+ miles away.',
    ],
  },
  {
    id: 'resource-hierarchy',
    domainId: 'domain_2',
    title: 'Management Groups, Subscriptions & Resource Groups',
    shortDescription: 'The four-tier hierarchy used to manage access, policies, and billing across Azure resources.',
    readingTimeMinutes: 4,
    iconName: 'FolderTree',
    fullExplanation: [
      'Azure organizes resources in four nested management levels:',
      '1. Management Groups (top): Containers that help you manage access, policy, and compliance across multiple subscriptions. Policies applied at a management group automatically inherit to all child subscriptions.',
      '2. Subscriptions: A logical unit of Azure services linked to an Azure account. Provides billing boundaries and access control boundaries.',
      '3. Resource Groups: Logical containers where related Azure resources (VMs, disks, virtual networks) are deployed and managed as a single unit. Every resource MUST belong to exactly one resource group.',
      '4. Resources: Individual instances of services you create (such as a Virtual Machine, Storage Account, or SQL Database).',
    ],
    realWorldExample:
      'An enterprise has a "Production" Management Group containing the "E-Commerce Subscription". Inside it sits the "rg-checkout" Resource Group containing a VM, an App Service, and a database.',
    keyTerms: [
      { term: 'Management Group', definition: 'Governs policies and compliance across multiple subscriptions.' },
      { term: 'Subscription', definition: 'Unit of management, billing, and access control boundary.' },
      { term: 'Resource Group', definition: 'Logical folder grouping lifecycle-dependent resources together.' },
    ],
    commonMisconception: {
      trap: 'A resource can belong to multiple resource groups at the same time.',
      reality: 'A resource can only belong to one resource group at any given time, although it can be moved between resource groups.',
    },
    recapPoints: [
      'Order: Management Groups → Subscriptions → Resource Groups → Resources.',
      'Policies and role permissions inherit downward from parent to child.',
      'Resource groups simplify lifecycle: deleting an RG deletes all resources inside it.',
    ],
  },
  {
    id: 'azure-compute-services',
    domainId: 'domain_2',
    title: 'Azure Compute: VMs, App Service, Functions & AVD',
    shortDescription: 'Compare virtual machines, serverless functions, container platforms, and Azure Virtual Desktop.',
    readingTimeMinutes: 5,
    iconName: 'Cpu',
    fullExplanation: [
      'Azure Virtual Machines (VMs): On-demand, scalable IaaS computing instances where you have full control over the OS, installed software, and configurations.',
      'Azure Virtual Machine Scale Sets: Manage and auto-scale identical groups of VMs horizontally to respond to changes in demand.',
      'Azure App Service: Fully managed PaaS hosting for web applications, RESTful APIs, and mobile backends without managing the underlying web server.',
      'Azure Functions: Event-driven serverless compute. Executes code in response to triggers (HTTP requests, database changes, timers) with zero infrastructure management and per-execution billing.',
      'Azure Container Instances (ACI) & Azure Kubernetes Service (AKS): ACI runs isolated containers quickly without managing servers. AKS provides production-grade orchestration and clustering for large containerized workloads.',
      'Azure Virtual Desktop (AVD): Cloud-based desktop and app virtualization providing remote Windows 10/11 desktops to users from any device.',
    ],
    realWorldExample:
      'A photo-sharing service runs its web front-end on Azure App Service (PaaS), uses Azure Functions (serverless) to automatically resize uploaded images whenever a file arrives in storage, and runs legacy processing tools on an Azure VM.',
    keyTerms: [
      { term: 'Virtual Machine (VM)', definition: 'IaaS computing power with complete operating system control.' },
      { term: 'App Service', definition: 'PaaS platform for deploying web applications and APIs quickly.' },
      { term: 'Azure Functions', definition: 'Serverless event-driven compute; runs code only when triggered.' },
      { term: 'Azure Virtual Desktop (AVD)', definition: 'Remote desktop and application virtualization in the cloud.' },
    ],
    commonMisconception: {
      trap: 'Serverless means there are no servers running your code.',
      reality: 'Servers exist, but Microsoft manages provisioning, scaling, OS patching, and availability. You only write the trigger and handler code.',
    },
    recapPoints: [
      'VM = full IaaS control.',
      'App Service = PaaS web hosting.',
      'Functions = event-driven serverless code.',
      'AVD = secure remote Windows desktop access anywhere.',
    ],
  },
  {
    id: 'azure-networking',
    domainId: 'domain_2',
    title: 'Azure Networking: VNets, Subnets, Gateways & ExpressRoute',
    shortDescription: 'Connect Azure resources securely with virtual networks, private communication, and hybrid connectivity.',
    readingTimeMinutes: 5,
    iconName: 'Network',
    fullExplanation: [
      'Azure Virtual Network (VNet): Enables Azure resources to securely communicate with each other, the internet, and on-premises networks. VNets provide isolated IP address blocks.',
      'Subnets: Allow you to segment the virtual network into one or more sub-networks for security and routing (e.g., public subnet for web, private subnet for database).',
      'VPN Gateway: Sends encrypted traffic across the public internet between an Azure virtual network and an on-premises location (Site-to-Site) or individual client device (Point-to-Site).',
      'Azure ExpressRoute: Creates a direct, private, dedicated connection between your on-premises datacenter and Azure. It does NOT travel over the public internet, offering higher speed, lower latency, and greater security than VPNs.',
      'Network Security Groups (NSGs): Act as virtual firewalls to filter network traffic to and from Azure resources based on 5-tuple security rules (source IP, source port, destination IP, destination port, protocol).',
    ],
    realWorldExample:
      'A multinational financial institution uses Azure ExpressRoute to stream high-frequency transaction data between their private datacenter and Azure without sending a single byte over the public internet.',
    keyTerms: [
      { term: 'Virtual Network (VNet)', definition: 'Fundamental building block for your private network in Azure.' },
      { term: 'Subnet', definition: 'A range of IP addresses within a VNet used to segment workloads.' },
      { term: 'VPN Gateway', definition: 'Encrypted cross-premises connection over the public internet.' },
      { term: 'ExpressRoute', definition: 'Dedicated private fiber connection bypassing the public internet.' },
    ],
    commonMisconception: {
      trap: 'ExpressRoute is an encrypted VPN connection over the internet.',
      reality: 'ExpressRoute is a private physical connection through a connectivity provider. It does not traverse the public internet at all.',
    },
    recapPoints: [
      'VNets isolate cloud resources in private IP spaces.',
      'Subnets separate tiers (web, business, data).',
      'VPN = encrypted tunnel over public internet.',
      'ExpressRoute = dedicated private connection with SLA.',
    ],
  },
  {
    id: 'azure-storage',
    domainId: 'domain_2',
    title: 'Azure Storage & Redundancy Options',
    shortDescription: 'Blob, File, Queue, Disk storage and redundancy tiers (LRS, ZRS, GRS, GZRS).',
    readingTimeMinutes: 5,
    iconName: 'Database',
    fullExplanation: [
      'Azure Storage Services:',
      '- Azure Blob Storage: Highly scalable object storage for unstructured data (images, videos, documents, backups). Offers Hot, Cool, Cold, and Archive access tiers.',
      '- Azure Files: Fully managed cloud file shares accessible via industry-standard SMB or NFS protocols.',
      '- Azure Disks: Block-level storage volumes for Azure VMs (OS and data disks).',
      '- Azure Queues: Messaging store for reliable communication between application components.',
      'Storage Redundancy Tiers:',
      '- Locally Redundant Storage (LRS): Replicates data 3 times within a single datacenter in the primary region. Protects against hardware drive failure.',
      '- Zone-Redundant Storage (ZRS): Replicates data synchronously across 3 Availability Zones in the primary region. Protects against datacenter loss.',
      '- Geo-Redundant Storage (GRS): Copies data synchronously 3 times in primary region (LRS), then copies asynchronously to a secondary paired region (300+ miles away).',
      '- Geo-Zone-Redundant Storage (GZRS): Combines high availability of ZRS in primary region with cross-region disaster recovery of GRS.',
    ],
    realWorldExample:
      'A hospital stores medical imaging scans accessed once every five years in the Azure Blob Archive tier (lowest storage cost). Historical patient records use GRS for disaster recovery compliance.',
    keyTerms: [
      { term: 'Blob Storage', definition: 'Object store for unstructured data, logs, media, and backups.' },
      { term: 'LRS', definition: '3 copies within a single datacenter.' },
      { term: 'ZRS', definition: '3 copies across separate availability zones in one region.' },
      { term: 'GRS', definition: 'Replication across paired regions for disaster recovery.' },
    ],
    commonMisconception: {
      trap: 'Data stored in the Blob Archive tier is instantly readable in milliseconds.',
      reality: 'Archive tier has the lowest storage cost, but retrieving data requires a rehydration process that can take hours.',
    },
    recapPoints: [
      'Blobs = files/objects; Files = SMB shares; Disks = VM drives.',
      'LRS is within one datacenter; ZRS spans zones.',
      'GRS protects against entire regional outages.',
    ],
  },
  {
    id: 'azure-identity',
    domainId: 'domain_2',
    title: 'Identity & Access: Microsoft Entra ID',
    shortDescription: 'Authentication, authorization, Multi-Factor Authentication (MFA), and Conditional Access.',
    readingTimeMinutes: 5,
    iconName: 'ShieldCheck',
    fullExplanation: [
      'Microsoft Entra ID (formerly Azure Active Directory) is Microsoft’s cloud-based identity and access management service. It manages users, groups, application access, and single sign-on (SSO).',
      'Authentication vs. Authorization:',
      '- Authentication (AuthN): Verifies WHO you are (e.g., entering username and password, biometric scan). Identity verification.',
      '- Authorization (AuthZ): Determines WHAT permissions you have and what resources you can access once authenticated (e.g., Role-Based Access Control).',
      'Multi-Factor Authentication (MFA): Requires two or more verification factors: something you know (password), something you have (phone/authenticator app), or something you are (fingerprint/face).',
      'Conditional Access: An "if-then" rule engine (e.g., "If user is signing in from an untrusted country, require MFA; if device is non-compliant, block access").',
      'Role-Based Access Control (RBAC): Fine-grained access management granting users only the specific permissions needed (Principle of Least Privilege).',
    ],
    realWorldExample:
      'When you unlock your office laptop with your PIN and a mobile authenticator push notification, that is Authentication (MFA). When Azure grants you "Contributor" rights on rg-marketing but "Reader" rights on rg-finance, that is Authorization (RBAC).',
    keyTerms: [
      { term: 'Microsoft Entra ID', definition: 'Cloud identity and access management service.' },
      { term: 'Authentication (AuthN)', definition: 'Verifies the identity of a person or service.' },
      { term: 'Authorization (AuthZ)', definition: 'Enforces permissions and access boundaries.' },
      { term: 'Conditional Access', definition: 'Policy engine evaluating signals (location, device, risk) before granting access.' },
    ],
    commonMisconception: {
      trap: 'Authentication and Authorization are interchangeable terms for logging in.',
      reality: 'AuthN establishes your identity; AuthZ dictates what you are allowed to view or modify after identity is confirmed.',
    },
    recapPoints: [
      'Entra ID manages identities and Single Sign-On.',
      'AuthN = who you are; AuthZ = what you can do.',
      'MFA requires 2+ independent authentication factors.',
      'RBAC enforces the principle of least privilege.',
    ],
  },

  // --- DOMAIN 3: AZURE MANAGEMENT AND GOVERNANCE ---
  {
    id: 'cost-management',
    domainId: 'domain_3',
    title: 'Cost Planning & Microsoft Cost Management',
    shortDescription: 'Pricing Calculator vs. TCO Calculator, spending budgets, cost alerts, and Azure Advisor.',
    readingTimeMinutes: 4,
    iconName: 'TrendingDown',
    fullExplanation: [
      'Azure Pricing Calculator: Estimates the expected hourly or monthly cost of deploying new Azure products and configurations BEFORE you build them.',
      'Total Cost of Ownership (TCO) Calculator: Compares the cost of running your workloads on-premises (hardware, electricity, cooling, server administrators) versus migrating to Microsoft Azure over 1 to 5 years.',
      'Microsoft Cost Management: A suite of tools to monitor, allocate, and optimize Azure spend. You can set monthly monetary budgets and automated alerts when spend reaches 80% or 100%.',
      'Azure Advisor: A personalized cloud consultant that analyzes your resource configurations and usage telemetry to provide proactive, actionable recommendations across 5 pillars: Cost, Security, Reliability, Performance, and Operational Excellence.',
    ],
    realWorldExample:
      'Before migrating an on-premises datacenter, a CFO uses the TCO Calculator to show the board that shifting to Azure will save $300,000 in hardware depreciation and datacenter cooling over three years.',
    keyTerms: [
      { term: 'Pricing Calculator', definition: 'Estimates projected costs of individual Azure services.' },
      { term: 'TCO Calculator', definition: 'Compares on-premises ownership costs vs. Azure migration.' },
      { term: 'Cost Management', definition: 'Tracks actual spending, enforces budgets, and triggers billing alerts.' },
      { term: 'Azure Advisor', definition: 'Automated engine providing cost-saving and optimization advice.' },
    ],
    commonMisconception: {
      trap: 'The TCO Calculator is used to estimate your next month\'s Azure cloud bill.',
      reality: 'The TCO Calculator is strictly for comparing on-prem costs with Azure migration. The Pricing Calculator is used for estimated Azure bills.',
    },
    recapPoints: [
      'Pricing Calculator = estimate new Azure services.',
      'TCO Calculator = compare on-prem vs. Azure migration.',
      'Cost Management = set real-time budgets and alerts.',
      'Azure Advisor = proactive optimization recommendations.',
    ],
  },
  {
    id: 'governance-monitoring',
    domainId: 'domain_3',
    title: 'Governance, Compliance & Azure Monitoring',
    shortDescription: 'Azure Policy, Resource Locks, Tags, Azure Monitor, Service Health vs. Resource Health & Azure Arc.',
    readingTimeMinutes: 5,
    iconName: 'ShieldAlert',
    fullExplanation: [
      'Azure Policy: Enforces organizational standards and assesses compliance at scale. Examples include preventing VMs from being deployed in unauthorized regions or enforcing SKU sizes.',
      'Resource Locks: Prevent accidental deletion or modification of critical Azure resources. Two types:',
      '- CanNotDelete: Authorized users can still read and modify the resource, but cannot delete it.',
      '- ReadOnly: Authorized users can read the resource, but cannot modify or delete it.',
      'Tags: Key-value metadata pairs attached to resources to organize billing, department ownership, and environment (e.g., Environment: Production, CostCenter: 1042).',
      'Azure Monitor: Comprehensive monitoring solution that collects metrics and telemetry logs across applications, operating systems, and Azure resources. Includes Log Analytics for querying data using Kusto Query Language (KQL).',
      'Azure Service Health vs. Resource Health:',
      '- Service Health notifies you about global or regional Azure service outages and planned maintenance.',
      '- Resource Health diagnoses health issues of your specific individual resource instances (e.g., why a particular VM stopped).',
      'Azure Arc: Extends Azure governance, management, and Azure services to servers, Kubernetes clusters, and databases located on-premises, edge, and in other clouds (AWS, GCP).',
    ],
    realWorldExample:
      'A compliance officer applies an Azure Policy mandating that all resources must reside in "West Europe" for GDPR. A "CanNotDelete" resource lock is placed on the core production SQL database to safeguard against accidental clicks.',
    keyTerms: [
      { term: 'Azure Policy', definition: 'Enforces operational guardrails and automatic compliance rules.' },
      { term: 'Resource Lock', definition: 'Protects resources from accidental deletion or modification.' },
      { term: 'Azure Monitor', definition: 'Unified monitoring, log collection, and alerting system.' },
      { term: 'Azure Arc', definition: 'Extends Azure management to non-Azure and on-premises environments.' },
    ],
    commonMisconception: {
      trap: 'A user with Owner role can delete a resource that has a CanNotDelete lock on it without removing the lock first.',
      reality: 'Resource locks take precedence over RBAC permissions; even subscription Owners must first remove the lock before deleting the resource.',
    },
    recapPoints: [
      'Azure Policy enforces compliance and prevents invalid deployments.',
      'Locks prevent accidental deletion (CanNotDelete / ReadOnly).',
      'Service Health = regional Azure status; Resource Health = your specific resource.',
      'Azure Arc bridges hybrid servers into the Azure Resource Manager.',
    ],
  },
];
