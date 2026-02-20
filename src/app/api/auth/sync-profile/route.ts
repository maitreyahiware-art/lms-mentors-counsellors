import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

export async function POST(req: Request) {
    try {
        const { userId, email, fullName } = await req.json();

        if (!userId || !email) {
            return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });
        }

        // Upsert into profiles table with admin privileges
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: userId,
                email: email,
                full_name: fullName || email.split('@')[0],
                role: 'mentor'
            })
            .select()
            .single();

        if (error) {
            console.error('Admin Profile Sync Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, profile: data });
    } catch (err: any) {
        console.error('Sync Profile Route Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
