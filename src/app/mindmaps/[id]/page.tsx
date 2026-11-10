import React from 'react';
import MindMapEditorClient from './MindMapEditorClient';

export function generateStaticParams() {
  return [
    { id: 'mm-1' },
    { id: 'mm-2' },
    { id: 'mm-3' },
    { id: 'mm-4' }
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <MindMapEditorClient id={id} />;
}
