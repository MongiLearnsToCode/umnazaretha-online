'use client';

import { useUserStore } from '@/store/user-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Menu, X, Users, Video, Calendar, Upload, LogOut, CheckCircle } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser, setIsAuthenticated } = useUserStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/sign-in');
        return;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('id, email, role, subscription_status, language_preference')
        .eq('id', session.user.id)
        .single();

      if (error || !userData || userData.role !== 'admin') {
        router.push('/');
        return;
      }

      setUser({
        id: userData.id,
        email: userData.email,
        role: userData.role,
        subscription_status: userData.subscription_status,
        language_preference: userData.language_preference,
      });
      setIsAuthenticated(true);
    };

    checkUser();
  }, [router, setUser, setIsAuthenticated]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/sign-in');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:w-64 md:fixed md:inset-y-0 z-50`}>
        <div className="flex flex-col h-full bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold">umNazaretha Admin</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/admin" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Upload className="h-5 w-5 mr-3" />
              Upload Content
            </Link>
            <Link href="/admin/schedule" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Calendar className="h-5 w-5 mr-3" />
              Schedule Programs
            </Link>
            <Link href="/admin/content" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Video className="h-5 w-5 mr-3" />
              Manage Content
            </Link>
            <Link href="/admin/approval" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <CheckCircle className="h-5 w-5 mr-3" />
              Content Approval
            </Link>
            <Link href="/admin/users" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Users className="h-5 w-5 mr-3" />
              User Management
            </Link>
          </nav>
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
            <div className="flex items-center">
              <span className="mr-2 text-sm">{user.email}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}