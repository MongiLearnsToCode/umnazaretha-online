'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Crown, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  role: string | null;
  subscription_status: string | null;
  created_at: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('email', `%${searchTerm}%`);
      }

      if (filterRole !== 'all') {
        query = query.eq('role', filterRole);
      }

      if (filterStatus !== 'all') {
        query = query.eq('subscription_status', filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', userId);

      if (error) {
        throw new Error(error.message);
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: 'admin' } 
          : user
      ));

      toast({
        title: 'User Promoted',
        description: 'User has been promoted to admin successfully',
      });
    } catch (error) {
      console.error('Error promoting user:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to promote user',
        variant: 'destructive',
      });
    }
  };

  const demoteFromAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: 'subscriber' })
        .eq('id', userId);

      if (error) {
        throw new Error(error.message);
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: 'subscriber' } 
          : user
      ));

      toast({
        title: 'User Demoted',
        description: 'User has been demoted to subscriber',
      });
    } catch (error) {
      console.error('Error demoting user:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to demote user',
        variant: 'destructive',
      });
    }
  };

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default"><Crown className="h-3 w-3 mr-1" /> Admin</Badge>;
      case 'subscriber':
        return <Badge variant="secondary"><User className="h-3 w-3 mr-1" /> Subscriber</Badge>;
      default:
        return <Badge variant="outline">{role || 'Unknown'}</Badge>;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-500">Manage user accounts and subscriptions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Filters</CardTitle>
          <CardDescription>Filter and search through your user base</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="subscriber">Subscriber</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Subscription Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={fetchUsers}>Apply Filters</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>All registered users on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.subscription_status)}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {user.role === 'subscriber' && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => promoteToAdmin(user.id)}
                        >
                          <Crown className="h-4 w-4 mr-1" />
                          Make Admin
                        </Button>
                      )}
                      {user.role === 'admin' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => demoteFromAdmin(user.id)}
                        >
                          <User className="h-4 w-4 mr-1" />
                          Make Subscriber
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}