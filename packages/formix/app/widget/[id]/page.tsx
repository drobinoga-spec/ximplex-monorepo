'use client';

import { useParams } from 'next/navigation';
import FormWidget from '@/components/FormWidget';

export default function WidgetPage() {
  const params = useParams();
  const formId = params.id as string;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <FormWidget formId={formId} apiUrl="http://localhost:3000" />
      </div>
    </div>
  );
}
