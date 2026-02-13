import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ADMIN CLIENT (Uses Service Role Key)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function POST() {
    const mentors = [
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

    const results = [];

    for (const mentor of mentors) {
        try {
            // 1. Try to find the user first
            const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
            const existingUser = users?.find(u => u.email === mentor.email);

            let userId;

            if (existingUser) {
                // 2. Update existing user's password to 515148
                const { data: updated, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                    existingUser.id,
                    { password: '515148', email_confirm: true }
                );
                if (updateError) throw updateError;
                userId = existingUser.id;
            } else {
                // 3. Create brand new user
                const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
                    email: mentor.email,
                    password: '515148',
                    email_confirm: true,
                    user_metadata: { full_name: mentor.name }
                });
                if (createError) throw createError;
                userId = created.user?.id;
            }

            // 4. Ensure profile exists
            if (userId) {
                await supabaseAdmin.from('profiles').upsert({
                    id: userId,
                    email: mentor.email,
                    full_name: mentor.name,
                    role: 'mentor'
                });
            }

            results.push({ email: mentor.email, status: 'synced' });
        } catch (err: any) {
            results.push({ email: mentor.email, status: 'error', message: err.message });
        }
    }

    return NextResponse.json({ success: true, results });
}
