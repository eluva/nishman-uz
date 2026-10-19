/**
 * Счётчик-«одометр»: цифры прокручиваются CSS-трансформом от 0 до значения.
 * Текст не переписывается кадр за кадром — элемент отрисован сразу (не задерживает LCP), работает без JS.
 * prefers-reduced-motion — сразу итоговое значение.
 */
export function Counter({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
  const chars = String(value).split('');
  return (
    <span className={`inline-flex ${className ?? ''}`} aria-label={`${value}${suffix}`} role="img">
      {chars.map((c, i) => (
        <span key={i} aria-hidden="true" className="relative inline-block h-[1em] overflow-hidden leading-none">
          {/* ширина колонки = ширине итоговой цифры (иначе «1» занимает место «0» и появляется зазор) */}
          <span className="invisible">{c}</span>
          <span
            className="odometer absolute left-0 top-0 block"
            style={{ '--d': Number(c), animationDelay: `${0.5 + i * 0.12}s` } as React.CSSProperties}
          >
            {Array.from({ length: 10 }, (_, d) => (
              <span key={d} className="block h-[1em] leading-none">
                {d}
              </span>
            ))}
          </span>
        </span>
      ))}
      <span aria-hidden="true" className="leading-none">
        {suffix}
      </span>
    </span>
  );
}
