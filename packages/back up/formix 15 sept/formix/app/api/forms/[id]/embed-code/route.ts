import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params;

    // Get the form
    const { data: form, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();

    if (error || !form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Generate embed code (two options)

    // Option 1: Iframe embed (simple, works everywhere)
    const iframeEmbed = `<!-- Formix Form Embed -->
<iframe
  src="http://localhost:3000/widget/${formId}"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>`;

    // Option 2: React component (for Next.js projects)
    const reactEmbed = `<!-- Formix Form Embed (React) -->
import FormWidget from '@/components/FormWidget';

export default function MyPage() {
  return (
    <FormWidget
      formId="${formId}"
      apiUrl="http://localhost:3000"
    />
  );
}`;

    // Option 3: Script tag (vanilla JS)
    const scriptEmbed = `<!-- Formix Form Embed -->
<div id="formix-form-${formId}"></div>
<script src="http://localhost:3000/widget.js"></script>
<script>
  Formix.embed('${formId}', {
    container: 'formix-form-${formId}',
    apiUrl: 'http://localhost:3000'
  });
</script>`;

    return NextResponse.json({
      code: iframeEmbed,
      alternatives: {
        react: reactEmbed,
        script: scriptEmbed,
      },
      form: {
        id: form.id,
        name: form.name,
        fields: form.fields,
      },
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}