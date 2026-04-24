import React from 'react'

const AnunciosContentMainPanel = ({
  isCreating,
  TEMPLATES,
  selectedTemplateId,
  handleSelectTemplate,
  templateVars,
  setTemplateVars,
  message,
  resolvedMessage,
  recipients,
  recipientsLoading,
  selectedRecipientId,
  setSelectedRecipientId,
  handleCancel,
  handleSend,
  canSend,
  sending,
}) => (
  <div className="bg-white rounded-xl shadow-sm h-full flex flex-col">
    <div className="w-full p-5 flex flex-col gap-6 overflow-y-auto">
      {/* Elegir plantilla */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Plantilla <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSelectTemplate(tpl)}
              className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                selectedTemplateId === tpl.id
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <p className="font-medium">{tpl.name}</p>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{tpl.body}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Variables de la plantilla */}
      {Object.keys(templateVars).length > 0 && (
        <div className="flex flex-col gap-3">
          {Object.keys(templateVars).map((varName) => (
            <div key={varName}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {varName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={templateVars[varName]}
                onChange={(e) => setTemplateVars((prev) => ({...prev, [varName]: e.target.value}))}
                placeholder={`Ingresá ${varName}...`}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Mensaje */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
        {resolvedMessage ? (
          <div className="w-full border border-gray-200 rounded-md p-3 text-sm bg-gray-50 whitespace-pre-wrap break-words min-h-[6rem]">
            {resolvedMessage.split(/\{\{(\w+)\}\}/).map((part, i) =>
              i % 2 === 0 ? (
                <span key={i} className="text-gray-400">
                  {part}
                </span>
              ) : (
                <span key={i} className="text-orange-400 font-medium">{`{{${part}}}`}</span>
              ),
            )}
          </div>
        ) : (
          <div className="w-full border border-gray-200 rounded-md p-3 text-sm text-gray-400 bg-gray-50 min-h-[6rem]">
            Seleccioná una plantilla para ver el mensaje.
          </div>
        )}
      </div>

      {/* Destinatarios */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Enviar a</label>
        {recipientsLoading ? (
          <p className="text-sm text-gray-400">Cargando destinatarios...</p>
        ) : (
          <div className="flex flex-col gap-2">
            {recipients.length === 0 ? (
              <p className="text-sm text-gray-400">No hay destinatarios disponibles.</p>
            ) : (
              recipients.map((r) => (
                <label key={r.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="recipient"
                    value={r.id}
                    checked={selectedRecipientId === r.id}
                    onChange={() => setSelectedRecipientId(r.id)}
                    className="accent-blue-500 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    {r.label}
                  </span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend || sending}
          className="px-6 py-2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? 'Enviando...' : 'Enviar anuncio'}
        </button>
      </div>
    </div>
  </div>
)

export default AnunciosContentMainPanel
