'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Clock, User, Crown } from 'lucide-react';
import { logAdminAction } from '@/lib/audit';
import { useUserStore } from '@/store/user-store';

interface PendingApproval {
  id: string;
  content_id: string;
  content_type: string;
  approver_id: string | null;
  approval_level: string | null;
  status: string | null;
  comments: string | null;
  created_at: string;
  program?: {
    title: string;
    description: string | null;
    genre: string | null;
  };
}

export default function ContentApproval() {
  const { user } = useUserStore();
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPendingApprovals = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('approvals')
        .select(`
          id,
          content_id,
          content_type,
          approver_id,
          approval_level,
          status,
          comments,
          created_at,
          programs (title, description, genre)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setPendingApprovals(data || []);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch pending approvals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPendingApprovals();
  }, [fetchPendingApprovals]);

  const handleApprove = async (approvalId: string, comments: string) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to approve content.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: approvalData, error: approvalError } = await supabase
        .from('approvals')
        .select('approval_level, content_id, content_type, programs (title)')
        .eq('id', approvalId)
        .single();

      if (approvalError) {
        throw new Error(approvalError.message);
      }

      type ApprovalData = {
        approval_level: string | null;
        content_id: string;
        content_type: string;
        programs: {
          title: string;
        } | null;
      };

      const typedApprovalData = approvalData as unknown as ApprovalData;

      // If this is an executive producer approval, create a church leadership approval
      if (typedApprovalData.approval_level === 'executive_producer') {
        const { error: createError } = await supabase
          .from('approvals')
          .insert({
            content_id: typedApprovalData.content_id,
            content_type: typedApprovalData.content_type,
            approval_level: 'church_leadership',
            status: 'pending'
          });

        if (createError) {
          throw new Error(createError.message);
        }
      }

      // Update the current approval
      const { error: updateError } = await supabase
        .from('approvals')
        .update({ 
          status: 'approved',
          comments: comments || null,
          approver_id: user.id
        })
        .eq('id', approvalId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Log the action
      await logAdminAction(
        'APPROVE_CONTENT',
        'approval',
        user.id,
        approvalId,
        {
          approval_level: typedApprovalData.approval_level,
          content_id: typedApprovalData.content_id,
          content_type: typedApprovalData.content_type,
          content_title: typedApprovalData.programs?.title,
          comments
        }
      );

      // If this is a church leadership approval, also update the content status
      if (typedApprovalData.approval_level === 'church_leadership') {
        const { error: contentError } = await supabase
          .from('programs')
          .update({ approval_status: 'approved' })
          .eq('id', typedApprovalData.content_id);

        if (contentError) {
          throw new Error(contentError.message);
        }

        // Log the final approval
        await logAdminAction(
          'CONTENT_APPROVED',
          'program',
          user.id,
          typedApprovalData.content_id,
          {
            content_title: typedApprovalData.programs?.title,
            approval_level: typedApprovalData.approval_level
          }
        );
      }

      // Refresh the list
      fetchPendingApprovals();

      toast({
        title: 'Approval Processed',
        description: 'The content has been approved successfully',
      });
    } catch (error) {
      console.error('Error approving content:', error);
      
      // Log the error
      if (user) {
        await logAdminAction(
          'APPROVE_CONTENT_ERROR',
          'approval',
          user.id,
          approvalId,
          {
            error: error instanceof Error ? error.message : 'Unknown error',
            comments
          }
        );
      }
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to approve content',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (approvalId: string, comments: string) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to reject content.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: approvalData, error: approvalError } = await supabase
        .from('approvals')
        .select('content_id, content_type, approval_level, programs (title)')
        .eq('id', approvalId)
        .single();

      if (approvalError) {
        throw new Error(approvalError.message);
      }

      type ApprovalData = {
        content_id: string;
        content_type: string;
        approval_level: string | null;
        programs: {
          title: string;
        } | null;
      };

      const typedApprovalData = approvalData as unknown as ApprovalData;

      // Update the current approval
      const { error: updateError } = await supabase
        .from('approvals')
        .update({ 
          status: 'rejected',
          comments: comments || null,
          approver_id: user.id
        })
        .eq('id', approvalId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Log the action
      await logAdminAction(
        'REJECT_CONTENT',
        'approval',
        user.id,
        approvalId,
        {
          approval_level: typedApprovalData.approval_level,
          content_id: typedApprovalData.content_id,
          content_type: typedApprovalData.content_type,
          content_title: typedApprovalData.programs?.title,
          comments
        }
      );

      // Also update the content status to rejected
      const { error: contentError } = await supabase
        .from('programs')
        .update({ approval_status: 'rejected' })
        .eq('id', typedApprovalData.content_id);

      if (contentError) {
        throw new Error(contentError.message);
      }

      // Log the rejection
      await logAdminAction(
        'CONTENT_REJECTED',
        'program',
        user.id,
        typedApprovalData.content_id,
        {
          content_title: typedApprovalData.programs?.title,
          approval_level: typedApprovalData.approval_level,
          comments
        }
      );

      // Refresh the list
      fetchPendingApprovals();

      toast({
        title: 'Content Rejected',
        description: 'The content has been rejected',
      });
    } catch (error) {
      console.error('Error rejecting content:', error);
      
      // Log the error
      if (user) {
        await logAdminAction(
          'REJECT_CONTENT_ERROR',
          'approval',
          user.id,
          approvalId,
          {
            error: error instanceof Error ? error.message : 'Unknown error',
            comments
          }
        );
      }
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reject content',
        variant: 'destructive',
      });
    }
  };

  const ApprovalItem = ({ approval }: { approval: PendingApproval }) => {
    const [comments, setComments] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleApproveClick = async () => {
      setProcessing(true);
      await handleApprove(approval.id, comments);
      setProcessing(false);
    };

    const handleRejectClick = async () => {
      setProcessing(true);
      await handleReject(approval.id, comments);
      setProcessing(false);
    };

    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                {approval.program?.title || 'Untitled Content'}
                {approval.approval_level === 'executive_producer' ? (
                  <Crown className="h-4 w-4 text-yellow-500" />
                ) : (
                  <User className="h-4 w-4 text-blue-500" />
                )}
              </CardTitle>
              <CardDescription className="capitalize">
                {approval.approval_level?.replace('_', ' ') || 'Unknown level'} approval
              </CardDescription>
            </div>
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {approval.program?.description || 'No description provided'}
            </p>
            <p className="text-xs mt-2 capitalize">
              Genre: {approval.program?.genre?.replace(/_/, ' ') || 'N/A'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`comments-${approval.id}`}>Comments</Label>
            <Textarea
              id={`comments-${approval.id}`}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any comments for this approval..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="destructive"
              onClick={handleRejectClick}
              disabled={processing}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {processing ? 'Processing...' : 'Reject'}
            </Button>
            <Button
              variant="default"
              onClick={handleApproveClick}
              disabled={processing}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {processing ? 'Processing...' : 'Approve'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Approval</h1>
        <p className="text-gray-500">Review and approve pending content submissions</p>
      </div>

      {loading ? (
        <p>Loading pending approvals...</p>
      ) : pendingApprovals.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No pending approvals at this time</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {pendingApprovals.map((approval) => (
            <ApprovalItem key={approval.id} approval={approval} />
          ))}
        </div>
      )}
    </div>
  );
}

function Badge({ variant, children }: { variant: string; children: React.ReactNode }) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const variantClasses = variant === "secondary" 
    ? "bg-secondary text-secondary-foreground" 
    : "bg-gray-100 text-gray-800";

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      {children}
    </span>
  );
}