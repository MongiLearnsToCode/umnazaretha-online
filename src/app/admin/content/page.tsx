'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface Program {
  id: string;
  title: string;
  description: string | null;
  genre: string | null;
  target_demographic: string | null;
  approval_status: string | null;
  created_at: string;
}

export default function ManageContent() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      if (filterGenre !== 'all') {
        query = query.eq('genre', filterGenre);
      }

      if (filterStatus !== 'all') {
        query = query.eq('approval_status', filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch programs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (programId: string) => {
    try {
      const { error } = await supabase
        .from('programs')
        .update({ approval_status: 'approved' })
        .eq('id', programId);

      if (error) {
        throw new Error(error.message);
      }

      // Update local state
      setPrograms(programs.map(program => 
        program.id === programId 
          ? { ...program, approval_status: 'approved' } 
          : program
      ));

      toast({
        title: 'Program Approved',
        description: 'The program has been approved successfully',
      });
    } catch (error) {
      console.error('Error approving program:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to approve program',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (programId: string) => {
    try {
      const { error } = await supabase
        .from('programs')
        .update({ approval_status: 'rejected' })
        .eq('id', programId);

      if (error) {
        throw new Error(error.message);
      }

      // Update local state
      setPrograms(programs.map(program => 
        program.id === programId 
          ? { ...program, approval_status: 'rejected' } 
          : program
      ));

      toast({
        title: 'Program Rejected',
        description: 'The program has been rejected',
      });
    } catch (error) {
      console.error('Error rejecting program:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reject program',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Content</h1>
        <p className="text-gray-500">View and manage all uploaded content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Filters</CardTitle>
          <CardDescription>Filter and search through your content library</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select value={filterGenre} onValueChange={setFilterGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="worship_services">Worship Services</SelectItem>
                  <SelectItem value="talk_shows">Talk Shows</SelectItem>
                  <SelectItem value="youth_programs">Youth Programs</SelectItem>
                  <SelectItem value="womens_shows">Women's Shows</SelectItem>
                  <SelectItem value="mens_shows">Men's Shows</SelectItem>
                  <SelectItem value="magazine_shows">Magazine Shows</SelectItem>
                  <SelectItem value="community_events">Community Events</SelectItem>
                  <SelectItem value="special_programming">Special Programming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Approval Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={fetchPrograms}>Apply Filters</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Library</CardTitle>
          <CardDescription>All uploaded programs and content</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Demographic</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.title}</TableCell>
                    <TableCell className="capitalize">
                      {program.genre?.replace(/_/, ' ') || 'N/A'}
                    </TableCell>
                    <TableCell className="capitalize">
                      {program.target_demographic || 'N/A'}
                    </TableCell>
                    <TableCell>{getStatusBadge(program.approval_status)}</TableCell>
                    <TableCell>
                      {new Date(program.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {program.approval_status !== 'approved' && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleApprove(program.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {program.approval_status !== 'rejected' && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleReject(program.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
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