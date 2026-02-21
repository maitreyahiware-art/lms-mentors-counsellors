import { supabase } from "./supabase";

export type ActivityType = 'view_topic' | 'view_content' | 'start_quiz' | 'complete_quiz' | 'submit_assignment';

export async function logActivity(activityType: ActivityType, details: {
    moduleId?: string;
    topicCode?: string;
    contentTitle?: string;
    score?: number;
    metadata?: any;
}) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { error } = await supabase
            .from('mentor_activity_logs')
            .insert([{
                user_id: session.user.id,
                activity_type: activityType,
                module_id: details.moduleId,
                topic_code: details.topicCode,
                content_title: details.contentTitle,
                score: details.score,
                metadata: details.metadata
            }]);

        if (error) {
            // If the table doesn't exist, we'll fail silently for now
            // or we could use the profile sync logic if we had one
            console.warn("Activity logging failed (table might not exist):", error);
        }
    } catch (err) {
        console.error("Activity logging error:", err);
    }
}
