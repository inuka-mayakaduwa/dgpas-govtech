'use client';

import { Navbar } from '@/components/Navbar';
import { PermitForm } from '@/components/PermitForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Apply for a New Permit</h1>
            <p className="text-muted-foreground">Fill out the form below to submit your application.</p>
          </div>
          <PermitForm onSuccess={() => { }} />
        </div>
      </div>
    </div>
  );
}
