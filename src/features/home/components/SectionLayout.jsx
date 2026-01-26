const SectionLayout = ({children, className = '', ...props}) => {
  return (
    <div className="w-full">
      {/* Shared wrapper to keep tab sections aligned in height and spacing. */}
      <div
        className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 min-h-[340px] ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

export default SectionLayout
