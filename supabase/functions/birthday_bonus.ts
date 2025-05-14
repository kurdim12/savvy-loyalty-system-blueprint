
import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_KEY")!
);

serve(async () => {
  try {
    console.log("Running birthday bonus check");
    
    // Get today's date in MM-DD format
    const today = new Date().toISOString().slice(5, 10); // MM-DD
    
    console.log(`Looking for birthdays on ${today}`);
    
    // Find users whose birthdays are today
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, birthday")
      .ilike("birthday", `%${today}%`);
      
    if (error) {
      console.error("Error fetching birthdays:", error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    console.log(`Found ${users?.length || 0} users with birthdays today`);
    
    // Award points to users with birthdays today
    const results = [];
    for (const user of users || []) {
      console.log(`Awarding points to ${user.first_name} ${user.last_name} (${user.id})`);
      
      const { error: pointsError } = await supabase.rpc("earn_points", { 
        uid: user.id, 
        points: 20, 
        notes: "Birthday bonus" 
      });
      
      if (pointsError) {
        console.error(`Error awarding points to ${user.id}:`, pointsError);
        results.push({ userId: user.id, success: false, error: pointsError.message });
      } else {
        console.log(`Successfully awarded points to ${user.id}`);
        results.push({ userId: user.id, success: true });
      }
    }
    
    return new Response(JSON.stringify({ 
      processed: users?.length || 0,
      results 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
