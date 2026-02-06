export interface Topic {
    code: string;
    title: string;
    content: string;
    outcome?: string;
    activity?: string;
    assessment?: string;
    owner?: string;
    links?: { label: string; url: string }[];
}

export interface Module {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    topics: Topic[];
    type: 'module' | 'resource' | 'checklist' | 'pre-joining';
    progress: number;
    status: 'Available' | 'In Progress' | 'Locked' | 'Pending';
    hasAssignment: boolean;
}

export const syllabusData: Module[] = [
    {
        id: 'pre-joining',
        title: 'Pre-Joining Module',
        subtitle: 'Foundation Building',
        description: 'Essential training to be completed before your first day.',
        type: 'pre-joining',
        progress: 0,
        status: 'Available',
        hasAssignment: true,
        topics: [
            { code: 'PJ-01', title: 'Product Training - Program Overview', content: 'Understand all BN programs, pricing, and features', outcome: 'Understanding', assessment: 'Oral Test', links: [{ label: 'Video', url: 'https://drive.google.com/file/d/18SQMmnz4riJ17d--GWEvVuvaLQ9iuzKy/view?usp=sharing' }] },
            { code: 'PJ-02', title: 'Website Deep Dive', content: 'Navigate website, understand user journey, locate resources', outcome: 'Navigation Mastery', links: [{ label: 'Website', url: 'https://www.balancenutrition.in/' }] },
            { code: 'PJ-03', title: 'Social Media Orientation', content: 'Understand brand voice and community engagement', outcome: 'Brand Awareness', links: [{ label: 'Instagram', url: 'https://www.instagram.com/balancenutrition.in' }] },
            { code: 'PJ-04', title: 'Founder Briefing', content: "Know founder's vision, brand story, and credibility", outcome: 'Vision Alignment', links: [{ label: 'Meet Khyati', url: 'https://www.balancenutrition.in/meet-khyati-for-online-weight-loss-programs' }] },
            { code: 'PJ-05', title: 'Brand Recognition & Media', content: 'Understand brand positioning, awards, and PR coverage', links: [{ label: 'Media Gallery', url: 'https://www.balancenutrition.in/media-gallery' }] },
            { code: 'PJ-06', title: 'Health Score Practical', content: 'Understand lead generation tool and analysis', assessment: 'Submit Reports' },
            { code: 'PJ-07', title: 'Program Deep Dive', content: 'Master program details, customer profiles, and pricing', assessment: 'Oral Test' }
        ]
    },
    {
        id: 'module-1',
        title: 'Module 1: Business Overview',
        subtitle: 'Understanding the Ecosystem',
        description: 'Day 1 - Focus on brand immersion and the business landscape.',
        type: 'module',
        progress: 0,
        status: 'Available',
        hasAssignment: true,
        topics: [
            { code: 'M1-01', title: 'How We Work', content: 'Understand client journey from purchase to completion', owner: 'Self' },
            { code: 'M1-02', title: 'Founder AMA Session', content: 'Q&A on business, programs, and market positioning', owner: 'Founders' },
            { code: 'M1-03', title: 'Peer Assessment Study', content: 'Create 3 competitor profiles + 3 BN peer profiles', assessment: 'Submit Peer Assessment Sheet' },
            { code: 'M1-04', title: 'Competitor Analysis', content: 'Research HealthifyMe, SugarFit, Fitelo, Veera Health, etc.' },
            { code: 'M1-05', title: 'Brand Assets & Social Media', content: 'Follow LinkedIn, YouTube, Pinterest, Twitter handles' },
            { code: 'M1-06', title: 'Website & Blog Mastery', content: 'Review cuisines, supplements, and health guides', links: [{ label: 'Recipes', url: 'https://www.balancenutrition.in/recipes' }] }
        ]
    },
    {
        id: 'module-2',
        title: 'Module 2: Program Mastery',
        subtitle: 'Product Expertise',
        description: 'In-depth training on PRRS and program specifications.',
        type: 'module',
        progress: 0,
        status: 'Available',
        hasAssignment: true,
        topics: [
            { code: 'M2-01', title: 'PRRS Document', content: 'Program Re-engineering Repositioning Strategy', owner: 'Krishna' },
            { code: 'M2-02', title: 'BN Program Training Video', content: 'Comprehensive program features, benefits, pricing' },
            { code: 'M2-03', title: 'Phase 1 Programs', content: 'Weight Loss Pro, Plus, PCOS, Slim Smart 30' },
            { code: 'M2-04', title: 'Phase 2 Programs', content: 'Renue, Body Transformation, Plateau Breaker, Intermittent Fasting' },
            { code: 'M2-05', title: 'Cleanse Programs', content: '1-Day, 3-Day, 10-Day, and 14-Day specialized plans' },
            { code: 'M2-06', title: 'App Transaction Flow', content: 'Understand client app flow and transaction process', owner: 'Jitendra' },
            { code: 'M2-07', title: 'E-Kit Training', content: 'Daily Essentials, Portion Guide, Alcohol & Restaurant Guides' }
        ]
    },
    {
        id: 'module-3',
        title: 'Module 3: Consultation & Sales',
        subtitle: 'The Art of Conversion',
        description: 'Day 2 - Mastering the sales process and consultation calls.',
        type: 'module',
        progress: 0,
        status: 'Available',
        hasAssignment: true,
        topics: [
            { code: 'M3-01', title: 'Consultation Call Recordings', content: 'Listen to expert consultations, note objection handling', owner: 'Krishna' },
            { code: 'M3-02', title: 'Case Stories', content: 'Study success stories and transformation journeys' },
            { code: 'M3-03', title: 'Program Pitching', content: 'Learn structured pitching methodology', owner: 'Krishna' },
            { code: 'M3-04', title: 'Day-to-Day Engagement', content: 'WhatsApp communication and follow-up strategies' }
        ]
    },
    {
        id: 'module-4',
        title: 'Module 4: Operations',
        subtitle: 'Client Onboarding',
        description: 'Day 3 - Post-sale process and onboarding flow.',
        type: 'module',
        progress: 0,
        status: 'Available',
        hasAssignment: true,
        topics: [
            { code: 'M4-01', title: 'Mock Consultation Practice', content: 'Live Mock Calls (12 PM - 3 PM)', owner: 'HR Assigned' },
            { code: 'M4-02', title: 'Client App Journey', content: 'Shadow consultation and understand app flow' },
            { code: 'M4-03', title: 'Payment Processing', content: 'Razorpay and PayPal training', owner: 'Abdul' }
        ]
    },
    {
        id: 'module-5',
        title: 'Module 5: CRM Training',
        subtitle: 'Technical Proficiency',
        description: 'Day 4 - Mastering the Counsellor Dashboard.',
        type: 'module',
        progress: 0,
        status: 'Available',
        hasAssignment: true,
        topics: [
            { code: 'M5-01', title: 'Counsellor Dashboard', content: 'Lead management and client tracking', owner: 'Krishna' },
            { code: 'M5-02', title: 'InBody BCA Analysis', content: 'Body composition report interpretation', owner: 'Abdul' }
        ]
    },
    {
        id: 'module-6',
        title: 'Module 6: Lead Management',
        subtitle: 'Digital Presence',
        description: 'Day 5 - Social media and lead allocation protocols.',
        type: 'module',
        progress: 0,
        status: 'Available',
        hasAssignment: true,
        topics: [
            { code: 'M6-01', title: 'Social Media Deep Dive', content: 'Content strategy and identification of leads' },
            { code: 'M6-02', title: 'Lead Allocation Protocol', content: 'Allocation criteria and claim process' }
        ]
    },
    {
        id: 'resource-bank',
        title: 'Resource Bank',
        subtitle: 'Reference Materials',
        description: 'Archive of training videos and manuals.',
        type: 'resource',
        progress: 100,
        status: 'Available',
        hasAssignment: false,
        topics: [
            { code: 'RB-01', title: 'Sales Training Archive Day 1', content: 'Historical sales methodology - Part 1', links: [{ label: 'Watch Part 1', url: 'https://youtu.be/c_8Hkg5U3I0' }] },
            { code: 'RB-02', title: 'Sales Training Archive Day 2', content: 'Historical sales methodology - Day 2', links: [{ label: 'Watch', url: 'https://youtu.be/lmRXwJgQOqk' }] },
            { code: 'RB-03', title: 'Founder Video Series', content: 'Khyati Ma’am’s Thought Leadership series' },
            { code: 'RB-04', title: '3T Manual', content: 'Core training methodology document' }
        ]
    },
    {
        id: 'training-checklist',
        title: 'Training Checklist',
        subtitle: 'Day-wise tracking',
        description: 'Checklist of daily activities and submissions.',
        type: 'checklist',
        progress: 10,
        status: 'Available',
        hasAssignment: false,
        topics: [
            { code: 'TC-00', title: 'Day 0 (Pre-Joining)', content: 'Share Training Sheet, Explain Peer Assessment, EOD Report Instructions' },
            { code: 'TC-01', title: 'Day 1 Tasks', content: 'Summary Mail + Peer Assessment, AMA with Founders, Business Overview' },
            { code: 'TC-02', title: 'Day 2 Tasks', content: 'Program Viva (11 AM-12 PM), Post-Viva Feedback, Peer Assessment Submission' },
            { code: 'TC-03', title: 'Day 3 Tasks', content: 'Mock Calls, Dashboard Doubt Solving' }
        ]
    },
    {
        id: 'joining-checklist',
        title: 'Joining Checklist (Admin)',
        subtitle: 'Onboarding Tasks',
        description: 'Administrative tasks for new joiners.',
        type: 'checklist',
        progress: 0,
        status: 'Available',
        hasAssignment: false,
        topics: [
            { code: 'JC-01', title: 'Email ID Creation', content: 'Official Balance Nutrition Email' },
            { code: 'JC-02', title: 'CRM ID Creation', content: 'Counsellor Dashboard access' },
            { code: 'JC-03', title: 'Asset Allocation', content: 'SIM Card, Phone, and WFH assets' },
            { code: 'JC-04', title: 'Professional Photo', content: 'For Digital ID Card and CRM profile' }
        ]
    }
];
