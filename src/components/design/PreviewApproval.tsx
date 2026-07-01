export function PreviewApproval({
  previewUrl,
  uploadWarning,
  onChangeDesign,
  onAddToCart
}: {
  previewUrl: string
  uploadWarning: boolean
  onChangeDesign: () => void
  onAddToCart: () => void
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
          onClick={onAddToCart}
          className="rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md"
        >
          Agregar al carrito
        </button>
      </div>
      {uploadWarning && (
        <p className="mt-3 font-body text-xs text-brand-warning">
          El preview se generó bien, pero no se pudo guardar en el servidor. Se puede reintentar más adelante.
        </p>
      )}
    </div>
  )
}
