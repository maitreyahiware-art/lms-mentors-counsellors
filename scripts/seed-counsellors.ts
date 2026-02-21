import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load env vars from the root of the project
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const counsellors = [
    { name: 'Anjali Mehta', email: 'anjali.m@balancenutrition.in' },
    { name: 'Rahul Sharma', email: 'rahul.s@balancenutrition.in' },
    { name: 'Priya Kapoor', email: 'priya.k@balancenutrition.in' },
    { name: 'Vikram Joshi', email: 'vikram.j@balancenutrition.in' },
    { name: 'Sneha Reddy', email: 'sneha.r@balancenutrition.in' },
    { name: 'Amit Verma', email: 'amit.v@balancenutrition.in' },
    { name: 'Kavita Patil', email: 'kavita.p@balancenutrition.in' },
    { name: 'Rohan Bakshi', email: 'rohan.b@balancenutrition.in' },
    { name: 'Neha Singh', email: 'neha.s@balancenutrition.in' },
    { name: 'Karan Thapar', email: 'karan.t@balancenutrition.in' }
];

const UNIVERSAL_PASSWORD = '515148';

// Simplified syllabus for seeding (hardcoded to avoid import errors)
const modulesForSeed = [
    { id: 'module-1', topics: ['M1-01', 'M1-02', 'M1-03'] },
    { id: 'module-2', topics: ['M2-01', 'M2-02', 'M2-03', 'M2-04', 'M2-05'] },
    { id: 'module-3', topics: ['M3-01', 'M3-02', 'M3-03'] },
    { id: 'module-4', topics: ['M4-01', 'M4-02', 'M4-03', 'M4-04'] },
    { id: 'module-5', topics: ['M5-01', 'M5-02', 'M5-03'] }
];

async function seed() {
    console.log('🚀 Starting Real Counsellor Provisioning Flow with Progress...');

    for (const c of counsellors) {
        console.log(`\n--- Provisioning: ${c.name} ---`);

        // 1. Get/Create User
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users.find(u => u.email === c.email);
        let userId;

        if (existingUser) {
            userId = existingUser.id;
            await supabaseAdmin.auth.admin.updateUserById(userId, {
                user_metadata: { full_name: c.name, role: 'counsellor' }
            });
        } else {
            const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: c.email,
                password: UNIVERSAL_PASSWORD,
                email_confirm: true,
                user_metadata: { full_name: c.name, role: 'counsellor' }
            });
            if (authError) continue;
            userId = authUser.user.id;
        }

        // 2. Sync Profile
        await supabaseAdmin.from('profiles').upsert({
            id: userId,
            full_name: c.name,
            email: c.email,
            role: 'counsellor',
            training_buddy: 'BN Admin',
            temp_password: UNIVERSAL_PASSWORD,
            updated_at: new Date().toISOString()
        });

        // 3. Inject Randomized Progress
        const progressLevel = Math.floor(Math.random() * 5) + 1; // 1 to 5 modules
        const progressEntries: any[] = [];
        const activities: any[] = [
            { user_id: userId, activity_type: 'login', content_title: 'Platform Access', module_id: 'System' }
        ];

        for (let i = 0; i < progressLevel; i++) {
            const m = modulesForSeed[i];
            m.topics.forEach(tCode => {
                progressEntries.push({
                    user_id: userId,
                    module_id: m.id,
                    topic_code: tCode
                });
            });
            activities.push({
                user_id: userId,
                activity_type: 'view_topic',
                content_title: `Module ${i + 1} Completion`,
                module_id: m.id
            });
        }

        if (progressEntries.length > 0) {
            await supabaseAdmin.from('mentor_progress').upsert(progressEntries, { onConflict: 'user_id,topic_code' });
        }

        // 4. Inject Quiz Scores
        if (progressLevel >= 2) {
            await supabaseAdmin.from('assessment_logs').insert({
                user_id: userId,
                topic_code: 'MODULE_module-1',
                score: 4,
                total_questions: 5,
                raw_data: {
                    questions: [{ question: 'Vision?', correctAnswer: 'Healthy India' }],
                    answers: ['Healthy India']
                }
            });
        }

        // 5. Inject Audit
        if (progressLevel >= 4) {
            await supabaseAdmin.from('summary_audits').insert({
                user_id: userId,
                topic_code: 'M-FINAL',
                score: 85,
                feedback: `Counsellor ${c.name} has demonstrated strong grasp of BN protocols.`
            });
        }

        await supabaseAdmin.from('mentor_activity_logs').insert(activities);
    }

    console.log('\n✅ Real Database Population Complete!');
}

seed().catch(err => {
    console.error('Fatal Seeding Error:', err);
    process.exit(1);
});
