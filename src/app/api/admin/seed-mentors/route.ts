import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/admin-auth';


export async function POST(request: Request) {
    // Server-side admin check
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

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

    const results = [];

    for (const counsellor of counsellors) {
        // First check if user exists in profiles to get potential ID
        const { data: existingProfile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', counsellor.email)
            .single();

        let userId = existingProfile?.id;
        let authError = null;

        if (userId) {
            // Update existing user password
            const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
                password: '515148',
                user_metadata: { full_name: counsellor.name }
            });
            authError = error;
        } else {
            // Create user in Auth
            const { data: userData, error } = await supabaseAdmin.auth.admin.createUser({
                email: counsellor.email,
                password: '515148',
                email_confirm: true,
                user_metadata: { full_name: counsellor.name }
            });
            authError = error;
            userId = userData.user?.id;
        }

        if (authError) {
            results.push({ email: counsellor.email, status: 'error', message: authError.message });
        } else if (userId) {
            // Upsert into profiles table
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .upsert({
                    id: userId,
                    email: counsellor.email,
                    full_name: counsellor.name,
                    role: 'counsellor'
                });

            results.push({
                email: counsellor.email,
                status: profileError ? 'profile_error' : 'success',
                message: profileError?.message || 'Processed successfully'
            });
        }
    }

    return NextResponse.json({ results });
}
