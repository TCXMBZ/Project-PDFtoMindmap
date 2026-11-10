import React from 'react';
import DocumentAnalyzerClient from './DocumentAnalyzerClient';

export function generateStaticParams() {
  return [
    { id: 'doc-1' },
    { id: 'doc-2' },
    { id: 'doc-3' },
    { id: 'doc-4' },
    { id: 'doc-5' },
    { id: 'doc-6' }
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <DocumentAnalyzerClient id={id} />;
}
