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

export async function POST(request: Request) {
    try {
        const { email, password, fullName, role } = await request.json();

        if (!email || !password || !fullName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Create the user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: fullName }
        });

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        const userId = authData.user?.id;

        // 2. Create the profile in the profiles table
        if (userId) {
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .insert({
                    id: userId,
                    email,
                    full_name: fullName,
                    role: role || 'mentor'
                });

            if (profileError) {
                // Check if profile already exists (unlikely with new user but good to be safe)
                if (profileError.code !== '23505') {
                    console.error('Profile creation error:', profileError);
                }
            }
        }

        return NextResponse.json({
            success: true,
            user: {
                id: userId,
                email,
                fullName
            }
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
