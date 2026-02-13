export interface Topic {
    code: string;
    title: string;
    content: string;
    outcome?: string;
    activity?: string;
    assessment?: string;
    owner?: string;
    icon?: string;
    links?: { label: string; url: string }[];
}

export interface Module {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    topics: Topic[];
    type: 'module' | 'resource' | 'checklist' | 'pre-joining' | 'segment';
    progress: number;
    status: 'Available' | 'In Progress' | 'Locked' | 'Pending';
    hasAssignment: boolean;
    icon?: string;
}

export const syllabusData: Module[] = [
    // ===== SEGMENT 1: Business Overview & Brand Immersion =====
    {
        id: 'segment-1',
        title: 'Segment 1: Business Overview',
        subtitle: 'How We Work, Founder Briefing & Brand Recognition',
        description: 'Understanding our business, programs, and brand journey. Includes competitor study and peer assessments.',
        type: 'segment',
        progress: 0,
        status: 'Available',
        hasAssignment: true,
        icon: 'business',
        topics: [
            {
                code: 'S1-01',
                title: 'How We Work',
                content: 'Understand client journey from purchase to completion - complete business workflow',
                links: [{ label: 'How We Work Video', url: '#' }]
            },
            {
                code: 'S1-02',
                title: 'Meet Our Founder - Khyati Ma\'am',
                content: 'Watch the founder introduction video',
                links: [{ label: 'Khyati Ma\'am Video', url: '#' }]
            },
            {
                code: 'S1-03',
                title: 'Khyati Ma\'am\'s Journey',
                content: 'Understand the founder\'s journey and vision',
                links: [{ label: 'Journey Video', url: '#' }]
            },
            {
                code: 'S1-04',
                title: 'Founder Video Series',
                content: 'Go through Khyati Ma\'am\'s complete YouTube video series',
                links: [{ label: 'YouTube Series', url: '#' }]
            },
            {
                code: 'S1-05',
                title: 'Brand Recognition',
                content: 'Understand how Balance Nutrition is recognized in the industry',
                links: [{ label: 'Brand Recognition', url: '#' }]
            },
            {
                code: 'S1-06',
                title: 'Vision of the Brand',
                content: 'Learn about the brand vision and long-term goals',
                links: [{ label: 'Vision Video', url: '#' }]
            },
            {
                code: 'S1-07',
                title: 'Award by Times Now',
                content: 'Balance Nutrition award recognition and media coverage',
                links: [{ label: 'Award Video', url: '#' }]
            },
            {
                code: 'S1-08',
                title: 'Vishal Sir BTVI Interview',
                content: 'Watch the BTVI interview with Vishal Sir',
                links: [{ label: 'BTVI Interview', url: '#' }]
            }
        ]
    },
    {
        id: 'website-deep-dive',
        title: 'Website & Blog Mastery',
        subtitle: '',
        description: 'Read about the website in detail, go through all programs, recipes, cuisines, supplements, and health blogs, Tips for acidity, bloating, cold and flu, constipation, migraine, diabetes, wedding guide, party binge, thyroid, PCOS, benefits of neutraceuticals, Benefits of seeds.',
        type: 'segment',
        progress: 0,
        status: 'Available',
        hasAssignment: false,
        topics: [
            {
                code: 'WEB-01',
                title: 'Website Overview',
                content: 'Navigate the complete Balance Nutrition website and understand the user journey',
                links: [{ label: 'Website', url: 'https://www.balancenutrition.in/' }]
            },
            {
                code: 'WEB-02',
                title: 'Recipes Section',
                content: 'Explore different cuisines, supplements, drinks, breakfast options, and galactogogues',
                links: [{ label: 'Recipes', url: 'https://www.balancenutrition.in/recipes' }]
            },
            {
                code: 'WEB-03',
                title: 'Health Blogs',
                content: 'Read tips for acidity, bloating, cold & flu, constipation, migraine, diabetes, wedding guide, party binge, thyroid, PCOS, benefits of nutraceuticals, benefits of seeds',
                links: [{ label: 'Health Reads', url: 'https://www.balancenutrition.in/blog/health-reads' }]
            }
        ]
    },
    {
        id: 'social-media-handles',
        title: 'Follow Our Social Media Handles',
        subtitle: 'Stay Connected with the BN Community',
        description: 'Follow all official social media handles to stay updated with the latest clinical insights.',
        type: 'segment',
        progress: 0,
        status: 'Available',
        hasAssignment: false,
        icon: 'social',
        topics: [
            { code: 'SM-01', title: 'Khyati Instagram', content: 'Follow Khyati Ma\'am on Instagram', links: [{ label: 'Khyati Instagram', url: '#' }] },
            { code: 'SM-02', title: 'Balance Nutrition Instagram', content: 'Follow the official BN Instagram page', links: [{ label: 'BN Instagram', url: '#' }] },
            { code: 'SM-03', title: 'Balance Nutrition LinkedIn', content: 'Connect on LinkedIn for professional updates', links: [{ label: 'BN LinkedIn', url: '#' }] },
            { code: 'SM-04', title: 'Khyati LinkedIn', content: 'Connect with Khyati Ma\'am on LinkedIn', links: [{ label: 'Khyati LinkedIn', url: '#' }] },
            { code: 'SM-05', title: 'Vishal Sir LinkedIn', content: 'Connect with Vishal Sir on LinkedIn', links: [{ label: 'Vishal LinkedIn', url: '#' }] },
            { code: 'SM-06', title: 'YouTube', content: 'Subscribe to the official YouTube channel', links: [{ label: 'YouTube', url: '#' }] },
            { code: 'SM-07', title: 'Pinterest', content: 'Follow on Pinterest for visual content', links: [{ label: 'Pinterest', url: '#' }] },
            { code: 'SM-08', title: 'Twitter', content: 'Follow on Twitter for quick updates', links: [{ label: 'Twitter', url: '#' }] }
        ]
    },
    {
        id: 'competitor-study',
        title: 'Competitor Study',
        subtitle: 'Market Research & Peer Assessment',
        description: 'Research competitors and complete peer assessment study.',
        type: 'segment',
        progress: 0,
        status: 'Available',
        hasAssignment: true,
        topics: [
            {
                code: 'CS-01',
                title: 'BN Competitors Research',
                content: 'Conduct a thorough analysis of our primary competitors. Focus on their social media presence, program offerings, and unique selling points:<br/><br/>• <strong>HealthifyMe</strong>: Analyze their AI-driven approach and user engagement.<br/>• <strong>SugarFit</strong>: Study their diabetes reversal programs and technology integration.<br/>• <strong>Fitelo</strong>: Review their personalized diet plans and customer testimonials.',
                assessment: 'Submit competitor analysis'
            },
            {
                code: 'CS-02',
                title: "Khyati Ma'am's Competitors",
                content: "Research the personal brands of key industry figures. Observe their content style, audience interaction, and topics covered:<br/><br/>• <strong>Anjali Mukherjee</strong><br/>• <strong>Rashi Chaudhary</strong><br/>• <strong>Nisha Malhotra</strong><br/>• <strong>Gunjan Shouts</strong><br/>• <strong>Neha Ranglani</strong><br/>• <strong>Richa Gangani</strong>",
                assessment: 'Submit competitor profiles'
            },
            {
                code: 'CS-03',
                title: 'Peer Assessment Study',
                content: 'Engage in a practical peer assessment exercise to understand market positioning:<br/><br/>• <strong>Competitor Profiles</strong>: Create detailed profiles for 3 different competitors.<br/>• <strong>BN Peer Profiles</strong>: Create profiles for 3 Balance Nutrition peers.<br/>• <strong>Comparison</strong>: Analyze differences in approach and service delivery.',
                assessment: 'Submit Peer Assessment Sheet'
            }
        ]
    },

    // ===== SEGMENT 2: Program Training =====
    {
        id: 'segment-2',
        title: 'Segment 2: Program Training',
        subtitle: 'Explanation given about the different programs (Learn the features of program, rates should be remembered, what is speciality of each program-Details understanding about phase 2 programs)',
        description: 'Learn features of each program, rates, and speciality. Detailed understanding about Phase 1 and Phase 2 programs.',
        type: 'segment',
        progress: 0,
        status: 'Available',
        hasAssignment: true,
        icon: 'programs',
        topics: [
            {
                code: 'PT-00',
                title: 'Program Training Overview',
                content: 'Video explaining all the different programs that we offer',
                links: [{ label: 'Program Training Video', url: '#' }]
            }
        ]
    },
    {
        id: 'phase-1-programs',
        title: 'Phase 1 Programs',
        subtitle: 'Core Weight Loss Programs',
        description: 'Learn about Weight Loss Pro, Weight Loss Plus, Beat PCOS, and Slim Smart 30.',
        type: 'segment',
        progress: 0,
        status: 'Available',
        hasAssignment: false,
        topics: [
            { code: 'P1-01', title: 'Weight Loss Pro Program', content: 'Learn features, pricing, and target audience for Weight Loss Pro', links: [{ label: 'Video', url: '#' }] },
            { code: 'P1-02', title: 'Weight Loss Plus Program', content: 'Learn features, pricing, and target audience for Weight Loss Plus', links: [{ label: 'Video', url: '#' }] },
            { code: 'P1-03', title: 'Beat PCOS Program', content: 'Specialized program for PCOS weight loss management', links: [{ label: 'Video', url: '#' }] },
            { code: 'P1-04', title: 'Slim Smart 30 Program', content: '30-day smart weight loss program details', links: [{ label: 'Video', url: '#' }] }
        ]
    },
    {
        id: 'phase-2-programs',
        title: 'Phase 2 Programs',
        subtitle: 'Advanced Transformation Programs',
        description: 'Learn about Renue, Body Transformation, Plateau Breaker, Active, Reform IF, and Slimpossible 60.',
        type: 'segment',
        progress: 0,
        status: 'Available',
        hasAssignment: false,
        topics: [
            { code: 'P2-01', title: 'Renue Program', content: 'Premium renewal and rejuvenation program', links: [{ label: 'Video', url: '#' }] },
            { code: 'P2-02', title: 'Body Transformation Program', content: 'Complete body transformation methodology', links: [{ label: 'Video', url: '#' }] },
            { code: 'P2-03', title: 'Plateau Breaker Program', content: 'For clients stuck in weight loss plateaus', links: [{ label: 'Video', url: '#' }] },
            { code: 'P2-04', title: 'Active Program', content: 'For active lifestyle individuals', links: [{ label: 'Video', url: '#' }] },
            { code: 'P2-05', title: 'Reform Intermittent Fasting', content: 'IF-based weight management program', links: [{ label: 'Video', url: '#' }] },
            { code: 'P2-06', title: 'Slimpossible 60', content: '60-day intensive transformation program', links: [{ label: 'Video', url: '#' }] }
        ]
    },
    {
        id: 'health-score-practical',
        title: 'Health Score Practical',
        subtitle: 'Lead Generation Tool Training',
        description: 'Take health score with artificial profiles and understand how leads are generated and covered.',
        type: 'segment',
        progress: 0,
        status: 'Available',
        hasAssignment: true,
        icon: 'health',
        topics: [
            {
                code: 'HS-01',
                title: 'Take Health Score',
                content: 'Create your own profile with artificial inflated weight and medical conditions',
                links: [{ label: 'Balance Health Score', url: '#' }],
                assessment: 'Submit Health Score Report'
            },
            {
                code: 'HS-02',
                title: 'Peer Health Scores',
                content: 'Take health score with 3 peers and compare results',
                assessment: 'Submit 3 peer Health Score reports'
            },
            {
                code: 'HS-03',
                title: 'Competitor Health Scores',
                content: 'Take health score comparing with competitor profiles',
                assessment: 'Submit competitor Health Score analysis'
            },
            {
                code: 'HS-04',
                title: 'HS Lead Boosting',
                content: 'Learn ways to boost Health Score leads and how counselors cover HS leads'
            },
            {
                code: 'HS-05',
                title: 'Brand USP',
                content: 'List down our brand USPs based on Health Score analysis',
                assessment: 'Submit Brand USP document'
            }
        ]
    },

    // ===== SEGMENT 3: Cleanse Programs =====
    {
        id: 'segment-3',
        title: 'Segment 3: Cleanse Programs',
        subtitle: 'Short & Affordable Programs',
        description: 'All cleanse programs - from 1-day to 14-day specialized detox and cleanse plans.',
        type: 'segment',
        progress: 0,
        status: 'Available',
        hasAssignment: false,
        icon: 'cleanse',
        topics: [
            { code: 'CL-00', title: 'Cleanse Programs Overview', content: 'Introduction to all cleanse programs', links: [{ label: 'Cleanse Programs', url: '#' }] }
        ]
    },
    {
        id: '1-day-cleanses',
        title: '1-Day Cleanses',
        subtitle: 'Quick Detox Programs',
        description: 'Single day intensive cleanse options for quick results.',
        type: 'segment',
        progress: 0,
        status: 'Available',
        hasAssignment: false,
        topics: [
            { code: '1D-01', title: 'Weight Loss Cleanse', content: 'Quick 1-day weight loss kickstart', links: [{ label: 'Details', url: '#' }] },
            { code: '1D-02', title: 'Sugar Detox Cleanse', content: 'Break sugar addiction in one day', links: [{ label: 'Details', url: '#' }] },
            { code: '1D-03', title: 'Flat Stomach Cleanse', content: 'Reduce bloating and flatten stomach', links: [{ label: 'Details', url: '#' }] },
            { code: '1D-04', title: 'Post Festive Detox Cleanse', content: 'Reset after festive indulgence', links: [{ label: 'Details', url: '#' }] }
        ]
    },
    {
        id: '3-day-cleanses',
        title: '3-Day Cleanses',
        subtitle: 'Intensive Reset Programs',
        description: 'Three-day targeted cleanse programs for specific health concerns.',
        type: 'segment',
        progress: 0,
        status: 'Available',
        hasAssignment: false,
        topics: [
            { code: '3D-01', title: 'Acidity Correction Cleanse', content: 'Fix chronic acidity issues', links: [{ label: 'Details', url: '#' }] },
            { code: '3D-02', title: 'Immune Boosting Cleanse', content: 'Strengthen immunity naturally', links: [{ label: 'Details', url: '#' }] },
            { code: '3D-03', title: 'Constipation Correction Cleanse', content: 'Improve digestive regularity', links: [{ label: 'Details', url: '#' }] },
            { code: '3D-04', title: 'Gut Reset Detox Cleanse', content: 'Complete gut health restoration', links: [{ label: 'Details', url: '#' }] }
        ]
    },
    {
        id: '10-day-programs',
        title: '10-Day Programs',
        subtitle: 'Extended Wellness Plans',
        description: 'Ten-day structured diet and reform plans.',
        type: 'segment',
        progress: 0,
        status: 'Available',
        hasAssignment: false,
        topics: [
            { code: '10D-01', title: '10-Day Diet Plan', content: 'Structured 10-day diet program', links: [{ label: 'Details', url: '#' }] },
            { code: '10D-02', title: '10-Day Reform Plan', content: 'Lifestyle reform in 10 days', links: [{ label: 'Details', url: '#' }] }
        ]
    },
    {
        id: '14-day-programs',
        title: '14-Day Programs',
        subtitle: 'Comprehensive Transformation',
        description: 'Two-week intensive transformation programs.',
        type: 'segment',
        progress: 0,
        status: 'Available',
        hasAssignment: false,
        topics: [
            { code: '14D-01', title: 'Transform 14 Days', content: 'Complete 2-week transformation cleanse', links: [{ label: 'Details', url: '#' }] },
            { code: '14D-02', title: 'Shapeup 14 Days', content: 'Intensive 2-week body shaping plan', links: [{ label: 'Details', url: '#' }] }
        ]
    },

    // ===== DAY 1 DELIVERABLES =====
    {
        id: 'day-1-deliverables',
        title: 'Day 1 Deliverables',
        subtitle: 'AMA Session & Summary Mail',
        description: 'On Day 1 at the office: Send summary mail of what you have done and attend AMA session with founders.',
        type: 'checklist',
        progress: 0,
        status: 'Available',
        hasAssignment: true,
        topics: [
            {
                code: 'D1-01',
                title: 'Summary Mail',
                content: 'Send a summary email of your BN Overview study to HR',
                assessment: 'Submit Summary Mail'
            },
            {
                code: 'D1-02',
                title: 'AMA Session with Founders',
                content: 'Attend the Ask Me Anything session with the founders',
                owner: 'Founders'
            },
            {
                code: 'D1-03',
                title: 'Peer Assessment Submission',
                content: 'Submit completed peer assessment study',
                assessment: 'Submit Peer Assessment Sheet'
            },
            {
                code: 'D1-04',
                title: 'Health Score Submission',
                content: 'Submit all Health Score reports taken during training',
                assessment: 'Submit HS Reports'
            }
        ]
    },

    // ===== HR CHECKLIST =====
    {
        id: 'hr-checklist',
        title: 'HR Verification Checklist',
        subtitle: 'For HR Use Only',
        description: 'HR tasks to verify candidate completion of training modules.',
        type: 'checklist',
        progress: 0,
        status: 'Available',
        hasAssignment: false,
        topics: [
            { code: 'HR-01', title: 'Summary Mail Check', content: 'Verify candidate has sent summary mail of BN overview study' },
            { code: 'HR-02', title: 'Peer Assessment Verification', content: 'Check and help candidates implement peer assessment study' },
            { code: 'HR-03', title: 'Health Score Scenarios', content: 'Ask candidates to take HS with different scenarios' },
            { code: 'HR-04', title: 'Doubt Clarification', content: 'Clarify any doubts that arose during training' }
        ]
    },

    // ===== RESOURCE BANK =====
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
            { code: 'RB-03', title: 'Founder Video Series', content: "Khyati Ma'am's Thought Leadership series" },
            { code: 'RB-04', title: '3T Manual', content: 'Core training methodology document' }
        ]
    }
];
