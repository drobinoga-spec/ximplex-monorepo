'use client';

interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  order: number;
}

interface FormPreviewProps {
  fields: Field[];
  formName: string;
  formDescription?: string;
}

const FIELD_TYPES: Record<string, string> = {
  text: 'Texto Corto',
  email: 'Email',
  phone: 'Teléfono',
  number: 'Número',
  textarea: 'Texto Largo',
  date: 'Fecha',
  select: 'Seleccionar',
  checkbox: 'Checkbox',
  radio: 'Radio',
};

export default function FormPreview({
  fields,
  formName,
  formDescription,
}: FormPreviewProps) {
  const renderField = (field: Field) => {
    const commonProps = {
      className:
        'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      placeholder: field.placeholder || '',
      required: field.required,
      disabled: true,
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={field.id}
            {...commonProps}
            rows={4}
            className={`${commonProps.className} resize-none`}
          />
        );

      case 'email':
        return (
          <input
            key={field.id}
            type="email"
            {...commonProps}
          />
        );

      case 'phone':
        return (
          <input
            key={field.id}
            type="tel"
            {...commonProps}
          />
        );

      case 'number':
        return (
          <input
            key={field.id}
            type="number"
            {...commonProps}
          />
        );

      case 'date':
        return (
          <input
            key={field.id}
            type="date"
            {...commonProps}
          />
        );

      case 'select':
        return (
          <select
            key={field.id}
            {...commonProps}
          >
            <option value="">Selecciona una opción</option>
            <option value="opcion1">Opción 1</option>
            <option value="opcion2">Opción 2</option>
            <option value="opcion3">Opción 3</option>
          </select>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              disabled
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor={field.id}
              className="ml-2 text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="flex items-center">
            <input
              type="radio"
              id={field.id}
              disabled
              className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor={field.id}
              className="ml-2 text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
          </div>
        );

      case 'text':
      default:
        return (
          <input
            key={field.id}
            type="text"
            {...commonProps}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 border border-gray-200">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{formName}</h3>
        {formDescription && (
          <p className="text-gray-600 text-sm">{formDescription}</p>
        )}
      </div>

      {fields && fields.length > 0 ? (
        <form className="space-y-6">
          {fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {field.label}
                {field.required && <span className="text-red-600 ml-1">*</span>}
              </label>
              {renderField(field)}
              <p className="text-xs text-gray-500 mt-1">
                {FIELD_TYPES[field.type] || field.type}
              </p>
            </div>
          ))}

          <button
            type="submit"
            disabled
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold mt-8 opacity-60 cursor-not-allowed"
          >
            Enviar Formulario
          </button>
        </form>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 mb-2">Sin campos aún</p>
          <p className="text-sm text-gray-500">
            Agrega campos en el editor para ver la vista previa
          </p>
        </div>
      )}
    </div>
  );
}
