import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AuthTest = () => {
  const { user, profile, loading, isAdmin, isUser, membershipTier, signOut } = useAuth();

  if (loading) {
    return <div className="text-center">Loading auth test...</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto m-4">
      <CardHeader>
        <CardTitle>Authentication Test Component</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">User Status:</h3>
          <p>Authenticated: {user ? '✅ Yes' : '❌ No'}</p>
          {user && (
            <>
              <p>Email: {user.email}</p>
              <p>User ID: {user.id}</p>
            </>
          )}
        </div>

        {profile && (
          <div>
            <h3 className="font-semibold">Profile Data:</h3>
            <p>Name: {profile.first_name} {profile.last_name}</p>
            <p>Role: {profile.role}</p>
            <p>Membership Tier: {membershipTier}</p>
            <p>Points: {profile.current_points}</p>
            <p>Visits: {profile.visits}</p>
            <p>Is Admin: {isAdmin ? '✅ Yes' : '❌ No'}</p>
            <p>Is User: {isUser ? '✅ Yes' : '❌ No'}</p>
          </div>
        )}

        {user && (
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        )}
      </CardContent>
    </Card>
  );
};