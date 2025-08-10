'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { generateR2SignedUrl } from '@/lib/cloudflare';
import { logAdminAction } from '@/lib/audit';
import { useUserStore } from '@/store/user-store';

export default function UploadContent() {
  const { user } = useUserStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [targetDemographic, setTargetDemographic] = useState('');
  const [language, setLanguage] = useState('en');
  const [episodeNumber, setEpisodeNumber] = useState<number | undefined>();
  const [seasonNumber, setSeasonNumber] = useState<number | undefined>();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !genre) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields and select a file.',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to upload content.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Generate signed URL for R2 upload
      const fileName = `${Date.now()}-${file.name}`;
      const signedUrlResponse = await generateR2SignedUrl(fileName, file.type);
      
      if (!signedUrlResponse.success || !signedUrlResponse.uploadURL) {
        throw new Error(signedUrlResponse.error || 'Failed to generate upload URL');
      }

      // Upload file to R2
      const uploadResponse = await fetch(signedUrlResponse.uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to storage');
      }

      // Create program record in Supabase
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .insert({
          title,
          description,
          genre,
          target_demographic: targetDemographic,
          language,
          episode_number: episodeNumber,
          season_number: seasonNumber,
          approval_status: 'pending',
          // video_id will be set after processing by Cloudflare Stream
        })
        .select()
        .single();

      if (programError) {
        throw new Error(programError.message);
      }

      // Log the action
      await logAdminAction(
        'CREATE_PROGRAM',
        'program',
        user.id,
        programData.id,
        {
          title,
          genre,
          target_demographic: targetDemographic,
          language,
          episode_number: episodeNumber,
          season_number: seasonNumber
        }
      );

      // Create initial approval request for executive producer
      const { error: approvalError } = await supabase
        .from('approvals')
        .insert({
          content_id: programData.id,
          content_type: 'program',
          approval_level: 'executive_producer',
          status: 'pending'
        });

      if (approvalError) {
        console.warn('Failed to create approval request:', approvalError.message);
        // We don't throw here because the upload was successful, we just couldn't create the approval
      }

      toast({
        title: 'Upload Successful',
        description: 'Your content has been uploaded and is pending approval.',
      });

      // Reset form
      setTitle('');
      setDescription('');
      setGenre('');
      setTargetDemographic('');
      setLanguage('en');
      setEpisodeNumber(undefined);
      setSeasonNumber(undefined);
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Content</h1>
        <p className="text-gray-500">Upload new programs and content to the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Program Information</CardTitle>
          <CardDescription>Enter details about the program you're uploading</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter program title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter program description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="targetDemographic">Target Demographic</Label>
              <Select value={targetDemographic} onValueChange={setTargetDemographic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select demographic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youth">Youth</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="families">Families</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zu">isiZulu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seasonNumber">Season Number</Label>
              <Input
                id="seasonNumber"
                type="number"
                value={seasonNumber || ''}
                onChange={(e) => setSeasonNumber(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Enter season number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="episodeNumber">Episode Number</Label>
              <Input
                id="episodeNumber"
                type="number"
                value={episodeNumber || ''}
                onChange={(e) => setEpisodeNumber(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Enter episode number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Video</CardTitle>
          <CardDescription>Upload the video file for this program</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Video File *</Label>
            <Input
              id="file"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-sm text-gray-500">
                Selected file: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">Uploading... {uploadProgress}%</p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading || !file || !title || !genre}
            className="w-full md:w-auto"
          >
            {uploading ? 'Uploading...' : 'Upload Program'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}