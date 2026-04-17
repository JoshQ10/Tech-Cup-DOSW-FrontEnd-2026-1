interface RolePagePlaceholderProps {
  title: string;
  subtitle?: string;
}

export default function RolePagePlaceholder({ title, subtitle }: RolePagePlaceholderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#000F20' }}>
      <div className="text-center px-6 py-10 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
        <h1 className="text-4xl text-white uppercase" style={{ fontFamily: "'Anton SC', sans-serif" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-white/75" style={{ fontFamily: "'Inter', sans-serif" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

