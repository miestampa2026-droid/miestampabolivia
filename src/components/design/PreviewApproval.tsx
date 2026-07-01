export function PreviewApproval({
  previewUrl,
  uploadWarning,
  onChangeDesign
}: {
  previewUrl: string
  uploadWarning: boolean
  onChangeDesign: () => void
}) {
  return (
    <div className="rounded-2xl bg-coral-light p-6 text-center sm:p-10">
      <div className="mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-card-md">
        {/* eslint-disable-next-line @next/next/no-img-element -- preview generado localmente vía Canvas */}
        <img src={previewUrl} alt="Preview de tu estampa" className="h-full w-full object-contain" />
      </div>

      <p className="mt-6 font-display text-xl font-bold text-charcoal">¿Así querés tu estampa?</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onChangeDesign}
          className="rounded-full border-2 border-coral px-7 py-3 font-display text-[15px] font-bold text-coral transition hover:bg-coral hover:text-white"
        >
          Cambiar diseño
        </button>
        <button
          type="button"
          disabled
          title="Disponible cuando esté listo el carrito (sección 06)"
          className="cursor-not-allowed rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white opacity-45"
        >
          Agregar al carrito
        </button>
      </div>
      <p className="mt-3 font-body text-xs text-gray-mid">
        Próximamente: agregalo al carrito (sección 06).
      </p>
      {uploadWarning && (
        <p className="mt-2 font-body text-xs text-brand-warning">
          El preview se generó bien, pero no se pudo guardar en el servidor. Se puede reintentar más adelante.
        </p>
      )}
    </div>
  )
}
