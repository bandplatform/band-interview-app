'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';

interface Program {
  id: number;
  name: string;
  type: 'PER_DOLLAR' | 'PER_UNIT';
  rate: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      }
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Programs</h1>
        <Link href="/programs/new">
          <Button>Create New Program</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Programs</CardTitle>
        </CardHeader>
        <CardContent>
          {programs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No programs found. Create your first program to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell>
                      <Badge variant={program.type === 'PER_DOLLAR' ? 'default' : 'secondary'}>
                        {program.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{program.rate.toFixed(4)}</TableCell>
                    <TableCell>
                      {new Date(program.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link href={`/programs/${program.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
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